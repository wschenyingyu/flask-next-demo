import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'app', 'api', 'goods.json')

function readGoods() {
  const data = fs.readFileSync(DATA_FILE, 'utf8')
  return JSON.parse(data)
}

function writeGoods(goods: any[]) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(goods, null, 2))
}

export async function GET() {
  const goods = readGoods()
  return NextResponse.json(goods)
}

export async function POST(request: Request) {
  const newGoods = await request.json()
  const goods = readGoods()
  
  const maxId = Math.max(...goods.map((g: any) => g.id), 0)
  newGoods.id = maxId + 1
  newGoods.price_per_day = Number(newGoods.price_per_day) || 0
  
  goods.push(newGoods)
  writeGoods(goods)
  
  return NextResponse.json(newGoods, { status: 201 })
}