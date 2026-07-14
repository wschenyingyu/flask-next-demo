"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: "首页", href: "/" },
    { name: "物品列表", href: "/goodslist" },
    { name: "借用申请", href: "/borrow" },
    { name: "费用计算", href: "/calc" },
    { name: "活动中心", href: "/activity" },
    { name: "个人中心", href: "/profile" },
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-bold">🏠 社区物品借用平台</span>
          </div>
          <div className="flex space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  pathname === item.href
                    ? "bg-white text-blue-600 font-semibold"
                    : "hover:bg-blue-500"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}