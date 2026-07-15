import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = store.getUserById(parseInt(id));

  if (!user) {
    return NextResponse.json(
      { code: 400, msg: "用户不存在" },
      { status: 400 }
    );
  }

  const { password: _, ...userData } = user;
  return NextResponse.json({
    code: 200,
    data: userData,
    msg: "用户查询成功",
  });
}
