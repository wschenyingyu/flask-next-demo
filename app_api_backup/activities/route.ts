import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET() {
  return NextResponse.json({
    code: 200,
    data: store.getActivities(),
    msg: "活动查询成功",
  });
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  const title = data.title;
  const content = data.content || "";
  const activity_time = data.activity_time || "";
  const location = data.location || "";
  const image = data.image || "";
  const user_id = data.user_id || 1;
  const user_name = data.user_name || "admin";

  if (!title) {
    return NextResponse.json(
      { code: 400, msg: "活动标题不能为空" },
      { status: 400 }
    );
  }

  const activity = store.addActivity({
    title,
    content,
    activity_time,
    location,
    image,
    user_id,
    user_name,
  });

  return NextResponse.json({
    code: 200,
    msg: "活动发布成功",
    data: activity,
  });
}
