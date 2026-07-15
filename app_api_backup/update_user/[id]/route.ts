import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const data = await request.json();
  const username = data.username;
  const phone = data.phone || "";
  const avatar = data.avatar || "";

  const user = store.updateUser(parseInt(id), { username, phone, avatar });

  if (!user) {
    return NextResponse.json(
      { code: 500, msg: "更新失败" },
      { status: 500 }
    );
  }

  return NextResponse.json({ code: 200, msg: "用户信息更新成功" });
}
