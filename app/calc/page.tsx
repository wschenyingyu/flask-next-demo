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
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="card">
        <h1 style={{ fontSize: '28px', marginBottom: '30px', textAlign: 'center' }}>
          💰 租赁费用计算工具
        </h1>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>
            借用天数
          </label>
          <input
            type="number"
            min="1"
            placeholder="请输入借用天数"
            value={day}
            onChange={(e) => setDay(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>
            物品单日租金（元）
          </label>
          <input
            type="number"
            min="0"
            step="0.5"
            placeholder="请输入单日租金"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button onClick={calcRent} className="btn btn-primary" style={{ flex: 1 }}>
            计算总租金
          </button>
          <button onClick={clear} className="btn" style={{ border: '2px solid #ddd', color: '#666' }}>
            重置
          </button>
        </div>

        {total !== null && (
          <div className="result-box">
            <p style={{ color: '#666', marginBottom: '10px' }}>应付总租金</p>
            <p className="amount">¥{total}</p>
            <p style={{ color: '#999', marginTop: '10px' }}>
              ({day}天 × ¥{price}/天)
            </p>
          </div>
        )}

        <div style={{ marginTop: '30px', background: '#f9fafb', padding: '20px', borderRadius: '12px' }}>
          <h3 style={{ fontWeight: 600, marginBottom: '10px' }}>费用说明</h3>
          <ul style={{ color: '#666', fontSize: '14px', paddingLeft: '20px' }}>
            <li>租金按实际借用天数计算</li>
            <li>不足一天按一天计算</li>
            <li>押金另计，具体与物品主人协商</li>
            <li>如需延长借用时间，请提前告知</li>
          </ul>
        </div>
      </div>
    </div>
  );
}