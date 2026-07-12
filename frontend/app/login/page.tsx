"use client";
import { useState } from "react";

type User = {
  id: number;
  username: string;
  email: string;
  avatar: string;
  phone: string;
  role: string;
};

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    const url = isLogin ? "/api/login" : "/api/register";
    const data = isLogin ? { email, password } : { username, email, password };

    const res = await fetch(`http://127.0.0.1:5000${url}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (result.code === 200) {
      if (isLogin) {
        localStorage.setItem("user", JSON.stringify(result.data));
        window.location.href = "/";
      } else {
        setMessage("注册成功，请登录");
        setIsLogin(true);
      }
    } else {
      setMessage(result.msg);
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '450px', margin: '40px auto', textAlign: 'center' }}>
        <div style={{ fontSize: '60px', marginBottom: '20px' }}>🔐</div>
        <h1 style={{ fontSize: '28px', color: '#667eea', marginBottom: '10px' }}>
          {isLogin ? '用户登录' : '用户注册'}
        </h1>
        <p style={{ color: '#888', marginBottom: '30px' }}>
          {isLogin ? '欢迎回来，请登录您的账号' : '创建新账号，加入社区'}
        </p>

        {message && (
          <div style={{
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px',
            background: message.includes('成功') ? '#e8f5e9' : '#ffebee',
            color: message.includes('成功') ? '#388e3c' : '#c62828'
          }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          {!isLogin && (
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontSize: '14px', color: '#555', marginBottom: '5px', fontWeight: 'bold' }}>用户名</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="请输入用户名"
                style={{ width: '100%', padding: '12px' }}
                required
              />
            </div>
          )}

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '14px', color: '#555', marginBottom: '5px', fontWeight: 'bold' }}>邮箱</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="请输入邮箱"
              style={{ width: '100%', padding: '12px' }}
              required
            />
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', fontSize: '14px', color: '#555', marginBottom: '5px', fontWeight: 'bold' }}>密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
              style={{ width: '100%', padding: '12px' }}
              required
            />
          </div>

          <button type="submit" style={{ width: '100%', padding: '14px', fontSize: '16px' }}>
            {isLogin ? '登 录' : '注 册'}
          </button>

          {!isLogin && (
            <p style={{ fontSize: '12px', color: '#888', marginTop: '10px' }}>
              默认密码：123456（演示用）
            </p>
          )}
        </form>

        <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
          <p style={{ color: '#888', fontSize: '14px' }}>
            {isLogin ? '还没有账号？' : '已有账号？'}
            <button
              onClick={() => { setIsLogin(!isLogin); setMessage(""); }}
              style={{
                background: 'none',
                border: 'none',
                color: '#667eea',
                cursor: 'pointer',
                fontWeight: 'bold',
                marginLeft: '5px'
              }}
            >
              {isLogin ? '立即注册' : '立即登录'}
            </button>
          </p>
        </div>

        <div style={{ marginTop: '25px', padding: '15px', background: '#f8f9fa', borderRadius: '10px' }}>
          <p style={{ fontSize: '12px', color: '#888' }}>
            🔑 演示账号：admin@test.com / 123456
          </p>
        </div>
      </div>
    </div>
  );
}