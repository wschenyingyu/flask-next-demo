from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
import os
import hashlib

app = Flask(__name__)
CORS(app)
DB_FILE = os.environ.get("DB_FILE", "goods.db")

def init_db():
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
    cur.execute('''
    CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        avatar TEXT DEFAULT '',
        phone TEXT DEFAULT '',
        role TEXT DEFAULT 'user'
    )
    ''')
    init_data = [
        ("冲击钻", "维修工具", 3.0),
        ("投影仪", "影音家电", 8.0),
        ("露营帐篷", "户外用品", 5.0)
    ]
    cur.executemany("INSERT INTO goods(name, category, price_per_day) VALUES (?, ?, ?)", init_data)
    cur.execute("SELECT COUNT(*) FROM users WHERE email = ?", ("admin@test.com",))
    if cur.fetchone()[0] == 0:
        admin_pwd = hashlib.md5("123456".encode()).hexdigest()
        cur.execute("INSERT INTO users(username, email, password, role) VALUES (?, ?, ?, ?)", 
                    ("admin", "admin@test.com", admin_pwd, "admin"))
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

@app.route("/api/register", methods=["POST"])
def register():
    data = request.json
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    
    if not username or not email or not password:
        return jsonify({"code": 400, "msg": "用户名、邮箱、密码不能为空"}), 400
    
    conn = sqlite3.connect(DB_FILE)
    cur = conn.cursor()
    try:
        cur.execute("SELECT COUNT(*) FROM users WHERE email = ?", (email,))
        if cur.fetchone()[0] > 0:
            return jsonify({"code": 400, "msg": "该邮箱已被注册"}), 400
        
        hashed_pwd = hashlib.md5(password.encode()).hexdigest()
        cur.execute("INSERT INTO users(username, email, password) VALUES (?, ?, ?)", 
                    (username, email, hashed_pwd))
        conn.commit()
        return jsonify({"code": 200, "msg": "注册成功"})
    except Exception as e:
        conn.rollback()
        return jsonify({"code": 500, "msg": "注册失败"}), 500
    finally:
        conn.close()

@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")
    
    if not email or not password:
        return jsonify({"code": 400, "msg": "邮箱、密码不能为空"}), 400
    
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()
    try:
        hashed_pwd = hashlib.md5(password.encode()).hexdigest()
        cur.execute("SELECT * FROM users WHERE email = ? AND password = ?", (email, hashed_pwd))
        user = cur.fetchone()
        
        if not user:
            return jsonify({"code": 400, "msg": "邮箱或密码错误"}), 400
        
        user_data = dict(user)
        user_data.pop("password")
        return jsonify({"code": 200, "data": user_data, "msg": "登录成功"})
    except Exception as e:
        return jsonify({"code": 500, "msg": "登录失败"}), 500
    finally:
        conn.close()

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", debug=False, port=port)