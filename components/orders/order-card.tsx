"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import OrderStatus from "./order-status"
import { Calendar, Package, Eye, MoreHorizontal } from "lucide-react"
import { Order } from "@/types/product"
import { formatPrice } from "@/lib/utils"
import Image from "next/image"

interface OrderCardProps {
  order: Order
  onViewDetails: (orderId: number) => void
  onReorder?: (orderId: number) => void
  onCancelOrder?: (orderId: number) => void
  onMarkAsReceived?: (orderId: number) => void
  showActions?: boolean
}

export default function OrderCard({
  order,
  onViewDetails,
  onReorder,
  onCancelOrder,
  onMarkAsReceived,
  showActions = true
}: OrderCardProps) {
  const getProductImage = (item: any) => {
    if (item.product.images && item.product.images.length > 0) {
      return item.product.images[0]
    }
    return item.product.image || '/placeholder.jpg'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const canCancel = order.status === 'pending' && order.payment_status !== 'paid'
  const canReorder = order.status === 'delivered' || order.status === 'cancelled'
  const canMarkAsReceived = order.status === 'shipped' && order.payment_status === 'paid'

  return (
    <Card className="bg-slate-700 border-slate-600 hover:border-slate-500 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(order.created_at)}</span>
            </div>
            <h3 className="font-semibold text-white font-mono">
              {order.order_number}
            </h3>
          </div>
          <OrderStatus 
            status={order.status} 
            paymentStatus={order.payment_status}
            size="sm"
          />
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {/* Order Items Preview */}
        <div className="space-y-3 mb-4">
          {order.items.slice(0, 2).map((item) => (
            <div key={item.id} className="flex items-center space-x-3">
              <Image
                src={getProductImage(item)}
                alt={item.product.name}
                width={40}
                height={40}
                className="rounded-lg bg-slate-800"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-white text-sm font-medium truncate">
                  {item.product.name}
                </h4>
                <p className="text-slate-300 text-xs">
                  {formatPrice(item.price)} × {item.quantity}
                </p>
              </div>
              <div className="text-white text-sm font-semibold">
                {formatPrice(item.subtotal)}
              </div>
            </div>
          ))}
          
          {order.items.length > 2 && (
            <div className="text-center">
              <p className="text-slate-400 text-sm">
                +{order.items.length - 2} produk lainnya
              </p>
            </div>
          )}
        </div>

        <Separator className="bg-slate-600 my-4" />

        {/* Order Summary */}
        <div className="space-y-2">
          <div className="flex justify-between text-slate-300 text-sm">
            <span>Total Item</span>
            <span>{order.items.reduce((total, item) => total + item.quantity, 0)} item</span>
          </div>
          <div className="flex justify-between text-slate-300 text-sm">
            <span>Ongkos Kirim</span>
            <span>{formatPrice(order.shipping_cost)}</span>
          </div>
          <div className="flex justify-between text-white font-semibold">
            <span>Total Pembayaran</span>
            <span>{formatPrice(order.total_amount)}</span>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="mt-4 p-3 bg-slate-600 rounded-lg border border-slate-500">
          <div className="flex items-start gap-2">
            <Package className="h-4 w-4 text-slate-300 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium">{order.shipping_address.name}</p>
              <p className="text-slate-300 text-xs truncate">
                {order.shipping_address.city}, {order.shipping_address.state}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2 mt-4">
            <Button
              onClick={() => onViewDetails(order.id)}
              variant="outline"
              size="sm"
              className="flex-1 border-slate-500 text-slate-300 hover:bg-slate-600 hover:text-white"
            >
              <Eye className="h-4 w-4 mr-1" />
              Detail
            </Button>
            
            {canReorder && onReorder && (
              <Button
                onClick={() => onReorder(order.id)}
                variant="outline"
                size="sm"
                className="border-green-500 text-green-400 hover:bg-green-600 hover:text-white"
              >
                Pesan Lagi
              </Button>
            )}
            
            {canMarkAsReceived && onMarkAsReceived && (
              <Button
                onClick={() => onMarkAsReceived(order.id)}
                variant="outline"
                size="sm"
                className="border-blue-500 text-blue-400 hover:bg-blue-600 hover:text-white"
              >
                Tandai Diterima
              </Button>
            )}
            
            {canCancel && onCancelOrder && (
              <Button
                onClick={() => onCancelOrder(order.id)}
                variant="outline"
                size="sm"
                className="border-red-500 text-red-400 hover:bg-red-600 hover:text-white"
              >
                Batalkan
              </Button>
            )}
          </div>
        )}

        {/* Order Notes */}
        {order.notes && (
          <div className="mt-3 p-2 bg-slate-600 rounded text-xs text-slate-300">
            <strong>Catatan:</strong> {order.notes}
          </div>
        )}
      </CardContent>
    </Card>
  )
}