"use client";
import { useEffect, useState } from "react";

type GoodsItem = {
  id: number;
  name: string;
  category: string;
  price_per_day: number;
};

export default function GoodsList() {
  const [goods, setGoods] = useState<GoodsItem[]>([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");

  const loadGoods = () => {
    fetch("/api/goods")
      .then((res) => res.json())
      .then((data) => setGoods(data));
  };

  useEffect(() => {
    loadGoods();
  }, []);

  const submitAdd = async () => {
    if (!name || !category || !price) {
      alert("请填写完整信息");
      return;
    }
    await fetch("/api/goods", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, category, price_per_day: price }),
    });
    setName("");
    setCategory("");
    setPrice("");
    loadGoods();
  };

  const categories = ["工具", "家电", "户外", "书籍", "其他"];

  return (
    <div>
      <div className="card">
        <h1 style={{ fontSize: '28px', marginBottom: '20px' }}>闲置物品发布与列表</h1>

        <div style={{ background: '#f9fafb', padding: '20px', borderRadius: '12px', marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '15px' }}>发布新物品</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            <input
              placeholder="物品名称"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ flex: '1 1 200px' }}
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ flex: '1 1 150px' }}
            >
              <option value="">选择分类</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="单日租金（元）"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              style={{ flex: '1 1 150px' }}
            />
            <button onClick={submitAdd} className="btn btn-primary">
              发布闲置
            </button>
          </div>
        </div>

        <div>
          <h3 style={{ marginBottom: '15px' }}>可借用物品列表</h3>
          {goods.length === 0 ? (
            <div className="empty-state">
              <div className="icon">📭</div>
              <p>暂无可借物品，快来发布第一个吧！</p>
            </div>
          ) : (
            <div className="goods-grid">
              {goods.map((item) => (
                <div key={item.id} className="goods-card">
                  <div className="tags">
                    <span className="tag tag-blue">#{item.id}</span>
                    <span className="tag tag-gray">{item.category}</span>
                  </div>
                  <h4>{item.name}</h4>
                  <div className="price-row">
                    <span className="price">¥{item.price_per_day}/天</span>
                    <button className="btn btn-success" style={{ padding: '6px 16px', fontSize: '14px' }}>
                      申请借用
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}