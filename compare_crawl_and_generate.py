from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException,NoAlertPresentException
import time
from webdriver_manager.chrome import ChromeDriverManager

PC_USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/114.0.0.0 Safari/537.36"
)

def run_crawling(username, password):
    options = webdriver.ChromeOptions()
    options.add_argument("--start-maximized")
    options.add_argument("--disable-notifications")
    options.add_argument(f"user-agent={PC_USER_AGENT}")

    
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")

    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)

    wait = WebDriverWait(driver, 10)

    try:
        driver.get("https://portal.sungshin.ac.kr/sso/login.jsp")
       

        login_id = wait.until(EC.element_to_be_clickable((By.ID, "loginId_pc")))
        login_id.click()
        login_id.clear()
        login_id.send_keys(username)
       

        login_pw = wait.until(EC.element_to_be_clickable((By.ID, "loginPwd_pc")))
        login_pw.click()
        login_pw.clear()
        login_pw.send_keys(password)
        

        login_btn = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "a.login_btn")))
        driver.execute_script("arguments[0].click();", login_btn)
        

        original_window = driver.current_window_handle
        wait.until(EC.element_to_be_clickable((By.XPATH, "//span[text()='SunShine']"))).click()
        time.sleep(3)

        for handle in driver.window_handles:
            if handle != original_window:
                driver.switch_to.window(handle)
                break

        try:
            time.sleep(2)
            driver.find_element(By.XPATH, "//a[span[text()='닫기']]").click()
        except Exception as e:
            

        time.sleep(2)
        compare_btn = wait.until(EC.element_to_be_clickable((
            By.XPATH,
            "//a[contains(@href, '/site/reservation/lecture/lectureList')]/img[contains(@alt, '비교과프로그램')]"
        )))
        compare_btn.click()
       

        time.sleep(2)
        ing_btn = wait.until(EC.element_to_be_clickable((By.XPATH, "//a[contains(text(), '진행 중')]")))
        ing_btn.click()
        

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
        import traceback
        print("크롤링 오류:", e)
        traceback.print_exc()
        driver.quit()
        return []
