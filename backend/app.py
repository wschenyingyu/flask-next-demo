from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import sqlite3
import os
import hashlib
import datetime

app = Flask(__name__, static_folder='../.next/static', template_folder='../.next')
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
        price_per_day REAL,
        status TEXT DEFAULT 'available',
        description TEXT DEFAULT '',
        image TEXT DEFAULT '',
        owner_id INTEGER DEFAULT NULL,
        owner_name TEXT DEFAULT '',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
        role TEXT DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    cur.execute('''
    CREATE TABLE IF NOT EXISTS borrow_records(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        goods_id INTEGER,
        goods_name TEXT,
        user_id INTEGER,
        user_name TEXT,
        owner_id INTEGER,
        days INTEGER,
        total_price REAL,
        borrow_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        return_date TIMESTAMP DEFAULT NULL,
        status TEXT DEFAULT 'borrowed',
        is_returned INTEGER DEFAULT 0,
        deposit REAL DEFAULT 0.0
    )
    ''')
    cur.execute('''
    CREATE TABLE IF NOT EXISTS activities(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT DEFAULT '',
        activity_time TIMESTAMP,
        location TEXT DEFAULT '',
        image TEXT DEFAULT '',
        user_id INTEGER,
        user_name TEXT DEFAULT '',
        status TEXT DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    
    cur.execute("SELECT COUNT(*) FROM goods WHERE name = '冲击钻'")
    if cur.fetchone()[0] == 0:
        init_data = [
            ("冲击钻", "维修工具", 3.0, "available", "家用冲击钻，功能完好", "", 1, "admin"),
            ("投影仪", "影音家电", 8.0, "available", "高清投影仪，含幕布", "", 1, "admin"),
            ("露营帐篷", "户外用品", 5.0, "available", "4人帐篷，含防潮垫", "", 1, "admin"),
            ("折叠椅", "户外用品", 2.0, "available", "轻便折叠椅，承重100kg", "", 1, "admin"),
            ("自行车", "交通工具", 5.0, "available", "山地自行车，车况良好", "", 1, "admin"),
            ("相机", "摄影设备", 15.0, "available", "单反相机，含镜头", "", 1, "admin"),
            ("音响", "影音家电", 6.0, "available", "蓝牙音响，音质好", "", 1, "admin"),
            ("梯子", "维修工具", 4.0, "available", "伸缩梯子，最高3米", "", 1, "admin"),
            ("烧烤架", "户外用品", 8.0, "available", "便携烧烤架，含烤网", "", 1, "admin"),
            ("麻将桌", "娱乐用品", 10.0, "available", "自动麻将桌", "", 1, "admin")
        ]
        cur.executemany("INSERT INTO goods(name, category, price_per_day, status, description, image, owner_id, owner_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", init_data)
    
    cur.execute("SELECT COUNT(*) FROM users WHERE email = ?", ("admin@test.com",))
    if cur.fetchone()[0] == 0:
        admin_pwd = hashlib.md5("123456".encode()).hexdigest()
        cur.execute("INSERT INTO users(username, email, password, role) VALUES (?, ?, ?, ?)", 
                    ("admin", "admin@test.com", admin_pwd, "admin"))
    
    cur.execute("SELECT COUNT(*) FROM activities WHERE title = '社区亲子活动日'")
    if cur.fetchone()[0] == 0:
        activities_data = [
            ("社区亲子活动日", "带上小朋友一起来参加有趣的亲子游戏，增进亲子感情！", "2026-07-15 10:00", "小区广场", "", 1, "admin", "active"),
            ("夏日烧烤派对", "炎炎夏日，一起来一场美味的烧烤派对，认识更多邻居！", "2026-07-20 18:00", "小区花园", "", 1, "admin", "active"),
            ("图书交换活动", "把家里闲置的图书带来交换，让知识流动起来！", "2026-07-25 14:00", "社区活动室", "", 1, "admin", "active"),
            ("健康义诊活动", "免费为居民提供健康咨询和简单体检服务", "2026-07-30 09:00", "社区医院", "", 1, "admin", "active")
        ]
        cur.executemany("INSERT INTO activities(title, content, activity_time, location, image, user_id, user_name, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", activities_data)
    
    conn.commit()
    conn.close()

init_db()

@app.route("/api/index", methods=["GET"])
def index_api():
    return jsonify({"msg": "欢迎使用社区便民物品借用管理平台"})

@app.route("/api/goods", methods=["GET"])
def get_all_goods():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    rows = conn.execute("SELECT * FROM goods").fetchall()
    goods_list = [dict(row) for row in rows]
    conn.close()
    return jsonify({"code": 200, "data": goods_list, "msg": "物品查询成功"})

@app.route("/api/goods", methods=["POST"])
def add_goods():
    data = request.json
    name = data.get("name")
    category = data.get("category")
    price_per_day = data.get("price_per_day")
    description = data.get("description", "")
    image = data.get("image", "")
    owner_id = data.get("owner_id", 1)
    owner_name = data.get("owner_name", "admin")
    
    if not name or not price_per_day:
        return jsonify({"code": 400, "msg": "物品名称、单日租赁价格不能为空"}), 400
    
    conn = sqlite3.connect(DB_FILE)
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO goods(name, category, price_per_day, description, image, owner_id, owner_name) VALUES (?, ?, ?, ?, ?, ?, ?)",
        (name, category, float(price_per_day), description, image, owner_id, owner_name)
    )
    conn.commit()
    conn.close()
    return jsonify({"code": 200, "msg": "闲置物品发布成功"})

@app.route("/api/delete_goods/<int:id>", methods=["DELETE"])
def delete_goods(id):
    conn = sqlite3.connect(DB_FILE)
    cur = conn.cursor()
    cur.execute("DELETE FROM goods WHERE id = ?", (id,))
    conn.commit()
    conn.close()
    return jsonify({"code": 200, "msg": "物品删除成功"})

@app.route("/api/calc_rent", methods=["GET", "POST"])
def calc_rent():
    try:
        if request.method == "GET":
            day = float(request.args.get("day"))
            unit_price = float(request.args.get("price"))
        else:
            data = request.json
            day = float(data.get("day"))
            unit_price = float(data.get("price"))
        
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

@app.route("/api/user/<int:id>", methods=["GET"])
def get_user(id):
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()
    try:
        cur.execute("SELECT * FROM users WHERE id = ?", (id,))
        user = cur.fetchone()
        
        if not user:
            return jsonify({"code": 400, "msg": "用户不存在"}), 400
        
        user_data = dict(user)
        user_data.pop("password")
        return jsonify({"code": 200, "data": user_data, "msg": "用户查询成功"})
    except Exception as e:
        return jsonify({"code": 500, "msg": "查询失败"}), 500
    finally:
        conn.close()

@app.route("/api/update_user/<int:id>", methods=["POST"])
def update_user(id):
    data = request.json
    username = data.get("username")
    phone = data.get("phone")
    avatar = data.get("avatar", "")
    
    conn = sqlite3.connect(DB_FILE)
    cur = conn.cursor()
    try:
        cur.execute("UPDATE users SET username = ?, phone = ?, avatar = ? WHERE id = ?", 
                    (username, phone, avatar, id))
        conn.commit()
        return jsonify({"code": 200, "msg": "用户信息更新成功"})
    except Exception as e:
        conn.rollback()
        return jsonify({"code": 500, "msg": "更新失败"}), 500
    finally:
        conn.close()

@app.route("/api/upload_avatar", methods=["POST"])
def upload_avatar():
    return jsonify({"code": 200, "msg": "头像上传成功", "data": {"avatar_url": "avatar.png"}})

@app.route("/api/borrow_records", methods=["GET"])
def get_borrow_records():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    rows = conn.execute("SELECT * FROM borrow_records").fetchall()
    records_list = [dict(row) for row in rows]
    conn.close()
    return jsonify({"code": 200, "data": records_list, "msg": "借用记录查询成功"})

@app.route("/api/borrow_records", methods=["POST"])
def add_borrow_record():
    data = request.json
    goods_id = data.get("goods_id")
    goods_name = data.get("goods_name")
    user_id = data.get("user_id")
    user_name = data.get("user_name")
    owner_id = data.get("owner_id")
    days = data.get("days")
    total_price = data.get("total_price")
    deposit = data.get("deposit", 0.0)
    
    conn = sqlite3.connect(DB_FILE)
    cur = conn.cursor()
    try:
        cur.execute("""
            INSERT INTO borrow_records(goods_id, goods_name, user_id, user_name, owner_id, days, total_price, deposit)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (goods_id, goods_name, user_id, user_name, owner_id, days, total_price, deposit))
        
        cur.execute("UPDATE goods SET status = 'borrowed' WHERE id = ?", (goods_id,))
        conn.commit()
        return jsonify({"code": 200, "msg": "借用申请提交成功"})
    except Exception as e:
        conn.rollback()
        return jsonify({"code": 500, "msg": "提交失败"}), 500
    finally:
        conn.close()

@app.route("/api/return_goods/<int:id>", methods=["POST"])
def return_goods(id):
    conn = sqlite3.connect(DB_FILE)
    cur = conn.cursor()
    try:
        cur.execute("SELECT goods_id FROM borrow_records WHERE id = ?", (id,))
        record = cur.fetchone()
        if record:
            cur.execute("UPDATE goods SET status = 'available' WHERE id = ?", (record[0],))
        
        cur.execute("UPDATE borrow_records SET status = 'returned', is_returned = 1, return_date = CURRENT_TIMESTAMP WHERE id = ?", (id,))
        conn.commit()
        return jsonify({"code": 200, "msg": "归还成功"})
    except Exception as e:
        conn.rollback()
        return jsonify({"code": 500, "msg": "归还失败"}), 500
    finally:
        conn.close()

@app.route("/api/activities", methods=["GET"])
def get_activities():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    rows = conn.execute("SELECT * FROM activities").fetchall()
    activities_list = [dict(row) for row in rows]
    conn.close()
    return jsonify({"code": 200, "data": activities_list, "msg": "活动查询成功"})

@app.route("/api/activities", methods=["POST"])
def add_activity():
    data = request.json
    title = data.get("title")
    content = data.get("content", "")
    activity_time = data.get("activity_time")
    location = data.get("location", "")
    image = data.get("image", "")
    user_id = data.get("user_id", 1)
    user_name = data.get("user_name", "admin")
    
    if not title:
        return jsonify({"code": 400, "msg": "活动标题不能为空"}), 400
    
    conn = sqlite3.connect(DB_FILE)
    cur = conn.cursor()
    try:
        cur.execute("""
            INSERT INTO activities(title, content, activity_time, location, image, user_id, user_name)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (title, content, activity_time, location, image, user_id, user_name))
        conn.commit()
        return jsonify({"code": 200, "msg": "活动发布成功"})
    except Exception as e:
        conn.rollback()
        return jsonify({"code": 500, "msg": "发布失败"}), 500
    finally:
        conn.close()

@app.route("/api/upload_activity_image", methods=["POST"])
def upload_activity_image():
    return jsonify({"code": 200, "msg": "活动图片上传成功", "data": {"image_url": "activity.png"}})

@app.route('/_next/static/<path:path>')
def next_static(path):
    return send_from_directory('../.next/static', path)

@app.route('/')
def serve_index():
    return send_from_directory('../', 'index.html')

@app.errorhandler(404)
def not_found(e):
    return send_from_directory('../', 'index.html')

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", debug=False, port=port)