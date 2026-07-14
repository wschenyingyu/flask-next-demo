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
    <nav>
      <div className="nav-container">
        <div className="logo">🏠 社区物品借用平台</div>
        <div className="nav-links">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={pathname === item.href ? "active" : ""}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}