"use client";
import { useEffect, useState } from "react";
import API_BASE_URL from "@/lib/api";

export default function Home() {
  const [tip, setTip] = useState("");
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/index`)
      .then(res => res.json())
      .then(data => setTip(data.msg));
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-xl font-bold">社区便民物品借用平台</h1>
      <p className="my-4 text-gray-600">{tip}</p>
      <a href="/goodslist" className="block my-3 underline">查看/发布闲置物品</a>
      <a href="/calc" className="block my-3 underline">租赁费用计算器</a>
    </div>
  );
}