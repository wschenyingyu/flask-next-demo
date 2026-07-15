import { NextRequest, NextResponse } from "next/server";

const users: { id: number; username: string; email: string; password: string; avatar: string; phone: string; role: string }[] = [
  { id: 1, username: "admin", email: "admin@test.com", password: "123456", avatar: "", phone: "13800138000", role: "admin" },
  { id: 2, username: "user1", email: "user1@test.com", password: "123456", avatar: "", phone: "13800138001", role: "user" },
];

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json();

    if (users.find(u => u.email === email)) {
      return NextResponse.json({ code: 400, msg: "该邮箱已被注册" });
    }

    const newUser = {
      id: users.length + 1,
      username,
      email,
      password,
      avatar: "",
      phone: "",
      role: "user",
    };

    return NextResponse.json({
      code: 200,
      msg: "注册成功",
      data: newUser,
    });
  } catch (error) {
    return NextResponse.json({ code: 500, msg: "服务器错误" });
  }
}