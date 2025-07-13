import { NextRequest, NextResponse } from 'next/server'
import { mockAddressService } from '@/services/mock-address.service'

export async function GET(request: NextRequest) {
  try {
    const result = await mockAddressService.getAddresses()
    
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = await mockAddressService.createAddress(body)
    
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