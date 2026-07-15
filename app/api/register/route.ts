import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function POST(request: NextRequest) {
  const data = await request.json();
  const username = data.username;
  const email = data.email;
  const password = data.password;

  if (!username || !email || !password) {
    return NextResponse.json(
      { code: 400, msg: "用户名、邮箱、密码不能为空" },
      { status: 400 }
    );
  }

  if (store.getUserByEmail(email)) {
    return NextResponse.json(
      { code: 400, msg: "该邮箱已被注册" },
      { status: 400 }
    );
  }

  store.addUser({ username, email, password });
  return NextResponse.json({ code: 200, msg: "注册成功" });
}
