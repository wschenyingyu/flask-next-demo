"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [tip, setTip] = useState("");

  useEffect(() => {
    fetch("/api/index")
      .then((res) => res.json())
      .then((data) => setTip(data.msg));
  }, []);

  const features = [
    { icon: "📦", title: "物品共享", description: "登记闲置物品，方便邻里借用" },
    { icon: "🔄", title: "便捷借用", description: "一键申请借用，简单快捷" },
    { icon: "💰", title: "费用计算", description: "智能计算租赁费用" },
    { icon: "👥", title: "社区互动", description: "增进邻里关系" },
  ];

  return (
    <div>
      <div className="hero">
        <h1>{tip}</h1>
        <p>让闲置物品发挥价值，共建和谐美好社区</p>
        <div className="hero-buttons">
          <Link href="/goodslist" className="btn btn-primary">
            查看物品列表
          </Link>
          <Link href="/borrow" className="btn btn-outline">
            申请借用
          </Link>
        </div>
      </div>

      <div className="features-grid">
        {features.map((feature) => (
          <div key={feature.title} className="feature-card">
            <div className="icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>平台统计</h2>
        <div className="stats-grid">
          <div className="stat-item blue">
            <div className="number">100+</div>
            <div className="label">可借物品</div>
          </div>
          <div className="stat-item green">
            <div className="number">50+</div>
            <div className="label">活跃用户</div>
          </div>
          <div className="stat-item yellow">
            <div className="number">200+</div>
            <div className="label">借用次数</div>
          </div>
          <div className="stat-item purple">
            <div className="number">98%</div>
            <div className="label">好评率</div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>使用指南</h2>
        <ol className="guide-list">
          <li>
            <span className="step-number">1</span>
            <span>浏览物品列表，找到需要借用的物品</span>
          </li>
          <li>
            <span className="step-number">2</span>
            <span>点击申请借用，填写借用信息</span>
          </li>
          <li>
            <span className="step-number">3</span>
            <span>等待物品主人确认</span>
          </li>
          <li>
            <span className="step-number">4</span>
            <span>借用完成后归还物品并评价</span>
          </li>
        </ol>
      </div>
    </div>
  );
}