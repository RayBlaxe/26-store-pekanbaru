"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import CustomerLayout from "@/components/customer-layout"
import OrderStatus, { getStatusProgress, getStatusSteps } from "@/components/orders/order-status"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  ArrowLeft, 
  Package, 
  MapPin, 
  CreditCard, 
  Calendar, 
  Phone,
  FileText,
  AlertCircle,
  CheckCircle,
  Truck,
  Home,
  RefreshCw
} from "lucide-react"
import { Order } from "@/types/product"
import { orderService } from "@/services/order.service"
import { paymentService } from "@/services/payment.service"
import { useAuthStore } from "@/stores/auth-store"
import { formatPrice } from "@/lib/utils"
import { toast } from "sonner"
import Image from "next/image"


export default function OrderDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const orderId = params.id as string
  const { isAuthenticated } = useAuthStore()
  
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [paymentProcessed, setPaymentProcessed] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/login?callbackUrl=${encodeURIComponent(window.location.pathname + window.location.search)}`)
      return
    }

    if (!orderId) {
      router.push('/orders')
      return
    }

    loadOrder()
  }, [isAuthenticated, orderId, router])

  // Check for payment success parameters (client-side only)
  useEffect(() => {
    if (typeof window === 'undefined') return // Skip on server-side
    
    const urlParams = new URLSearchParams(window.location.search)
    const statusCode = urlParams.get('status_code')
    const transactionStatus = urlParams.get('transaction_status')
    
    console.log('Checking payment success params:', {
      statusCode,
      transactionStatus,
      paymentProcessed
    })
    
    if (statusCode === '200' && transactionStatus === 'settlement' && !paymentProcessed) {
      console.log('Payment success detected! Updating order status...')
      setPaymentProcessed(true)
      toast.success('Pembayaran berhasil! Status pesanan sedang diperbarui.')
      
      // Clean up URL parameters immediately
      const cleanUrl = window.location.pathname
      window.history.replaceState(null, '', cleanUrl)
      
      // Wait for order to load first, then update status
      if (order) {
        handlePaymentSuccess()
      }
    }
  }, [order, paymentProcessed]) // Trigger when order data loads

  const handlePaymentSuccess = async () => {
    console.log('handlePaymentSuccess called for order:', orderId)
    try {
      // Update order status to processing since payment is successful
      console.log('Updating order status to processing...')
      const result = await orderService.updateOrderStatus(parseInt(orderId), 'processing')
      console.log('Order status update result:', result)
      
      // Reload order data to reflect the updated status
      console.log('Reloading order data...')
      await loadOrder(true)
      
      toast.success('Status pesanan telah diperbarui - Pesanan sedang diproses!')
    } catch (error: any) {
      console.error('Failed to update order status:', error)
      toast.error('Gagal memperbarui status pesanan. Silakan refresh halaman.')
    }
  }

  const loadOrder = async (refresh = false) => {
    try {
      if (refresh) {
        setIsRefreshing(true)
      } else {
        setIsLoading(true)
      }
      setError(null)

      const response = await orderService.getOrderByIdentifier(orderId)
      setOrder(response.data)
    } catch (error: any) {
      console.error('Failed to load order:', error)
      setError(error.message || 'Gagal memuat detail pesanan')
      toast.error('Gagal memuat detail pesanan')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  const handleRefresh = () => {
    loadOrder(true)
  }

  const handlePayNow = async () => {
    if (!order) return

    try {
      setIsProcessingPayment(true)
      
      await paymentService.processPayment(order.id, {
        onSuccess: (result) => {
          console.log('Payment success:', result)
          toast.success("Pembayaran berhasil!")
          loadOrder(true)
        },
        onPending: (result) => {
          console.log('Payment pending:', result)
          toast.info("Pembayaran sedang diproses.")
          loadOrder(true)
        },
        onError: (result) => {
          console.error('Payment error:', result)
          toast.error("Pembayaran gagal. Silakan coba lagi.")
        },
        onClose: () => {
          setIsProcessingPayment(false)
        }
      })
    } catch (error: any) {
      console.error('Payment processing error:', error)
      toast.error(error.message || "Gagal memproses pembayaran")
    } finally {
      setIsProcessingPayment(false)
    }
  }

  const handleCancelOrder = async () => {
    if (!order) return

    try {
      await orderService.cancelOrder(order.id)
      toast.success('Pesanan berhasil dibatalkan')
      loadOrder(true)
    } catch (error: any) {
      toast.error(error.message || 'Gagal membatalkan pesanan')
    }
  }

  const handleMarkAsReceived = async () => {
    if (!order) return

    try {
      await orderService.updateOrderStatus(order.id, 'delivered')
      toast.success('Pesanan berhasil ditandai sebagai diterima')
      loadOrder(true)
    } catch (error: any) {
      toast.error(error.message || 'Gagal menandai pesanan sebagai diterima')
    }
  }

  const getProductImage = (item: any) => {
    // Handle different API response structures
    if (item.product) {
      // If product relationship is loaded
      if (item.product.images && item.product.images.length > 0) {
        return item.product.images[0]
      }
      return item.product.image || '/placeholder.jpg'
    }
    // If product data is embedded directly in item
    if (item.product_image) {
      return item.product_image
    }
    return '/placeholder.jpg'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const canPay = order?.payment_status === 'pending' && order?.status !== 'cancelled'
  const canCancel = order?.status === 'pending' && order?.payment_status !== 'paid'
  const canMarkAsReceived = order?.status === 'shipped' && order?.payment_status === 'paid'
  const statusProgress = order ? getStatusProgress(order.status) : 0
  const statusSteps = getStatusSteps()

  // Loading state
  if (isLoading) {
    return (
      <CustomerLayout>
        <div className="min-h-screen py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Skeleton className="h-8 w-48 bg-slate-600 mb-8" />
            <div className="space-y-6">
              <Skeleton className="h-48 bg-slate-600" />
              <Skeleton className="h-32 bg-slate-600" />
              <Skeleton className="h-64 bg-slate-600" />
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
                <AlertCircle className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Pesanan Tidak Ditemukan</h2>
              <p className="text-gray-400 mb-6">{error || 'Pesanan tidak ditemukan atau Anda tidak memiliki akses'}</p>
              <div className="space-x-4">
                <Button variant="outline" onClick={() => router.push('/orders')}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Kembali ke Riwayat
                </Button>
                <Button onClick={() => router.push('/')}>
                  <Home className="h-4 w-4 mr-2" />
                  Beranda
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
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/orders')}
                className="text-slate-300 hover:text-white hover:bg-slate-600"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-white">Detail Pesanan</h1>
                <p className="text-slate-300 font-mono">{order.order_number}</p>
              </div>
            </div>
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              variant="outline"
              size="sm"
              className="border-slate-500 text-slate-300 hover:bg-slate-600"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {/* Payment Alert */}
          {canPay && (
            <Alert className="border-yellow-500 bg-yellow-500/10 mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-yellow-300 flex items-center justify-between">
                <span>Pesanan menunggu pembayaran. Segera lakukan pembayaran untuk melanjutkan proses.</span>
                <Button
                  onClick={handlePayNow}
                  disabled={isProcessingPayment}
                  size="sm"
                  className="bg-yellow-600 hover:bg-yellow-700 text-white ml-4"
                >
                  {isProcessingPayment ? "Memproses..." : "Bayar Sekarang"}
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Mark as Received Alert */}
          {canMarkAsReceived && (
            <Alert className="border-green-500 bg-green-500/10 mb-6">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription className="text-green-300 flex items-center justify-between">
                <span>Pesanan telah dikirim. Klik tombol di bawah jika Anda sudah menerima pesanan.</span>
                <Button
                  onClick={handleMarkAsReceived}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white ml-4"
                >
                  Tandai Diterima
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Order Status Progress */}
          <Card className="bg-slate-700 border-slate-600 mb-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Status Pesanan
                </span>
                <OrderStatus status={order.status} paymentStatus={order.payment_status} />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-slate-300 mb-2">
                    <span>Progress</span>
                    <span>{statusProgress}%</span>
                  </div>
                  <Progress value={statusProgress} className="h-2" />
                </div>
                
                <div className="grid grid-cols-4 gap-2">
                  {statusSteps.map((step, index) => {
                    const isActive = statusProgress >= (index + 1) * 25
                    const isCancelled = order.status === 'cancelled'
                    
                    return (
                      <div key={step.key} className="text-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 text-sm ${
                            isCancelled
                              ? 'bg-gray-600 text-gray-400'
                              : isActive
                              ? 'bg-green-600 text-white'
                              : 'bg-slate-600 text-slate-400'
                          }`}
                        >
                          {step.icon}
                        </div>
                        <p className={`text-xs ${
                          isCancelled
                            ? 'text-gray-400'
                            : isActive
                            ? 'text-green-400'
                            : 'text-slate-400'
                        }`}>
                          {step.label}
                        </p>
                      </div>
                    )
                  })}
                </div>

                <div className="text-sm text-slate-300">
                  <p><strong>Dibuat:</strong> {formatDate(order.created_at)}</p>
                  <p><strong>Terakhir diupdate:</strong> {formatDate(order.updated_at)}</p>
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
                  <div key={item.id} className="flex items-center space-x-4 p-4 bg-slate-600 rounded-lg border border-slate-500">
                    <Image
                      src={getProductImage(item)}
                      alt={item.product?.name || item.product_name || 'Product'}
                      width={80}
                      height={80}
                      className="rounded-lg bg-slate-800"
                    />
                    <div className="flex-1">
                      <h4 className="text-white font-semibold">
                        {item.product?.name || item.product_name || 'Unknown Product'}
                      </h4>
                      <p className="text-slate-300 text-sm mb-1">
                        SKU: {item.product?.sku || item.product_sku || 'N/A'}
                      </p>
                      <p className="text-slate-300">
                        {formatPrice(item.price)} × {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-semibold">
                        {formatPrice(item.subtotal)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Separator className="bg-slate-600 my-4" />
              
              <div className="space-y-2">
                <div className="flex justify-between text-slate-300">
                  <span>Subtotal ({order.items.reduce((total, item) => total + item.quantity, 0)} item)</span>
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

          {/* Shipping Information */}
          <Card className="bg-slate-700 border-slate-600 mb-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Informasi Pengiriman
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-600 p-4 rounded-lg border border-slate-500">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <h4 className="text-white font-semibold mb-1">{order.shipping_address.name}</h4>
                    <div className="flex items-center gap-2 text-slate-300 text-sm mb-2">
                      <Phone className="h-4 w-4" />
                      <span>{order.shipping_address.phone}</span>
                    </div>
                    <p className="text-slate-300 text-sm">
                      {order.shipping_address.street}<br />
                      {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
                    </p>
                  </div>
                  {order.status === 'shipped' && (
                    <div className="flex items-center gap-2 text-green-400">
                      <Truck className="h-5 w-5" />
                      <span className="text-sm font-medium">Dalam Perjalanan</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card className="bg-slate-700 border-slate-600 mb-6">
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
                  <OrderStatus status={order.status} paymentStatus={order.payment_status} size="sm" />
                </div>
                {order.payment_token && (
                  <div className="mt-3 pt-3 border-t border-slate-500">
                    <p className="text-slate-300 text-sm">Token: {order.payment_token}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Order Notes */}
          {order.notes && (
            <Card className="bg-slate-700 border-slate-600 mb-6">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Catatan Pesanan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-600 p-4 rounded-lg border border-slate-500">
                  <p className="text-slate-300">{order.notes}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {canCancel && (
              <Button
                onClick={handleCancelOrder}
                variant="outline"
                className="border-red-500 text-red-400 hover:bg-red-600 hover:text-white"
              >
                Batalkan Pesanan
              </Button>
            )}
            
            <Button
              onClick={() => router.push('/orders')}
              variant="outline"
              className="border-slate-500 text-slate-300 hover:bg-slate-600 hover:text-white"
            >
              <FileText className="h-4 w-4 mr-2" />
              Lihat Semua Pesanan
            </Button>
            
            <Button
              onClick={() => router.push('/')}
              className="bg-green-600 hover:bg-green-700"
            >
              <Home className="h-4 w-4 mr-2" />
              Lanjut Belanja
            </Button>
          </div>
        </div>
      </div>
    </CustomerLayout>
  )
}