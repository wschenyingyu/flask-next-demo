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

function saveUsers(users: any[]) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json();
    const users = getUsers();

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

    users.push(newUser);
    saveUsers(users);

    return NextResponse.json({
      code: 200,
      msg: "注册成功",
      data: newUser,
    });
  } catch (error) {
    return NextResponse.json({ code: 500, msg: "服务器错误" });
  }
}