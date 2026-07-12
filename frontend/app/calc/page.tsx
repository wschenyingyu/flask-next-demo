"use client";
import { useState } from "react";

export default function CalcPage() {
  const [day, setDay] = useState("");
  const [price, setPrice] = useState("");
  const [total, setTotal] = useState<number | null>(null);

  const calcRent = async () => {
    if (!day || !price) {
      alert("请填写借用天数和单日租金");
      return;
    }
    const res = await fetch(`http://127.0.0.1:5000/api/calc_rent?day=${day}&price=${price}`);
    const data = await res.json();
    setTotal(data.total_rent);
  };

  return (
    <div className="container">
      <div className="card">
        <div style={{ fontSize: '30px', marginBottom: '10px' }}>💰</div>
        <h1 style={{ fontSize: '24px', color: '#667eea' }}>租赁费用计算工具</h1>
        
        <div style={{ marginBottom: '20px' }}>
          <p style={{ color: '#888', marginBottom: '20px' }}>
            输入借用天数和物品单日租金，自动计算应付总租金
          </p>
          
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '14px', color: '#555', fontWeight: 'bold' }}>借用天数</label>
              <input 
                placeholder="请输入天数" 
                value={day} 
                onChange={(e) => setDay(e.target.value)} 
                style={{ width: '150px' }}
              />
            </div>
            
            <span style={{ fontSize: '24px', color: '#ddd' }}>×</span>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '14px', color: '#555', fontWeight: 'bold' }}>单日租金（元）</label>
              <input 
                placeholder="请输入单价" 
                value={price} 
                onChange={(e) => setPrice(e.target.value)} 
                style={{ width: '150px' }}
              />
            </div>
            
            <span style={{ fontSize: '24px', color: '#ddd' }}>=</span>
            
            <button onClick={calcRent} style={{ height: '42px' }}>计算</button>
          </div>
        </div>

        {total !== null && (
          <div style={{ 
            padding: '25px', 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '12px',
            textAlign: 'center',
            color: 'white'
          }}>
            <p style={{ fontSize: '16px', opacity: '0.9', marginBottom: '5px' }}>应付总租金</p>
            <p style={{ fontSize: '48px', fontWeight: 'bold' }}>¥{total}</p>
            <p style={{ fontSize: '14px', opacity: '0.8', marginTop: '10px' }}>
              共 {day} 天 × ¥{price}/天
            </p>
          </div>
        )}

        <div style={{ marginTop: '25px', paddingTop: '15px', borderTop: '1px solid #eee' }}>
          <a href="/">← 返回首页</a>
        </div>
      </div>
    </div>
  );
}