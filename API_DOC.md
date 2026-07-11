# API接口文档

## 基础URL

- 本地开发: `http://127.0.0.1:5000`

## 接口1：首页欢迎接口

- **地址**: `/api/index`
- **方法**: `GET`
- **返回示例**:
```json
{
  "msg": "欢迎使用社区便民物品借用管理平台"
}
```

## 接口2：查询所有闲置物品

- **地址**: `/api/goods`
- **方法**: `GET`
- **返回示例**:
```json
{
  "code": 200,
  "data": [
    {"id": 1, "name": "冲击钻", "category": "维修工具", "price_per_day": 3.0},
    {"id": 2, "name": "投影仪", "category": "影音家电", "price_per_day": 8.0}
  ],
  "msg": "物品查询成功"
}
```

## 接口3：新增闲置物品

- **地址**: `/api/add_goods`
- **方法**: `POST`
- **参数**: name, category, price_per_day
- **返回示例**:
```json
{
  "code": 200,
  "msg": "闲置物品发布成功"
}
```

## 接口4：租赁费用计算

- **地址**: `/api/calc_rent`
- **方法**: `GET`
- **参数**: day, price
- **返回示例**:
```json
{
  "code": 200,
  "total_rent": 15.0,
  "msg": "费用计算完成"
}
```