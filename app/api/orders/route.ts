import { NextRequest, NextResponse } from 'next/server'
import { mockOrderService } from '@/services/mock-order.service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const per_page = parseInt(searchParams.get('per_page') || '10')

    const result = await mockOrderService.getOrders(page, per_page)
    
    return NextResponse.json({
      success: true,
      data: result.data,
      current_page: result.current_page,
      last_page: result.last_page,
      per_page: result.per_page,
      total: result.total,
      from: result.from,
      to: result.to
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = await mockOrderService.createOrder(body)
    
    return NextResponse.json({
      success: true,
      data: result.data
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}