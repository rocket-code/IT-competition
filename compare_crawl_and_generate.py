from flask import Flask, request, jsonify
from flask_cors import CORS
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoAlertPresentException, TimeoutException
import time

app = Flask(__name__)
CORS(app)  # 모든 출처 허용

PC_USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/114.0.0.0 Safari/537.36"
)

def run_crawling(username, password):
    options = webdriver.ChromeOptions()
    options.add_argument("start-maximized")
    options.add_argument("--disable-notifications")
    options.add_argument(f"user-agent={PC_USER_AGENT}")

    # headless 모드 추가 (서버 GUI 없을 때 필요)
    options.add_argument("--headless=new")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")

    driver = webdriver.Chrome(options=options)
    wait = WebDriverWait(driver, 10)

    try:
        driver.get("https://portal.sungshin.ac.kr/sso/login.jsp")
        wait.until(EC.presence_of_element_located((By.ID, "loginId_pc"))).send_keys(username)
        wait.until(EC.presence_of_element_located((By.ID, "loginPwd_pc"))).send_keys(password)
        login_btn = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "a.login_btn")))
        driver.execute_script("arguments[0].click();", login_btn)

        # 팝업 처리
        try:
            WebDriverWait(driver, 3).until(EC.alert_is_present()).accept()
        except (NoAlertPresentException, TimeoutException):
            pass

        # SunShine 새 창으로 이동
        original_window = driver.current_window_handle
        wait.until(EC.element_to_be_clickable((By.XPATH, "//span[text()='SunShine']"))).click()
        time.sleep(3)
        for handle in driver.window_handles:
            if handle != original_window:
                driver.switch_to.window(handle)
                break

        # 팝업 닫기
        try:
            time.sleep(2)
            driver.find_element(By.XPATH, "//a[span[text()='닫기']]").click()
        except:
            pass

        # 비교과 프로그램 클릭
        time.sleep(2)
        compare_btn = wait.until(EC.element_to_be_clickable((
            By.XPATH,
            "//a[contains(@href, '/site/reservation/lecture/lectureList')]/img[contains(@alt, '비교과프로그램')]"
        )))
        compare_btn.click()

        # 진행 중 탭 클릭
        time.sleep(2)
        ing_btn = wait.until(EC.element_to_be_clickable((By.XPATH, "//a[contains(text(), '진행 중')]")))
        ing_btn.click()

        # 프로그램 목록 수집
        time.sleep(2)
        programs = []
        links = driver.find_elements(By.CSS_SELECTOR, "a.line")
        for link in links:
            href = link.get_attribute("href")
            title = link.text.strip()
            if href and title:
                programs.append({"title": title, "url": href})

        driver.quit()
        return programs

    except Exception as e:
        driver.quit()
        print("크롤링 오류:", e)
        return []

@app.route("/start-crawling", methods=["GET", "POST"])
def start_crawling():
    if request.method == "POST":
        data = request.get_json()
        user_id = data.get("user_id")
        user_pw = data.get("user_pw")

        if not user_id or not user_pw:
            return jsonify({"status": "error", "message": "아이디와 비밀번호를 입력하세요."}), 400

        programs = run_crawling(user_id, user_pw)
        if programs:
            return jsonify({"status": "success", "programs": programs})
        else:
            return jsonify({"status": "error", "message": "프로그램이 없거나 크롤링 실패"}), 500
    else:
        # GET 요청 시 상태 확인용 JSON 반환
        return jsonify({"status": "ready", "message": "POST로 로그인 정보를 보내주세요."})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5678, debug=True)
