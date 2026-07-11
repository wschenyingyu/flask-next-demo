"use client";
import { useState } from "react";

export default function CalcPage() {
  const [day, setDay] = useState("");
  const [price, setPrice] = useState("");
  const [total, setTotal] = useState<number | null>(null);

  const calcRent = async () => {
    const res = await fetch(`http://127.0.0.1:5000/api/calc_rent?day=${day}&price=${price}`);
    const data = await res.json();
    setTotal(data.total_rent);
  };

  return (
    <div className="p-10">
      <h1>租赁费用计算工具</h1>
      <div className="my-4 flex gap-2">
        <input placeholder="借用天数" value={day} onChange={(e) => setDay(e.target.value)} className="border px-2" />
        <input placeholder="物品单日租金" value={price} onChange={(e) => setPrice(e.target.value)} className="border px-2" />
        <button onClick={calcRent} className="border px-3 bg-slate-100">计算总租金</button>
      </div>
      {total !== null && <p>应付总租金：{total} 元</p>}
      <a href="/" className="mt-5 block underline">返回首页</a>
    </div>
  );
}