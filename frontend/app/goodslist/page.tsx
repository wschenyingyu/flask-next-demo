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
    fetch("http://127.0.0.1:5000/api/goods")
      .then(res => res.json())
      .then(data => setGoods(data.data));
  };

  useEffect(() => {
    loadGoods();
  }, []);

  const submitAdd = async () => {
    await fetch("http://127.0.0.1:5000/api/add_goods", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, category, price_per_day: price })
    });
    setName("");
    setCategory("");
    setPrice("");
    loadGoods();
  };

  return (
    <div className="p-10">
      <h1>闲置物品发布与列表</h1>
      <div className="my-5 flex gap-2">
        <input placeholder="物品名称" value={name} onChange={(e) => setName(e.target.value)} className="border px-2" />
        <input placeholder="分类（工具/家电/户外）" value={category} onChange={(e) => setCategory(e.target.value)} className="border px-2" />
        <input placeholder="单日租金" value={price} onChange={(e) => setPrice(e.target.value)} className="border px-2" />
        <button onClick={submitAdd} className="bg-gray-100 border px-3">发布闲置</button>
      </div>
      <div>
        <h3>可借用物品：</h3>
        {goods.map(item => (
          <div key={item.id} className="my-1">
            {item.id} | {item.name} | {item.category} | {item.price_per_day}元/天
          </div>
        ))}
      </div>
      <a href="/" className="mt-6 block underline">返回首页</a>
    </div>
  );
}