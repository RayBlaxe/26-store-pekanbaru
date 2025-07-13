import { NextRequest, NextResponse } from 'next/server'
import { orderService } from '@/services/order.service' 

// Import Midtrans SDK
const midtransClient = require('midtrans-client')

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const orderId = parseInt(id)
    
    // Check if Midtrans is configured
    if (!process.env.MIDTRANS_SERVER_KEY || !process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY) {
      console.log('Midtrans not configured, falling back to mock payment')
      return NextResponse.json({
        success: true,
        token: `mock-payment-token-${orderId}-${Date.now()}`,
        redirect_url: `http://localhost:3000/orders/${orderId}?mock_payment=true`
      })
    }
    
    // Get order details - Use backend API directly instead of service layer
    let order
    try {
      // Use direct API call to backend instead of service layer to avoid circular dependencies
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`, {
        headers: {
          'Authorization': request.headers.get('authorization') || '',
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Order not found')
        }
        throw new Error(`API error: ${response.status}`)
      }
      
      const result = await response.json()
      order = result.data
    } catch (error: any) {
      console.error('Failed to fetch order:', error)
      
      return NextResponse.json(
        { 
          success: false, 
          error: 'Order not found',
          details: `Order ${orderId} does not exist. Please check if the order exists and try again.`,
          debug_info: {
            api_url: process.env.NEXT_PUBLIC_API_URL,
            order_id: orderId,
            error_message: error.message
          }
        },
        { status: 404 }
      )
    }

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }

    // Initialize Midtrans Snap
    const snap = new midtransClient.Snap({
      isProduction: false, // Change to true for production
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY
    })

    // Prepare transaction data for Midtrans
    const parameter = {
      transaction_details: {
        order_id: order.order_number,
        gross_amount: order.total_amount
      },
      credit_card: {
        secure: true
      },
      customer_details: {
        first_name: order.shipping_address.name.split(' ')[0],
        last_name: order.shipping_address.name.split(' ').slice(1).join(' ') || '',
        email: 'customer@example.com', // You should get this from user data
        phone: order.shipping_address.phone,
        billing_address: {
          first_name: order.shipping_address.name.split(' ')[0],
          last_name: order.shipping_address.name.split(' ').slice(1).join(' ') || '',
          phone: order.shipping_address.phone,
          address: order.shipping_address.street,
          city: order.shipping_address.city,
          postal_code: order.shipping_address.postal_code,
          country_code: 'IDN'
        },
        shipping_address: {
          first_name: order.shipping_address.name.split(' ')[0],
          last_name: order.shipping_address.name.split(' ').slice(1).join(' ') || '',
          phone: order.shipping_address.phone,
          address: order.shipping_address.street,
          city: order.shipping_address.city,
          postal_code: order.shipping_address.postal_code,
          country_code: 'IDN'
        }
      },
      item_details: order.items.map(item => ({
        id: item.product_sku || `PROD-${item.product_id}`,
        price: item.price,
        quantity: item.quantity,
        name: item.product_name,
        category: 'Sports Equipment',
        merchant_name: '26 Store Pekanbaru'
      })).concat([
        {
          id: 'SHIPPING',
          price: order.shipping_cost,
          quantity: 1,
          name: 'Shipping Cost',
          category: 'Shipping'
        }
      ]),
      callbacks: {
        finish: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/orders/${order.id}`
      },
      expiry: {
        start_time: new Date().toISOString().slice(0, 19).replace('T', ' ') + ' +0700',
        unit: 'hours',
        duration: 24
      }
    }

    // Create transaction with Midtrans
    const transaction = await snap.createTransaction(parameter)
    
    return NextResponse.json({
      success: true,
      token: transaction.token,
      redirect_url: transaction.redirect_url
    })

  } catch (error: any) {
    console.error('Midtrans payment error:', error)
    
    // Enhanced error handling
    if (error.httpStatusCode) {
      return NextResponse.json(
        { 
          success: false, 
          error: error.message || 'Payment service error',
          details: error.ApiResponse || error.message
        },
        { status: error.httpStatusCode }
      )
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create payment transaction',
        details: error.message 
      },
      { status: 500 }
    )
  }
}