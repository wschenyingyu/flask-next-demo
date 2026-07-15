import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  store.returnGoods(parseInt(id));
  return NextResponse.json({ code: 200, msg: "归还成功" });
}
