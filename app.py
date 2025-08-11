from flask import Flask, request, jsonify
from selenium import webdriver
from selenium.webdriver.common.by import By
import time

app = Flask(__name__)

@app.route('/start-crawling', methods=['POST'])
def start_crawling():
    data = request.get_json()
    user_id = data.get("user_id")
    user_pw = data.get("user_pw")

    try:
        # 셀레니움 설정
        options = webdriver.ChromeOptions()
        options.add_argument("--headless")
        driver = webdriver.Chrome(options=options)

        driver.get("https://sungshin.ac.kr/portal")  # 로그인 페이지 URL로 변경

        # 로그인 입력
        driver.find_element(By.ID, "username").send_keys(user_id)
        driver.find_element(By.ID, "password").send_keys(user_pw)
        driver.find_element(By.ID, "loginBtn").click()

        time.sleep(2)  # 로그인 대기

        # 크롤링 로직 작성
        # 예: driver.find_element(By.XPATH, "...").click()

        driver.quit()
        return jsonify({"status": "success", "message": "크롤링 완료"})

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
