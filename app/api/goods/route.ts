import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET() {
  return NextResponse.json({
    code: 200,
    data: store.getGoods(),
    msg: "物品查询成功",
  });
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  const name = data.name;
  const category = data.category || "";
  const price_per_day = data.price_per_day;
  const description = data.description || "";
  const image = data.image || "";
  const owner_id = data.owner_id || 1;
  const owner_name = data.owner_name || "admin";

  if (!name || !price_per_day) {
    return NextResponse.json(
      { code: 400, msg: "物品名称、单日租赁价格不能为空" },
      { status: 400 }
    );
  }

  const item = store.addGoods({
    name,
    category,
    price_per_day: parseFloat(price_per_day),
    description,
    image,
    owner_id,
    owner_name,
  });

  return NextResponse.json({ code: 200, msg: "闲置物品发布成功", data: item });
}
