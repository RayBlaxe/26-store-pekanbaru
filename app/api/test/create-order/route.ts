import { NextRequest, NextResponse } from 'next/server'
import { mockOrderService } from '@/services/mock-order.service'

export async function POST(request: NextRequest) {
  try {
    // Create a test order with realistic data
    const testOrderData = {
      shipping_address_id: 1,
      payment_method: 'midtrans',
      notes: 'Test order created for development/testing'
    }
    
    const result = await mockOrderService.createOrder(testOrderData)
    
    return NextResponse.json({
      success: true,
      message: 'Test order created successfully',
      data: result.data,
      payment_url: `/orders/${result.data.id}`,
      test_payment_url: `/api/orders/${result.data.id}/payment`
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'POST to this endpoint to create a test order',
    usage: 'curl -X POST http://localhost:3000/api/test/create-order',
    example_response: {
      success: true,
      data: { id: 4, order_number: 'ORD-2024-004' },
      payment_url: '/orders/4'
    }
  })
}