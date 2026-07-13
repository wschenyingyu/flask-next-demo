import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const days = parseInt(searchParams.get('day') || '0')
  const price = parseInt(searchParams.get('price') || '0')
  
  if (!days || !price) {
    return NextResponse.json({ error: '缺少必要参数' }, { status: 400 })
  }
  
  const totalPrice = days * price
  return NextResponse.json({ total_price: totalPrice })
}