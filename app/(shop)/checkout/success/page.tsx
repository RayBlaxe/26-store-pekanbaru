"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import CustomerLayout from "@/components/customer-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  CheckCircle, 
  Package, 
  MapPin, 
  CreditCard, 
  Calendar, 
  ArrowRight,
  Home,
  FileText
} from "lucide-react"
import { Order } from "@/types/product"
import { orderService } from "@/services/order.service"
import { formatPrice } from "@/lib/utils"
import { toast } from "sonner"
import Image from "next/image"

export default function CheckoutSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order_id')
  
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!orderId) {
      router.push('/orders')
      return
    }

    loadOrder()
  }, [orderId, router])

  const loadOrder = async () => {
    try {
      setIsLoading(true)
      const response = await orderService.getOrderByIdentifier(orderId!)
      setOrder(response.data)
    } catch (error: any) {
      console.error('Failed to load order:', error)
      setError(error.message || 'Gagal memuat detail pesanan')
      toast.error('Gagal memuat detail pesanan')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Menunggu', className: 'bg-yellow-600' },
      processing: { label: 'Diproses', className: 'bg-blue-600' },
      shipped: { label: 'Dikirim', className: 'bg-purple-600' },
      delivered: { label: 'Diterima', className: 'bg-green-600' },
      cancelled: { label: 'Dibatalkan', className: 'bg-red-600' },
    }
    const config = statusConfig[status as keyof typeof statusConfig]
    return (
      <Badge className={`${config?.className || 'bg-gray-600'} text-white`}>
        {config?.label || status}
      </Badge>
    )
  }

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Menunggu Pembayaran', className: 'bg-yellow-600' },
      paid: { label: 'Sudah Dibayar', className: 'bg-green-600' },
      failed: { label: 'Gagal', className: 'bg-red-600' },
      expired: { label: 'Kedaluwarsa', className: 'bg-gray-600' },
    }
    const config = statusConfig[status as keyof typeof statusConfig]
    return (
      <Badge className={`${config?.className || 'bg-gray-600'} text-white`}>
        {config?.label || status}
      </Badge>
    )
  }

  const getProductImage = (item: any) => {
    if (item.product.images && item.product.images.length > 0) {
      return item.product.images[0]
    }
    return item.product.image || '/placeholder.jpg'
  }

  // Loading state
  if (isLoading) {
    return (
      <CustomerLayout>
        <div className="min-h-screen py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <Skeleton className="h-16 w-16 rounded-full bg-slate-600 mx-auto mb-4" />
              <Skeleton className="h-8 w-64 bg-slate-600 mx-auto mb-2" />
              <Skeleton className="h-4 w-48 bg-slate-600 mx-auto" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-32 bg-slate-600" />
              <Skeleton className="h-48 bg-slate-600" />
              <Skeleton className="h-32 bg-slate-600" />
            </div>
          </div>
        </div>
      </CustomerLayout>
    )
  }

  // Error state
  if (error || !order) {
    return (
      <CustomerLayout>
        <div className="min-h-screen py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <div className="h-16 w-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">❌</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Gagal Memuat Pesanan</h2>
              <p className="text-gray-400 mb-6">{error || 'Pesanan tidak ditemukan'}</p>
              <div className="space-x-4">
                <Button variant="outline" onClick={() => router.push('/')}>
                  <Home className="h-4 w-4 mr-2" />
                  Beranda
                </Button>
                <Button onClick={() => router.push('/orders')}>
                  <FileText className="h-4 w-4 mr-2" />
                  Riwayat Pesanan
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CustomerLayout>
    )
  }

  return (
    <CustomerLayout>
      <div className="min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="h-16 w-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Pembayaran Berhasil!</h1>
            <p className="text-slate-300">
              Terima kasih telah berbelanja. Pesanan Anda sedang diproses.
            </p>
          </div>

          {/* Order Summary */}
          <Card className="bg-slate-700 border-slate-600 mb-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Detail Pesanan
                </span>
                <div className="flex gap-2">
                  {getStatusBadge(order.status)}
                  {getPaymentStatusBadge(order.payment_status)}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-slate-300 text-sm font-medium mb-1">Nomor Pesanan</h4>
                  <p className="text-white font-mono">{order.order_number}</p>
                </div>
                <div>
                  <h4 className="text-slate-300 text-sm font-medium mb-1">Tanggal Pesanan</h4>
                  <p className="text-white flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(order.created_at).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card className="bg-slate-700 border-slate-600 mb-6">
            <CardHeader>
              <CardTitle className="text-white">Produk yang Dipesan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <Image
                      src={getProductImage(item)}
                      alt={item.product.name}
                      width={60}
                      height={60}
                      className="rounded-lg bg-slate-800"
                    />
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{item.product.name}</h4>
                      <p className="text-slate-300 text-sm">
                        {formatPrice(item.price)} × {item.quantity}
                      </p>
                    </div>
                    <div className="text-white font-semibold">
                      {formatPrice(item.subtotal)}
                    </div>
                  </div>
                ))}
              </div>
              
              <Separator className="bg-slate-600 my-4" />
              
              <div className="space-y-2">
                <div className="flex justify-between text-slate-300">
                  <span>Subtotal</span>
                  <span>{formatPrice(order.total_amount - order.shipping_cost)}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Ongkos Kirim</span>
                  <span>{formatPrice(order.shipping_cost)}</span>
                </div>
                <Separator className="bg-slate-600" />
                <div className="flex justify-between text-white font-semibold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(order.total_amount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card className="bg-slate-700 border-slate-600 mb-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Alamat Pengiriman
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-600 p-4 rounded-lg border border-slate-500">
                <h4 className="text-white font-semibold mb-1">{order.shipping_address.name}</h4>
                <p className="text-slate-300 text-sm mb-2">{order.shipping_address.phone}</p>
                <p className="text-slate-300 text-sm">
                  {order.shipping_address.street}<br />
                  {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card className="bg-slate-700 border-slate-600 mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Informasi Pembayaran
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-600 p-4 rounded-lg border border-slate-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Metode Pembayaran</p>
                    <p className="text-slate-300 text-sm">{order.payment_method || 'Midtrans Payment Gateway'}</p>
                  </div>
                  {getPaymentStatusBadge(order.payment_status)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="outline"
              onClick={() => router.push('/')}
              className="border-slate-500 text-slate-300 hover:bg-slate-600 hover:text-white"
            >
              <Home className="h-4 w-4 mr-2" />
              Lanjut Belanja
            </Button>
            <Button
              onClick={() => router.push('/orders')}
              className="bg-green-600 hover:bg-green-700"
            >
              <FileText className="h-4 w-4 mr-2" />
              Lihat Semua Pesanan
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <div className="bg-slate-700 border border-slate-600 rounded-lg p-6">
              <h3 className="text-white font-semibold mb-3">Langkah Selanjutnya</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-300">
                <div className="text-center">
                  <div className="text-2xl mb-2">📦</div>
                  <p>Pesanan sedang diproses dan akan segera dikirim</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">🚚</div>
                  <p>Estimasi pengiriman 2-3 hari kerja</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">📱</div>
                  <p>Notifikasi status akan dikirim via email</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  )
}