"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { ShoppingBag } from "lucide-react"
import { Cart, Address } from "@/types/product"
import { formatPrice } from "@/lib/utils"

interface OrderSummaryProps {
  cart: Cart
  selectedAddress: Address | null
  shippingCost: number
  isLoading?: boolean
}

export default function OrderSummary({
  cart,
  selectedAddress,
  shippingCost,
  isLoading = false
}: OrderSummaryProps) {
  const subtotal = cart.total
  const totalAmount = subtotal + shippingCost
  
  const getProductImage = (item: any) => {
    if (item.product.images && item.product.images.length > 0) {
      return item.product.images[0]
    }
    return item.product.image || '/placeholder.jpg'
  }

  return (
    <Card className="bg-slate-700 border-slate-600 sticky top-4">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <ShoppingBag className="h-5 w-5" />
          Ringkasan Pesanan
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Cart Items */}
        <div className="space-y-3">
          {cart.items.map((item) => (
            <div key={item.id} className="flex items-center space-x-3">
              <div className="relative">
                <Image
                  src={getProductImage(item)}
                  alt={item.product.name}
                  width={50}
                  height={50}
                  className="rounded-lg bg-slate-800"
                />
                <Badge 
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-green-600 text-white text-xs flex items-center justify-center p-0"
                >
                  {item.quantity}
                </Badge>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-white text-sm font-medium truncate">
                  {item.product.name}
                </h4>
                <p className="text-slate-300 text-xs">
                  {formatPrice(Number(item.product.price))} × {item.quantity}
                </p>
              </div>
              <div className="text-white text-sm font-semibold">
                {formatPrice(item.subtotal)}
              </div>
            </div>
          ))}
        </div>

        <Separator className="bg-slate-600" />

        {/* Shipping Address */}
        {selectedAddress && (
          <>
            <div>
              <h4 className="text-white font-medium mb-2">Alamat Pengiriman</h4>
              <div className="bg-slate-600 p-3 rounded-lg border border-slate-500">
                <p className="text-white text-sm font-medium">{selectedAddress.name}</p>
                <p className="text-slate-300 text-xs">{selectedAddress.phone}</p>
                <p className="text-slate-300 text-xs mt-1">
                  {selectedAddress.street}, {selectedAddress.city}, {selectedAddress.state} {selectedAddress.postal_code}
                </p>
              </div>
            </div>
            <Separator className="bg-slate-600" />
          </>
        )}

        {/* Price Breakdown */}
        <div className="space-y-2">
          <div className="flex justify-between text-slate-300">
            <span>Subtotal ({cart.items.reduce((total, item) => total + item.quantity, 0)} item)</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Ongkos Kirim</span>
            <span>{formatPrice(shippingCost)}</span>
          </div>
          <Separator className="bg-slate-600" />
          <div className="flex justify-between text-white font-semibold text-lg">
            <span>Total</span>
            <span>{formatPrice(totalAmount)}</span>
          </div>
        </div>

        {/* Payment Method Info */}
        <div className="bg-slate-600 p-3 rounded-lg border border-slate-500">
          <h4 className="text-white text-sm font-medium mb-2">Metode Pembayaran</h4>
          <div className="flex items-center gap-2">
            <span className="text-2xl">💳</span>
            <div>
              <p className="text-white text-sm">Midtrans Payment Gateway</p>
              <p className="text-slate-300 text-xs">Kartu Kredit, Bank Transfer, E-Wallet, dll</p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-xs text-slate-400 space-y-1">
          <p>• Pesanan akan diproses setelah pembayaran dikonfirmasi</p>
          <p>• Estimasi pengiriman 2-3 hari kerja</p>
          <p>• Gratis ongkir untuk pembelian minimal Rp 500.000</p>
        </div>
      </CardContent>
    </Card>
  )
}