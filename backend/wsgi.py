# gunicorn入口文件：gunicorn通过此文件导入Flask app对象
from app import app

if __name__ == "__main__":
    app.run()
