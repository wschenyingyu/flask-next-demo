import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function POST(request: NextRequest) {
  const data = await request.json();
  const email = data.email;
  const password = data.password;

  if (!email || !password) {
    return NextResponse.json(
      { code: 400, msg: "邮箱、密码不能为空" },
      { status: 400 }
    );
  }

  const user = store.getUserByEmail(email);
  if (!user || user.password !== store.md5(password)) {
    return NextResponse.json(
      { code: 400, msg: "邮箱或密码错误" },
      { status: 400 }
    );
  }

  const { password: _, ...userData } = user;
  return NextResponse.json({
    code: 200,
    data: userData,
    msg: "登录成功",
  });
}
