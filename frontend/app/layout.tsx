import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "社区便民物品借用平台",
  description: "小区邻里之间物品借用管理平台",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        <nav style={{
          background: 'white',
          padding: '12px 20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}>
          <a href="/" style={{ fontSize: '18px', fontWeight: 'bold', color: '#667eea', textDecoration: 'none' }}>
            🏠 社区便民物品借用平台
          </a>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <a href="/" style={{ color: '#555', textDecoration: 'none' }}>首页</a>
            <a href="/goodslist" style={{ color: '#555', textDecoration: 'none' }}>物品列表</a>
            <a href="/calc" style={{ color: '#555', textDecoration: 'none' }}>费用计算</a>
            <a href="/borrow" style={{ color: '#555', textDecoration: 'none' }}>借用记录</a>
            <a href="/activity" style={{ color: '#555', textDecoration: 'none' }}>社区活动</a>
            <a href="/profile" style={{ color: '#555', textDecoration: 'none' }}>个人中心</a>
            <a href="/login" style={{
              padding: '6px 15px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: '20px',
              fontSize: '13px',
              textDecoration: 'none'
            }}>🔐 登录</a>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}