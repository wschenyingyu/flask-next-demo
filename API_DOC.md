# API接口文档

## 基础URL

- 本地开发: `http://127.0.0.1:5000`

## 接口1：首页欢迎接口

- 地址: `/api/index`
- 方法: `GET`
- 返回示例:
```json
{ "msg": "欢迎使用社区便民物品借用管理平台" }
```

## 接口2：查询所有物品（支持分类筛选）

- 地址: `/api/goods?category=维修工具`
- 方法: `GET`
- 参数: category（可选，不传或传"全部"则查全部）
- 返回示例:
```json
{
  "code": 200,
  "data": [
    { "id": 1, "name": "冲击钻", "category": "维修工具", "price_per_day": 3.0, "status": "available" }
  ],
  "msg": "物品查询成功"
}
```

## 接口3：新增闲置物品

- 地址: `/api/add_goods`
- 方法: `POST`
- 参数: name, category, price_per_day
- 返回示例:
```json
{ "code": 200, "msg": "闲置物品发布成功" }
```

## 接口4：删除物品

- 地址: `/api/delete_goods/<id>`
- 方法: `DELETE`
- 返回示例:
```json
{ "code": 200, "msg": "物品删除成功" }
```

## 接口5：借出物品

- 地址: `/api/borrow_goods`
- 方法: `POST`
- 参数: goods_id, borrower_name, days
- 返回示例:
```json
{ "code": 200, "total_rent": 15.0, "msg": "借用成功" }
```

## 接口6：归还物品

- 地址: `/api/return_goods/<id>`
- 方法: `POST`
- 返回示例:
```json
{ "code": 200, "msg": "归还成功" }
```

## 接口7：查询借用记录

- 地址: `/api/borrow_records`
- 方法: `GET`
- 返回示例:
```json
{
  "code": 200,
  "data": [
    { "id": 1, "goods_name": "冲击钻", "borrower_name": "张三", "days": 3, "total_rent": 9.0, "borrow_date": "2026-07-10 14:00", "return_date": null, "status": "borrowed" }
  ],
  "msg": "查询成功"
}
```

## 接口8：首页统计数据

- 地址: `/api/stats`
- 方法: `GET`
- 返回示例:
```json
{
  "code": 200,
  "data": { "total": 4, "available": 3, "borrowed": 1, "category_count": 3 }
}
```

## 接口9：租赁费用计算

- 地址: `/api/calc_rent?day=3&price=5`
- 方法: `GET`
- 返回示例:
```json
{ "code": 200, "total_rent": 15.0, "msg": "费用计算完成" }
```