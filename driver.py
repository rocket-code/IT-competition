from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

def auto_login_and_open(target_url):
    options = webdriver.ChromeOptions()
    options.add_argument("start-maximized")
    options.add_argument("--disable-notifications")
    options.add_argument("user-agent=Mozilla/5.0")

    driver = webdriver.Chrome(options=options)
    wait = WebDriverWait(driver, 10)

    # 로그인
    driver.get("https://portal.sungshin.ac.kr/sso/login.jsp")
    wait.until(EC.presence_of_element_located((By.ID, "loginId_pc"))).send_keys("아이디")
    wait.until(EC.presence_of_element_located((By.ID, "loginPwd_pc"))).send_keys("비밀번호")
    login_btn = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "a.login_btn")))
    driver.execute_script("arguments[0].click();", login_btn)
    print("✅ 로그인 완료")

    # 알림창 처리
    try:
        WebDriverWait(driver, 3).until(EC.alert_is_present()).accept()
    except:
        pass

    # SunShine 클릭
    wait.until(EC.element_to_be_clickable((By.XPATH, "//span[text()='SunShine']"))).click()
    time.sleep(3)
    for handle in driver.window_handles:
        driver.switch_to.window(handle)

    # 닫기 버튼 처리
    try:
        time.sleep(1)
        close_btn = driver.find_element(By.XPATH, "//a[span[text()='닫기']]")
        driver.execute_script("arguments[0].click();", close_btn)
    except:
        pass

    # 해당 프로그램 URL로 이동
    time.sleep(2)
    driver.get(target_url)
    print("✅ 신청 페이지 이동 완료")
