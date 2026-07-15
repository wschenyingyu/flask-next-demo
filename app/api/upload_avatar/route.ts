import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    code: 200,
    msg: "头像上传成功",
    data: { avatar_url: "avatar.png" },
  });
}
