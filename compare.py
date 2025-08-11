from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import (
    NoAlertPresentException,
    TimeoutException,
    NoSuchElementException,
)
import time

# 0. 크롬 드라이버 설정
options = webdriver.ChromeOptions()
options.add_argument("start-maximized")
options.add_argument("--disable-notifications")
options.add_argument("user-agent=Mozilla/5.0")  # 모바일 회피
driver = webdriver.Chrome(options=options)
wait = WebDriverWait(driver, 10)

# 1. 로그인 페이지 접속
driver.get("https://portal.sungshin.ac.kr/sso/login.jsp")

# 2. 로그인 정보 입력
wait.until(EC.presence_of_element_located((By.ID, "loginId_pc"))).send_keys("20251248")
wait.until(EC.presence_of_element_located((By.ID, "loginPwd_pc"))).send_keys("dsfe")

# 3. 로그인 버튼 클릭
login_btn = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "a.login_btn")))
driver.execute_script("arguments[0].click();", login_btn)
print("✅ 로그인 버튼 클릭 완료")

# 4. 알림창 확인
try:
    WebDriverWait(driver, 3).until(EC.alert_is_present())
    alert = driver.switch_to.alert
    print("🔔 알림창 내용:", alert.text)
    alert.accept()
except (NoAlertPresentException, TimeoutException):
    print("❌ 알림창 없음 — 무시하고 진행")

# 5. SunShine 클릭 및 새 창 전환
original_window = driver.current_window_handle
wait.until(EC.element_to_be_clickable((By.XPATH, "//span[text()='SunShine']"))).click()
print("✅ SunShine 클릭 완료")

time.sleep(3)
for handle in driver.window_handles:
    if handle != original_window:
        driver.switch_to.window(handle)
        print("🔀 새 창으로 전환 완료")
        break

# 6. 닫기 버튼 클릭 시도
try:
    time.sleep(2)
    close_btn_hidden = driver.find_element(By.XPATH, "//a[span[text()='닫기']]")
    driver.execute_script("arguments[0].click();", close_btn_hidden)
    print("✅ 강제 닫기 버튼 클릭 성공 (display 상태 무시)")
except Exception as e:
    print("❌ 강제 닫기 버튼 클릭 실패:", e)

# 7. 비교과 프로그램 신청 버튼 클릭
try:
    time.sleep(2)
    compare_btn = WebDriverWait(driver, 5).until(
        EC.element_to_be_clickable((By.XPATH,
            "//a[contains(@href, '/site/reservation/lecture/lectureList')]/img[contains(@alt, '비교과프로그램')]"
        ))
    )
    compare_btn.click()
    print("✅ 비교과프로그램 신청 버튼 클릭 완료")
except Exception as e:
    print(f"❌ 비교과프로그램 신청 버튼 클릭 실패: {e}")
    with open("compare_program_click_failed.html", "w", encoding="utf-8") as f:
        f.write(driver.page_source)

# 8. '진행 중(신청가능)' 클릭
try:
    time.sleep(2)
    ongoing_btn = WebDriverWait(driver, 5).until(
        EC.element_to_be_clickable((By.XPATH, "//a[contains(text(), '진행 중')]"))
    )
    ongoing_btn.click()
    print("✅ '진행 중(신청가능)' 클릭 완료")
except Exception as e:
    print(f"❌ 진행중 버튼 클릭 실패: {e}")
    with open("ongoing_click_failed.html", "w", encoding="utf-8") as f:
        f.write(driver.page_source)

# 9. 프로그램 링크 크롤링
try:
    time.sleep(2)
    links = driver.find_elements(By.CSS_SELECTOR, "a.line")
    print(f"🔗 프로그램 링크 수집됨: {len(links)}개")

    for link in links:
        href = link.get_attribute("href")
        title = link.text.strip()
        print(f"📌 {title}\n🔗 {href}\n{'-'*40}")

except Exception as e:
    print(f"❌ 프로그램 링크 수집 실패: {e}")
    with open("program_links_failed.html", "w", encoding="utf-8") as f:
        f.write(driver.page_source)
