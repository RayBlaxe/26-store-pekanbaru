import { NextRequest, NextResponse } from 'next/server'
import { mockOrderService } from '@/services/mock-order.service'

const midtransClient = require('midtrans-client')

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Initialize Midtrans Core API to verify notification
    const core = new midtransClient.CoreApi({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY
    })

    // Verify notification authenticity
    const notification = await core.transaction.notification(body)
    
    const orderId = notification.order_id
    const transactionStatus = notification.transaction_status
    const fraudStatus = notification.fraud_status

    console.log('Midtrans notification received:', {
      orderId,
      transactionStatus,
      fraudStatus
    })

    let orderStatus = 'pending'

    // Determine order status based on Midtrans response
    if (transactionStatus === 'capture') {
      if (fraudStatus === 'challenge') {
        orderStatus = 'pending'
      } else if (fraudStatus === 'accept') {
        orderStatus = 'processing'
      }
    } else if (transactionStatus === 'settlement') {
      orderStatus = 'processing'
    } else if (transactionStatus === 'cancel' || 
               transactionStatus === 'deny' || 
               transactionStatus === 'expire') {
      orderStatus = 'cancelled'
    } else if (transactionStatus === 'pending') {
      orderStatus = 'pending'
    }

    // Update order status in your database
    // For now, we'll just log it since we're using mock data
    console.log(`Order ${orderId} status updated to: ${orderStatus}`)

    // In a real app, you would:
    // 1. Find the order by order_number (orderId)
    // 2. Update the order status and payment_status
    // 3. Send email notifications to customer
    // 4. Update inventory if needed

    return NextResponse.json({ 
      success: true, 
      message: 'Notification processed successfully' 
    })

  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process notification',
        details: error.message 
      },
      { status: 500 }
    )
  }
}