import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET() {
  return NextResponse.json({
    code: 200,
    data: store.getBorrowRecords(),
    msg: "借用记录查询成功",
  });
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  const goods_id = data.goods_id;
  const goods_name = data.goods_name;
  const user_id = data.user_id;
  const user_name = data.user_name;
  const owner_id = data.owner_id;
  const days = data.days;
  const total_price = data.total_price;
  const deposit = data.deposit || 0;

  const record = store.addBorrowRecord({
    goods_id,
    goods_name,
    user_id,
    user_name,
    owner_id,
    days,
    total_price,
    deposit,
  });

  store.updateGoodsStatus(goods_id, "borrowed");

  return NextResponse.json({ code: 200, msg: "借用申请提交成功", data: record });
}
