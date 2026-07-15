import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ msg: "欢迎使用社区便民物品借用管理平台" });
}
