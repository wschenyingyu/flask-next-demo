import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  store.deleteGoods(parseInt(id));
  return NextResponse.json({ code: 200, msg: "物品删除成功" });
}
