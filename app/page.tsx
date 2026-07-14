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
    {
      icon: "📦",
      title: "物品共享",
      description: "登记闲置物品，方便邻里借用",
    },
    {
      icon: "🔄",
      title: "便捷借用",
      description: "一键申请借用，简单快捷",
    },
    {
      icon: "💰",
      title: "费用计算",
      description: "智能计算租赁费用",
    },
    {
      icon: "👥",
      title: "社区互动",
      description: "增进邻里关系",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-2xl p-8 shadow-lg">
        <h1 className="text-3xl font-bold mb-4">{tip}</h1>
        <p className="text-lg opacity-90 mb-6">
          让闲置物品发挥价值，共建和谐美好社区
        </p>
        <div className="flex space-x-4">
          <Link
            href="/goodslist"
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            查看物品列表
          </Link>
          <Link
            href="/borrow"
            className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
          >
            申请借用
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl p-8 shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">平台统计</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600">100+</div>
            <div className="text-gray-600">可借物品</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-3xl font-bold text-green-600">50+</div>
            <div className="text-gray-600">活跃用户</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-3xl font-bold text-yellow-600">200+</div>
            <div className="text-gray-600">借用次数</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-3xl font-bold text-purple-600">98%</div>
            <div className="text-gray-600">好评率</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-8 shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">使用指南</h2>
        <ol className="space-y-3 text-gray-600">
          <li className="flex items-start">
            <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0">1</span>
            <span>浏览物品列表，找到需要借用的物品</span>
          </li>
          <li className="flex items-start">
            <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0">2</span>
            <span>点击申请借用，填写借用信息</span>
          </li>
          <li className="flex items-start">
            <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0">3</span>
            <span>等待物品主人确认</span>
          </li>
          <li className="flex items-start">
            <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0">4</span>
            <span>借用完成后归还物品并评价</span>
          </li>
        </ol>
      </div>
    </div>
  );
}