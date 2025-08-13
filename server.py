from flask import Flask, request, jsonify
from flask_cors import CORS
from compare_crawl_and_generate import run_crawling

app = Flask(__name__)
CORS(app)

@app.route("/start-crawling", methods=["POST"])
def start_crawling():
    data = request.get_json(force=True)
    user_id = data.get("user_id")
    user_pw = data.get("user_pw")

    if not user_id or not user_pw:
        return jsonify({"status": "error", "message": "아이디와 비밀번호를 입력하세요."}), 400

    programs = run_crawling(user_id, user_pw)
    if programs:
        return jsonify({"status": "success", "programs": programs})
    else:
        return jsonify({"status": "error", "message": "프로그램이 없거나 크롤링 실패"}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
