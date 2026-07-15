import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";
import ApiMockProvider from "./ApiMockProvider";

export const metadata: Metadata = {
  title: "社区便民物品借用管理平台",
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
        <ApiMockProvider>
          <Navbar />
          <main>{children}</main>
        </ApiMockProvider>
      </body>
    </html>
  );
}