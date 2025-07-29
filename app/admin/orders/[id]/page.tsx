"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Package, Truck, CheckCircle, XCircle, Clock, MapPin, Phone, Mail, User } from "lucide-react"
import { getOrder, updateOrderStatus, getOrderStatusHistory } from "@/services/admin.service"
import { toast } from "@/hooks/use-toast"
import { formatPrice, formatDate } from "@/lib/utils"
import Image from "next/image"

interface OrderItem {
  id: string
  product: {
    id: string
    name: string
    image: string
    price: number
  }
  quantity: number
  price: number
}

interface Order {
  id: string
  order_number: string
  user: {
    id: string
    name: string
    email: string
    phone?: string
  }
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  payment_method: string
  subtotal: number
  shipping_cost: number
  total: number
  shipping_address: {
    name: string
    phone: string
    address: string
    city: string
    province: string
    postal_code: string
  }
  items: OrderItem[]
  notes?: string
  tracking_number?: string
  shipped_at?: string
  delivered_at?: string
  created_at: string
  updated_at: string
}

interface StatusHistory {
  id: string
  status: string
  notes?: string
  created_at: string
  updated_by?: {
    name: string
    email: string
  }
}

const statusConfig = {
  pending: { label: "Pending", color: "bg-yellow-500", icon: Clock },
  processing: { label: "Processing", color: "bg-blue-500", icon: Package },
  shipped: { label: "Shipped", color: "bg-purple-500", icon: Truck },
  delivered: { label: "Delivered", color: "bg-green-500", icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "bg-red-500", icon: XCircle },
}

const paymentStatusConfig = {
  pending: { label: "Pending", color: "bg-yellow-500" },
  paid: { label: "Paid", color: "bg-green-500" },
  failed: { label: "Failed", color: "bg-red-500" },
  refunded: { label: "Refunded", color: "bg-gray-500" },
}

export default function OrderDetailPage() {
  const router = useRouter()
  const params = useParams()
  const orderId = params?.id as string

  const [order, setOrder] = useState<Order | null>(null)
  const [statusHistory, setStatusHistory] = useState<StatusHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [statusNotes, setStatusNotes] = useState("")

  const fetchOrder = async () => {
    try {
      setLoading(true)
      const [orderResponse, historyResponse] = await Promise.all([
        getOrder(orderId),
        getOrderStatusHistory(orderId)
      ])
      
      setOrder(orderResponse.data)
      setStatusHistory(historyResponse.data || [])
    } catch (error) {
      console.error('Error fetching order:', error)
      toast({
        title: "Error",
        description: "Failed to fetch order details",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (orderId) {
      fetchOrder()
    }
  }, [orderId])

  const handleStatusUpdate = async (newStatus: string) => {
    if (!order) return
    
    try {
      setUpdatingStatus(true)
      await updateOrderStatus(orderId, newStatus, statusNotes)
      
      setOrder(prev => prev ? { ...prev, status: newStatus as Order['status'] } : null)
      setStatusNotes("")
      
      // Refresh status history
      const historyResponse = await getOrderStatusHistory(orderId)
      setStatusHistory(historyResponse.data || [])
      
      toast({
        title: "Order updated",
        description: `Order status changed to ${newStatus}`,
      })
    } catch (error) {
      console.error('Error updating order status:', error)
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      })
    } finally {
      setUpdatingStatus(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-white mb-4">Pesanan Tidak Ditemukan</h2>
          <Button onClick={() => router.push('/admin/orders')}>
            Kembali ke Pesanan
          </Button>
      </div>
    )
  }

  const statusConfig_ = statusConfig[order.status]
  const paymentConfig = paymentStatusConfig[order.payment_status]
  const StatusIcon = statusConfig_.icon

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => router.push('/admin/orders')}
            className="border-slate-500 text-slate-300 hover:bg-slate-600"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">Order #{order.order_number}</h1>
            <p className="text-gray-400">Created on {formatDate(order.created_at)}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={`${statusConfig_.color} text-white`}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {statusConfig_.label}
          </Badge>
          <Badge className={`${paymentConfig.color} text-white`}>
            {paymentConfig.label}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card className="bg-slate-700 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white">Order Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 bg-slate-600 rounded-lg">
                  <Image
                    src={item.product.image || '/placeholder.jpg'}
                    alt={item.product.name}
                    width={60}
                    height={60}
                    className="rounded-lg bg-slate-800"
                  />
                  <div className="flex-1">
                    <h3 className="text-white font-semibold">{item.product.name}</h3>
                    <p className="text-gray-400">Unit Price: {formatPrice(Number(item.product.price))}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">Qty: {item.quantity}</p>
                    <p className="text-gray-400">{formatPrice(Number(item.price))}</p>
                  </div>
                </div>
              ))}
              
              <Separator className="bg-slate-600" />
              
              <div className="space-y-2">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span>{formatPrice(Number(order.subtotal))}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Shipping</span>
                  <span>{formatPrice(Number(order.shipping_cost))}</span>
                </div>
                <div className="flex justify-between text-white font-semibold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(Number(order.total))}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status History */}
          <Card className="bg-slate-700 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white">Status History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {statusHistory.map((history, index) => (
                  <div key={history.id} className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className={`w-8 h-8 rounded-full ${statusConfig[history.status as keyof typeof statusConfig]?.color || 'bg-gray-500'} flex items-center justify-center`}>
                        {(() => {
                          const IconComponent = statusConfig[history.status as keyof typeof statusConfig]?.icon || Clock
                          return <IconComponent className="w-4 h-4 text-white" />
                        })()}
                      </div>
                      {index < statusHistory.length - 1 && (
                        <div className="w-0.5 h-8 bg-slate-600 ml-4 mt-2" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-white font-medium capitalize">{history.status}</h4>
                        <span className="text-sm text-gray-400">{formatDate(history.created_at)}</span>
                      </div>
                      {history.notes && (
                        <p className="text-gray-300 text-sm mt-1">{history.notes}</p>
                      )}
                      {history.updated_by && (
                        <p className="text-gray-400 text-xs mt-1">
                          Updated by {history.updated_by.name}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <Card className="bg-slate-700 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
              <User className="h-5 w-5 mr-2" />
              Pelanggan
            </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-white">{order.user.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-white">{order.user.email}</span>
              </div>
              {order.user.phone && (
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-white">{order.user.phone}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card className="bg-slate-700 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-white font-medium">{order.shipping_address.name}</p>
              <p className="text-gray-300">{order.shipping_address.phone}</p>
              <p className="text-gray-300">{order.shipping_address.address}</p>
              <p className="text-gray-300">
                {order.shipping_address.city}, {order.shipping_address.province} {order.shipping_address.postal_code}
              </p>
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card className="bg-slate-700 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white">Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-300">Method:</span>
                <span className="text-white">{order.payment_method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Status:</span>
                <Badge className={`${paymentConfig.color} text-white text-xs`}>
                  {paymentConfig.label}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Update Status */}
          <Card className="bg-slate-700 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white">Update Order Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-300">New Status</Label>
                <Select
                  value={order.status}
                  onValueChange={(value) => handleStatusUpdate(value)}
                  disabled={updatingStatus}
                >
                  <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-gray-300">Catatan (Opsional)</Label>
                <Textarea
                  placeholder="Add notes about the status change..."
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  className="bg-slate-600 border-slate-500 text-white"
                  disabled={updatingStatus}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
