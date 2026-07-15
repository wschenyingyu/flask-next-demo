import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    code: 200,
    msg: "活动图片上传成功",
    data: { image_url: "activity.png" },
  });
}
