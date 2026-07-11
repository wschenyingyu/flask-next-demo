from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
import os

app = Flask(__name__)
CORS(app)
DB_FILE = "goods.db"

def init_db():
    if not os.path.exists(DB_FILE):
        conn = sqlite3.connect(DB_FILE)
        cur = conn.cursor()
        cur.execute('''
        CREATE TABLE IF NOT EXISTS goods(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            category TEXT,
            price_per_day REAL
        )
        ''')
        init_data = [
            ("冲击钻", "维修工具", 3.0),
            ("投影仪", "影音家电", 8.0),
            ("露营帐篷", "户外用品", 5.0)
        ]
        cur.executemany("INSERT INTO goods(name, category, price_per_day) VALUES (?, ?, ?)", init_data)
        conn.commit()
        conn.close()

init_db()

@app.route("/api/index", methods=["GET"])
def index():
    return jsonify({"msg": "欢迎使用社区便民物品借用管理平台"})

@app.route("/api/goods", methods=["GET"])
def get_all_goods():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    rows = conn.execute("SELECT * FROM goods").fetchall()
    goods_list = [dict(row) for row in rows]
    conn.close()
    return jsonify({"code": 200, "data": goods_list, "msg": "物品查询成功"})

@app.route("/api/add_goods", methods=["POST"])
def add_goods():
    data = request.json
    name = data.get("name")
    category = data.get("category")
    price_per_day = data.get("price_per_day")
    if not name or not price_per_day:
        return jsonify({"code": 400, "msg": "物品名称、单日租赁价格不能为空"}), 400
    conn = sqlite3.connect(DB_FILE)
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO goods(name, category, price_per_day) VALUES (?, ?, ?)",
        (name, category, float(price_per_day))
    )
    conn.commit()
    conn.close()
    return jsonify({"code": 200, "msg": "闲置物品发布成功"})

@app.route("/api/calc_rent", methods=["GET"])
def calc_rent():
    try:
        day = float(request.args.get("day"))
        unit_price = float(request.args.get("price"))
        total = day * unit_price
        return jsonify({"code": 200, "total_rent": total, "msg": "费用计算完成"})
    except:
        return jsonify({"code": 400, "msg": "天数、单价必须输入数字"}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)