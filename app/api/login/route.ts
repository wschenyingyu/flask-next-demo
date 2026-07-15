import { NextRequest, NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';

const USERS_FILE = path.join(process.cwd(), 'app/api/users.json');

function getUsers() {
  if (fs.existsSync(USERS_FILE)) {
    const data = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  }
  return [
    { id: 1, username: "admin", email: "admin@test.com", password: "123456", avatar: "", phone: "13800138000", role: "admin" },
    { id: 2, username: "user1", email: "user1@test.com", password: "123456", avatar: "", phone: "13800138001", role: "user" },
  ];
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      return NextResponse.json({
        code: 200,
        msg: "登录成功",
        data: {
          id: user.id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          phone: user.phone,
          role: user.role,
        },
      });
    } else {
      return NextResponse.json({ code: 401, msg: "邮箱或密码错误" });
    }
  } catch (error) {
    return NextResponse.json({ code: 500, msg: "服务器错误" });
  }
}