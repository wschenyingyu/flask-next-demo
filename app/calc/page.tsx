"use client";
import { useState } from "react";

export default function CalcPage() {
  const [day, setDay] = useState("");
  const [price, setPrice] = useState("");
  const [total, setTotal] = useState<number | null>(null);

  const calcRent = async () => {
    if (!day || !price) {
      alert("请填写完整信息");
      return;
    }
    const res = await fetch(`/api/calc_rent?day=${day}&price=${price}`);
    const data = await res.json();
    setTotal(data.total_price);
  };

  const clear = () => {
    setDay("");
    setPrice("");
    setTotal(null);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl p-8 shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          💰 租赁费用计算工具
        </h1>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              借用天数
            </label>
            <input
              type="number"
              min="1"
              placeholder="请输入借用天数"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              物品单日租金（元）
            </label>
            <input
              type="number"
              min="0"
              step="0.5"
              placeholder="请输入单日租金"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex space-x-4 mb-6">
          <button
            onClick={calcRent}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors"
          >
            计算总租金
          </button>
          <button
            onClick={clear}
            className="px-6 py-3 border border-gray-300 text-gray-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            重置
          </button>
        </div>

        {total !== null && (
          <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-300 rounded-xl p-6 text-center">
            <p className="text-gray-600 mb-2">应付总租金</p>
            <p className="text-4xl font-bold text-green-600">¥{total}</p>
            <p className="text-gray-500 mt-2">
              ({day}天 × ¥{price}/天)
            </p>
          </div>
        )}

        <div className="mt-8 bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-700 mb-2">费用说明</h3>
          <ul className="text-gray-600 text-sm space-y-1">
            <li>• 租金按实际借用天数计算</li>
            <li>• 不足一天按一天计算</li>
            <li>• 押金另计，具体与物品主人协商</li>
            <li>• 如需延长借用时间，请提前告知</li>
          </ul>
        </div>
      </div>
    </div>
  );
}