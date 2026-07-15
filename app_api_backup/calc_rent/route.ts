import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const day = searchParams.get("day");
  const price = searchParams.get("price");

  if (!day || !price) {
    return NextResponse.json(
      { code: 400, msg: "天数、单价必须输入数字" },
      { status: 400 }
    );
  }

  try {
    const total = parseFloat(day) * parseFloat(price);
    return NextResponse.json({
      code: 200,
      total_rent: total,
      msg: "费用计算完成",
    });
  } catch {
    return NextResponse.json(
      { code: 400, msg: "天数、单价必须输入数字" },
      { status: 400 }
    );
  }
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  const day = data.day;
  const price = data.price;

  if (!day || !price) {
    return NextResponse.json(
      { code: 400, msg: "天数、单价必须输入数字" },
      { status: 400 }
    );
  }

  try {
    const total = parseFloat(day) * parseFloat(price);
    return NextResponse.json({
      code: 200,
      total_rent: total,
      msg: "费用计算完成",
    });
  } catch {
    return NextResponse.json(
      { code: 400, msg: "天数、单价必须输入数字" },
      { status: 400 }
    );
  }
}
