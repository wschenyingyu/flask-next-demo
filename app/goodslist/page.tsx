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
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">闲置物品发布与列表</h1>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-700 mb-3">发布新物品</h3>
          <div className="flex flex-wrap gap-3">
            <input
              placeholder="物品名称"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="">选择分类</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="单日租金（元）"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={submitAdd}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              发布闲置
            </button>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-700 mb-3">可借用物品列表</h3>
          {goods.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">📭</div>
              <p>暂无可借物品，快来发布第一个吧！</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {goods.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-sm">
                      #{item.id}
                    </span>
                    <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded text-sm">
                      {item.category}
                    </span>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">
                    {item.name}
                  </h4>
                  <div className="flex items-center justify-between">
                    <span className="text-red-500 font-bold text-lg">
                      ¥{item.price_per_day}/天
                    </span>
                    <button className="bg-green-600 text-white px-4 py-1 rounded-lg text-sm hover:bg-green-700 transition-colors">
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