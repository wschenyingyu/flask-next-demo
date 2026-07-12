from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import sqlite3
import os
from datetime import datetime
import hashlib
import uuid

app = Flask(__name__)
CORS(app)
DB_FILE = "goods.db"
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def get_db():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = sqlite3.connect(DB_FILE)
    cur = conn.cursor()

    # 用户表
    cur.execute('''
    CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        avatar TEXT DEFAULT '',
        phone TEXT DEFAULT '',
        role TEXT DEFAULT 'user',
        created_at TEXT
    )
    ''')

    # 物品表（加图片字段）
    cur.execute('''
    CREATE TABLE IF NOT EXISTS goods(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT,
        price_per_day REAL,
        status TEXT DEFAULT 'available',
        image TEXT DEFAULT '',
        description TEXT DEFAULT '',
        owner_id INTEGER,
        owner_name TEXT,
        created_at TEXT
    )
    ''')

    # 借出记录表
    cur.execute('''
    CREATE TABLE IF NOT EXISTS borrow_records(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        goods_id INTEGER,
        goods_name TEXT,
        borrower_id INTEGER,
        borrower_name TEXT,
        owner_id INTEGER,
        days INTEGER,
        total_rent REAL,
        borrow_date TEXT,
        return_date TEXT,
        status TEXT DEFAULT 'borrowed',
        need_move BOOLEAN DEFAULT 0,
        move_fee REAL DEFAULT 0
    )
    ''')

    # 社区活动表
    cur.execute('''
    CREATE TABLE IF NOT EXISTS activities(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        date TEXT,
        location TEXT,
        image TEXT DEFAULT '',
        organizer_id INTEGER,
        organizer_name TEXT,
        status TEXT DEFAULT 'active',
        created_at TEXT
    )
    ''')

    # 默认管理员（如果没有用户）
    user_count = cur.execute("SELECT COUNT(*) FROM users").fetchone()[0]
    if user_count == 0:
        cur.execute('''
            INSERT INTO users(username, email, password, role, created_at)
            VALUES (?, ?, ?, ?, ?)
        ''', ('admin', 'admin@test.com', hashlib.md5('123456'.encode()).hexdigest(), 'admin', datetime.now().strftime("%Y-%m-%d %H:%M")))

    # 默认物品（如果没有）
    goods_count = cur.execute("SELECT COUNT(*) FROM goods").fetchone()[0]
    if goods_count == 0:
        init_data = [
            ("冲击钻", "维修工具", 3.0, "", "家用冲击钻，功能完好", 1, "admin"),
            ("投影仪", "影音家电", 8.0, "", "高清投影仪，含幕布", 1, "admin"),
            ("露营帐篷", "户外用品", 5.0, "", "4人帐篷，含防潮垫", 1, "admin"),
            ("折叠椅", "户外用品", 2.0, "", "轻便折叠椅，承重100kg", 1, "admin")
        ]
        cur.executemany('''
            INSERT INTO goods(name, category, price_per_day, image, description, owner_id, owner_name, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', [(d[0], d[1], d[2], d[3], d[4], d[5], d[6], datetime.now().strftime("%Y-%m-%d %H:%M")) for d in init_data])

    # 默认活动（如果没有）
    activity_count = cur.execute("SELECT COUNT(*) FROM activities").fetchone()[0]
    if activity_count == 0:
        activities_data = [
            ("社区亲子活动日", "带上小朋友一起来参加有趣的亲子游戏，增进亲子感情！", "2026-07-15 10:00", "小区广场", "admin"),
            ("夏日烧烤派对", "炎炎夏日，一起来一场美味的烧烤派对，认识更多邻居！", "2026-07-20 18:00", "小区花园", "admin"),
            ("图书交换活动", "把家里闲置的图书带来交换，让知识流动起来！", "2026-07-25 14:00", "社区活动室", "admin"),
            ("健康义诊活动", "免费为居民提供健康咨询和简单体检服务", "2026-07-30 09:00", "社区医院", "admin")
        ]
        cur.executemany('''
            INSERT INTO activities(title, description, date, location, image, organizer_id, organizer_name, created_at)
            VALUES (?, ?, ?, ?, '', 1, ?, ?)
        ''', [(d[0], d[1], d[2], d[3], d[4], datetime.now().strftime("%Y-%m-%d %H:%M")) for d in activities_data])

    conn.commit()
    conn.close()

init_db()

def hash_password(password):
    return hashlib.md5(password.encode()).hexdigest()

# --- 图片上传接口 ---

@app.route("/api/upload_avatar", methods=["POST"])
def upload_avatar():
    if "file" not in request.files:
        return jsonify({"code": 400, "msg": "请选择文件"}), 400
    
    file = request.files["file"]
    user_id = request.form.get("user_id")
    
    if not user_id:
        return jsonify({"code": 400, "msg": "用户ID不能为空"}), 400
    
    filename = f"avatar_{user_id}_{uuid.uuid4().hex[:8]}.jpg"
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)
    
    conn = get_db()
    cur = conn.cursor()
    cur.execute("UPDATE users SET avatar = ? WHERE id = ?", (filename, user_id))
    conn.commit()
    conn.close()
    
    return jsonify({"code": 200, "msg": "头像上传成功", "avatar": filename})

@app.route("/api/upload_activity_image", methods=["POST"])
def upload_activity_image():
    if "file" not in request.files:
        return jsonify({"code": 400, "msg": "请选择文件"}), 400
    
    file = request.files["file"]
    activity_id = request.form.get("activity_id")
    
    if not activity_id:
        return jsonify({"code": 400, "msg": "活动ID不能为空"}), 400
    
    filename = f"activity_{activity_id}_{uuid.uuid4().hex[:8]}.jpg"
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)
    
    conn = get_db()
    cur = conn.cursor()
    cur.execute("UPDATE activities SET image = ? WHERE id = ?", (filename, activity_id))
    conn.commit()
    conn.close()
    
    return jsonify({"code": 200, "msg": "图片上传成功", "image": filename})

@app.route("/uploads/<filename>", methods=["GET"])
def serve_uploads(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

# --- 用户接口 ---

@app.route("/api/register", methods=["POST"])
def register():
    data = request.json
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not username or not email or not password:
        return jsonify({"code": 400, "msg": "用户名、邮箱、密码不能为空"}), 400

    conn = get_db()
    cur = conn.cursor()

    try:
        cur.execute("INSERT INTO users(username, email, password, role, created_at) VALUES (?, ?, ?, 'user', ?)",
                    (username, email, hash_password(password), datetime.now().strftime("%Y-%m-%d %H:%M")))
        conn.commit()
        return jsonify({"code": 200, "msg": "注册成功"})
    except sqlite3.IntegrityError:
        return jsonify({"code": 400, "msg": "用户名或邮箱已存在"}), 400
    finally:
        conn.close()

@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    conn = get_db()
    cur = conn.cursor()
    user = cur.execute("SELECT * FROM users WHERE email = ? AND password = ?",
                       (email, hash_password(password))).fetchone()
    conn.close()

    if user:
        return jsonify({
            "code": 200,
            "msg": "登录成功",
            "data": {
                "id": user["id"],
                "username": user["username"],
                "email": user["email"],
                "avatar": user["avatar"],
                "phone": user["phone"],
                "role": user["role"]
            }
        })
    else:
        return jsonify({"code": 400, "msg": "邮箱或密码错误"}), 400

@app.route("/api/user/<int:user_id>", methods=["GET"])
def get_user(user_id):
    conn = get_db()
    user = conn.execute("SELECT id, username, email, avatar, phone, role, created_at FROM users WHERE id = ?", (user_id,)).fetchone()
    conn.close()
    if user:
        return jsonify({"code": 200, "data": dict(user)})
    return jsonify({"code": 404, "msg": "用户不存在"}), 404

@app.route("/api/update_user/<int:user_id>", methods=["POST"])
def update_user(user_id):
    data = request.json
    username = data.get("username")
    phone = data.get("phone")
    
    conn = get_db()
    cur = conn.cursor()
    cur.execute("UPDATE users SET username = ?, phone = ? WHERE id = ?", (username, phone, user_id))
    conn.commit()
    conn.close()
    return jsonify({"code": 200, "msg": "更新成功"})

# --- 物品接口 ---

@app.route("/api/goods", methods=["GET"])
def get_all_goods():
    category = request.args.get("category")
    conn = get_db()
    if category and category != "全部":
        rows = conn.execute("SELECT * FROM goods WHERE category LIKE ? ORDER BY id DESC", (f"%{category}%",)).fetchall()
    else:
        rows = conn.execute("SELECT * FROM goods ORDER BY id DESC").fetchall()
    goods_list = [dict(row) for row in rows]
    conn.close()
    return jsonify({"code": 200, "data": goods_list, "msg": "物品查询成功"})

@app.route("/api/goods/<int:goods_id>", methods=["GET"])
def get_goods(goods_id):
    conn = get_db()
    goods = conn.execute("SELECT * FROM goods WHERE id = ?", (goods_id,)).fetchone()
    conn.close()
    if goods:
        return jsonify({"code": 200, "data": dict(goods)})
    return jsonify({"code": 404, "msg": "物品不存在"}), 404

@app.route("/api/add_goods", methods=["POST"])
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

    conn = get_db()
    cur = conn.cursor()
    cur.execute('''
        INSERT INTO goods(name, category, price_per_day, image, description, owner_id, owner_name, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', (name, category, float(price_per_day), image, description, owner_id, owner_name, datetime.now().strftime("%Y-%m-%d %H:%M")))
    conn.commit()
    conn.close()
    return jsonify({"code": 200, "msg": "闲置物品发布成功"})

@app.route("/api/delete_goods/<int:goods_id>", methods=["DELETE"])
def delete_goods(goods_id):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("DELETE FROM goods WHERE id = ?", (goods_id,))
    conn.commit()
    conn.close()
    return jsonify({"code": 200, "msg": "物品删除成功"})

# --- 借用接口 ---

@app.route("/api/borrow_goods", methods=["POST"])
def borrow_goods():
    data = request.json
    goods_id = data.get("goods_id")
    borrower_id = data.get("borrower_id", 1)
    borrower_name = data.get("borrower_name")
    days = data.get("days")
    need_move = data.get("need_move", False)

    if not borrower_name or not days:
        return jsonify({"code": 400, "msg": "借用人姓名和借用天数不能为空"}), 400

    conn = get_db()
    cur = conn.cursor()

    goods = cur.execute("SELECT * FROM goods WHERE id = ?", (goods_id,)).fetchone()
    if not goods:
        conn.close()
        return jsonify({"code": 404, "msg": "物品不存在"}), 404

    if goods["status"] == "borrowed":
        conn.close()
        return jsonify({"code": 400, "msg": "该物品已被借出"}), 400

    base_rent = float(days) * goods["price_per_day"]
    move_fee = base_rent * 0.3 if need_move else 0
    total_rent = base_rent + move_fee
    borrow_date = datetime.now().strftime("%Y-%m-%d %H:%M")

    cur.execute("UPDATE goods SET status = 'borrowed' WHERE id = ?", (goods_id,))

    cur.execute('''
        INSERT INTO borrow_records(goods_id, goods_name, borrower_id, borrower_name, owner_id, days, total_rent, borrow_date, status, need_move, move_fee)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'borrowed', ?, ?)
    ''', (goods_id, goods["name"], borrower_id, borrower_name, goods["owner_id"], int(days), total_rent, borrow_date, 1 if need_move else 0, move_fee))

    conn.commit()
    conn.close()
    return jsonify({"code": 200, "total_rent": total_rent, "move_fee": move_fee, "msg": "借用成功"})

@app.route("/api/return_goods/<int:goods_id>", methods=["POST"])
def return_goods(goods_id):
    conn = get_db()
    cur = conn.cursor()
    return_date = datetime.now().strftime("%Y-%m-%d %H:%M")
    cur.execute("UPDATE goods SET status = 'available' WHERE id = ?", (goods_id,))
    cur.execute('''
        UPDATE borrow_records SET status = 'returned', return_date = ?
        WHERE goods_id = ? AND status = 'borrowed'
    ''', (return_date, goods_id))
    conn.commit()
    conn.close()
    return jsonify({"code": 200, "msg": "归还成功"})

@app.route("/api/borrow_records", methods=["GET"])
def get_borrow_records():
    user_id = request.args.get("user_id")
    conn = get_db()
    if user_id:
        rows = conn.execute("SELECT * FROM borrow_records WHERE borrower_id = ? OR owner_id = ? ORDER BY id DESC", (user_id, user_id)).fetchall()
    else:
        rows = conn.execute("SELECT * FROM borrow_records ORDER BY id DESC").fetchall()
    records = [dict(row) for row in rows]
    conn.close()
    return jsonify({"code": 200, "data": records, "msg": "查询成功"})

# --- 活动接口 ---

@app.route("/api/activities", methods=["GET"])
def get_activities():
    conn = get_db()
    rows = conn.execute("SELECT * FROM activities WHERE status = 'active' ORDER BY date DESC").fetchall()
    activities = [dict(row) for row in rows]
    conn.close()
    return jsonify({"code": 200, "data": activities, "msg": "查询成功"})

@app.route("/api/add_activity", methods=["POST"])
def add_activity():
    data = request.json
    title = data.get("title")
    description = data.get("description", "")
    date = data.get("date")
    location = data.get("location")
    image = data.get("image", "")
    organizer_id = data.get("organizer_id", 1)
    organizer_name = data.get("organizer_name", "admin")

    if not title or not date or not location:
        return jsonify({"code": 400, "msg": "标题、日期、地点不能为空"}), 400

    conn = get_db()
    cur = conn.cursor()
    cur.execute('''
        INSERT INTO activities(title, description, date, location, image, organizer_id, organizer_name, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', (title, description, date, location, image, organizer_id, organizer_name, datetime.now().strftime("%Y-%m-%d %H:%M")))
    conn.commit()
    conn.close()
    return jsonify({"code": 200, "msg": "活动发布成功"})

# --- 统计接口 ---

@app.route("/api/stats", methods=["GET"])
def get_stats():
    conn = get_db()
    total = conn.execute("SELECT COUNT(*) FROM goods").fetchone()[0]
    available = conn.execute("SELECT COUNT(*) FROM goods WHERE status = 'available'").fetchone()[0]
    borrowed = conn.execute("SELECT COUNT(*) FROM goods WHERE status = 'borrowed'").fetchone()[0]
    category_count = conn.execute("SELECT COUNT(DISTINCT category) FROM goods").fetchone()[0]
    user_count = conn.execute("SELECT COUNT(*) FROM users").fetchone()[0]
    activity_count = conn.execute("SELECT COUNT(*) FROM activities").fetchone()[0]
    borrow_count = conn.execute("SELECT COUNT(*) FROM borrow_records").fetchone()[0]
    conn.close()
    return jsonify({
        "code": 200,
        "data": {
            "total": total,
            "available": available,
            "borrowed": borrowed,
            "category_count": category_count,
            "user_count": user_count,
            "activity_count": activity_count,
            "borrow_count": borrow_count
        }
    })

# --- 首页欢迎 ---

@app.route("/api/index", methods=["GET"])
def index():
    return jsonify({"msg": "欢迎使用社区便民物品借用管理平台"})

# --- 费用计算 ---

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