from flask import Flask, render_template, request, redirect, jsonify
from flask_cors import CORS
import threading
import webbrowser
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException
import time

app = Flask(__name__)
CORS(app)  # 모든 출처 허용

# 크롬드라이버 옵션 함수
def get_chrome_driver():
    options = webdriver.ChromeOptions()
    options.add_argument("--start-maximized")
    options.add_argument("--disable-notifications")
    # options.add_argument("--headless")  # GUI 없는 환경이면 활성화하세요
    options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36")
    driver = webdriver.Chrome(options=options)
    return driver

# 비교과 프로그램 크롤링 함수
def run_crawling(user_id=None, user_pw=None):
    driver = get_chrome_driver()
    wait = WebDriverWait(driver, 15)

    try:
        # 1. 로그인 페이지 접속
        driver.get("https://portal.sungshin.ac.kr/sso/login.jsp")

        # 2. 로그인 입력 (실제 input id가 맞는지 확인 필요)
        wait.until(EC.presence_of_element_located((By.ID, "loginId_pc"))).send_keys(user_id)
        wait.until(EC.presence_of_element_located((By.ID, "loginPwd_pc"))).send_keys(user_pw)
        login_btn = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "a.login_btn")))
        driver.execute_script("arguments[0].click();", login_btn)

        # 3. 팝업 처리 (있으면 accept)
        try:
            WebDriverWait(driver, 3).until(EC.alert_is_present()).accept()
        except TimeoutException:
            pass

        # 4. SunShine 메뉴 클릭
        wait.until(EC.element_to_be_clickable((By.XPATH, "//span[text()='SunShine']"))).click()

        # 새 창으로 전환
        original = driver.current_window_handle
        time.sleep(2)
        for handle in driver.window_handles:
            if handle != original:
                driver.switch_to.window(handle)
                break

        # 5. 팝업 닫기 버튼 클릭 (클래스명, xpath 확인 필요)
        try:
            time.sleep(2)
            close_btn = driver.find_element(By.XPATH, "//a[span[text()='닫기']]")
            close_btn.click()
        except NoSuchElementException:
            pass

        # 6. 비교과프로그램 메뉴 클릭 (href, alt 텍스트 등 확인)
        compare_btn = wait.until(EC.element_to_be_clickable((
            By.XPATH,
            "//a[contains(@href, '/site/reservation/lecture/lectureList')]/img[contains(@alt, '비교과프로그램')]"
        )))
        compare_btn.click()

        # 7. '진행 중' 탭 클릭
        ing_tab = wait.until(EC.element_to_be_clickable((By.XPATH, "//a[contains(text(), '진행 중')]")))
        ing_tab.click()

        time.sleep(2)  # 페이지 로딩 대기

        # 8. 프로그램 목록 수집 (링크와 제목)
        programs = []
        links = driver.find_elements(By.CSS_SELECTOR, "a.line")
        for link in links:
            href = link.get_attribute("href")
            title = link.text.strip()
            if href and title:
                programs.append({"title": title, "url": href})

        return programs

    except Exception as e:
        print("크롤링 중 오류:", e)
        return []
    finally:
        driver.quit()

# 비교과 프로그램 신청 자동화
def apply_by_clicking_program(program_title, user_id, user_pw):
    driver = get_chrome_driver()
    wait = WebDriverWait(driver, 15)

    try:
        driver.get("https://portal.sungshin.ac.kr/sso/login.jsp")
        wait.until(EC.presence_of_element_located((By.ID, "loginId_pc"))).send_keys(user_id)
        wait.until(EC.presence_of_element_located((By.ID, "loginPwd_pc"))).send_keys(user_pw)
        login_btn = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "a.login_btn")))
        driver.execute_script("arguments[0].click();", login_btn)

        try:
            WebDriverWait(driver, 3).until(EC.alert_is_present()).accept()
        except TimeoutException:
            pass

        wait.until(EC.element_to_be_clickable((By.XPATH, "//span[text()='SunShine']"))).click()

        original = driver.current_window_handle
        time.sleep(2)
        for handle in driver.window_handles:
            if handle != original:
                driver.switch_to.window(handle)
                break

        try:
            time.sleep(2)
            close_btn = driver.find_element(By.XPATH, "//a[span[text()='닫기']]")
            close_btn.click()
        except NoSuchElementException:
            pass

        wait.until(EC.element_to_be_clickable((By.LINK_TEXT, "비교과프로그램 신청"))).click()

        wait.until(EC.presence_of_element_located((By.CLASS_NAME, "boardList")))
        rows = driver.find_elements(By.CSS_SELECTOR, ".boardList tbody tr")
        for row in rows:
            if program_title in row.text:
                row.find_element(By.CSS_SELECTOR, "a").click()
                break

        # 추가 신청 자동화 로직 넣기 (필요 시)

    except Exception as e:
        print("신청 자동화 중 오류:", e)
    finally:
        driver.quit()

# Flask 라우팅

@app.route("/")
def home():
    # 기본 테스트용 빈 프로그램 리스트 (로그인 없이 크롤링은 안됨)
    return render_template("compare_programs.html", programs=[])

@app.route("/start-crawling", methods=["POST"])
def start_crawling_route():
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

@app.route("/apply", methods=["POST"])
def apply():
    program_title = request.form.get("title")
    user_id = request.form.get("user_id")
    user_pw = request.form.get("user_pw")

    if not (program_title and user_id and user_pw):
        return "필수 데이터 누락", 400

    threading.Thread(target=apply_by_clicking_program, args=(program_title, user_id, user_pw), daemon=True).start()
    return redirect("/")

# 서버 실행시 브라우저 자동 오픈
if __name__ == "__main__":
    def open_browser():
        webbrowser.open("http://localhost:5678")

    threading.Timer(1, open_browser).start()
    app.run(host="0.0.0.0", port=5678, debug=True)
