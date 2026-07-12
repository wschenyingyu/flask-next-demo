"use client";
import { useEffect, useState } from "react";

type Stats = {
  total: number;
  available: number;
  borrowed: number;
  category_count: number;
  user_count: number;
  activity_count: number;
  borrow_count: number;
};

type Activity = {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  image: string;
  organizer_name: string;
};

type User = {
  id: number;
  username: string;
  email: string;
  avatar: string;
  phone: string;
  role: string;
};

export default function Home() {
  const [tip, setTip] = useState("");
  const [stats, setStats] = useState<Stats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/index").then(res => res.json()).then(data => setTip(data.msg));
    fetch("http://127.0.0.1:5000/api/stats").then(res => res.json()).then(data => setStats(data.data));
    fetch("http://127.0.0.1:5000/api/activities").then(res => res.json()).then(data => setActivities(data.data.slice(0, 3)));

    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <div className="container">
      <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ fontSize: '60px', marginBottom: '20px' }}>🏠</div>
        <h1 style={{ fontSize: '32px', color: '#667eea', marginBottom: '10px' }}>社区便民物品借用平台</h1>
        <p style={{ color: '#888', fontSize: '16px', marginBottom: '30px' }}>{tip}</p>

        {user && (
          <div style={{ marginBottom: '20px', padding: '10px 20px', background: '#e8f5e9', borderRadius: '20px', display: 'inline-block' }}>
            <span>👋 欢迎回来，</span>
            <span style={{ fontWeight: 'bold', color: '#388e3c' }}>{user.username}</span>
            <button onClick={() => { localStorage.removeItem('user'); window.location.reload(); }} style={{ marginLeft: '10px', background: '#c62828', color: 'white', border: 'none', borderRadius: '10px', padding: '5px 10px', cursor: 'pointer' }}>退出</button>
          </div>
        )}

        {stats && (
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '30px' }}>
            <div style={{ padding: '20px 25px', background: '#f8f9fa', borderRadius: '12px', minWidth: '100px' }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#667eea' }}>{stats.total}</div>
              <div style={{ fontSize: '12px', color: '#888' }}>物品总数</div>
            </div>
            <div style={{ padding: '20px 25px', background: '#e8f5e9', borderRadius: '12px', minWidth: '100px' }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#388e3c' }}>{stats.available}</div>
              <div style={{ fontSize: '12px', color: '#888' }}>可借用</div>
            </div>
            <div style={{ padding: '20px 25px', background: '#fff3e0', borderRadius: '12px', minWidth: '100px' }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#f57c00' }}>{stats.borrowed}</div>
              <div style={{ fontSize: '12px', color: '#888' }}>已借出</div>
            </div>
            <div style={{ padding: '20px 25px', background: '#e3f2fd', borderRadius: '12px', minWidth: '100px' }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#1976d2' }}>{stats.user_count}</div>
              <div style={{ fontSize: '12px', color: '#888' }}>社区用户</div>
            </div>
            <div style={{ padding: '20px 25px', background: '#f3e5f5', borderRadius: '12px', minWidth: '100px' }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#7b1fa2' }}>{stats.activity_count}</div>
              <div style={{ fontSize: '12px', color: '#888' }}>社区活动</div>
            </div>
            <div style={{ padding: '20px 25px', background: '#e0f7fa', borderRadius: '12px', minWidth: '100px' }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#00838f' }}>{stats.borrow_count}</div>
              <div style={{ fontSize: '12px', color: '#888' }}>借用次数</div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '30px' }}>
          <a href="/goodslist" style={{
            padding: '15px 25px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 'bold',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
          }}>📦 物品列表</a>
          <a href="/calc" style={{
            padding: '15px 25px',
            background: 'white',
            color: '#667eea',
            border: '2px solid #667eea',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>💰 费用计算</a>
          <a href="/borrow" style={{
            padding: '15px 25px',
            background: 'white',
            color: '#f57c00',
            border: '2px solid #f57c00',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>📋 借用记录</a>
          <a href="/activity" style={{
            padding: '15px 25px',
            background: 'white',
            color: '#7b1fa2',
            border: '2px solid #7b1fa2',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>🎉 社区活动</a>
          <a href="/profile" style={{
            padding: '15px 25px',
            background: 'white',
            color: '#00838f',
            border: '2px solid #00838f',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>👤 个人中心</a>
        </div>

        {!user && (
          <div style={{ marginBottom: '30px' }}>
            <a href="/login" style={{
              padding: '12px 30px',
              background: 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)',
              color: 'white',
              borderRadius: '25px',
              fontSize: '16px',
              fontWeight: 'bold',
              textDecoration: 'none',
              boxShadow: '0 4px 12px rgba(76, 175, 80, 0.4)'
            }}>🔐 登录 / 注册</a>
          </div>
        )}

        {activities.length > 0 && (
          <div style={{ marginTop: '40px', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ color: '#555', fontSize: '18px' }}>🎉 近期社区活动</h3>
              <a href="/activity" style={{ fontSize: '14px', color: '#667eea' }}>查看全部 →</a>
            </div>
            <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '10px' }}>
              {activities.map(activity => (
                <div key={activity.id} style={{
                  flex: '0 0 250px',
                  background: 'white',
                  borderRadius: '12px',
                  padding: '15px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  border: '1px solid #eee'
                }}>
                  <div style={{ fontSize: '30px', marginBottom: '10px', textAlign: 'center' }}>🎊</div>
                  <h4 style={{ color: '#333', marginBottom: '5px', fontSize: '14px' }}>{activity.title}</h4>
                  <p style={{ color: '#888', fontSize: '12px', marginBottom: '10px', lineHeight: '1.4' }}>{activity.description.slice(0, 50)}...</p>
                  <div style={{ fontSize: '12px', color: '#555' }}>
                    <div>📅 {activity.date}</div>
                    <div>📍 {activity.location}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}