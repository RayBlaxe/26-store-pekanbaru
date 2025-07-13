import { NextRequest, NextResponse } from 'next/server'
import { mockOrderService } from '@/services/mock-order.service'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const orderId = parseInt(id)
    const result = await mockOrderService.getOrder(orderId)
    
    return NextResponse.json({
      success: true,
      data: result.data
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message === 'Order not found' ? 404 : 500 }
    )
  }
}