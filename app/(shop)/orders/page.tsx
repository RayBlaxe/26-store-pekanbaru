"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import CustomerLayout from "@/components/customer-layout"
import OrderCard from "@/components/orders/order-card"
import OrderStatus from "@/components/orders/order-status"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  FileText, 
  Search, 
  Filter, 
  ShoppingBag, 
  RefreshCw,
  AlertCircle
} from "lucide-react"
import { Order } from "@/types/product"
import { orderService } from "@/services/order.service"
import { useAuthStore } from "@/stores/auth-store"
import { toast } from "sonner"

export default function OrdersPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/orders')
      return
    }

    loadOrders()
  }, [isAuthenticated, currentPage, statusFilter, router])

  const loadOrders = async (refresh = false) => {
    try {
      if (refresh) {
        setIsRefreshing(true)
      } else {
        setIsLoading(true)
      }
      setError(null)

      const response = await orderService.getOrders(currentPage, 10)
      let filteredOrders = response.data

      // Apply status filter
      if (statusFilter !== "all") {
        filteredOrders = response.data.filter(order => order.status === statusFilter)
      }

      setOrders(filteredOrders)
      setTotalPages(response.last_page)
    } catch (error: any) {
      console.error('Failed to load orders:', error)
      setError(error.message || 'Gagal memuat riwayat pesanan')
      toast.error('Gagal memuat riwayat pesanan')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  const handleRefresh = () => {
    loadOrders(true)
  }

  const handleViewDetails = (orderId: number) => {
    router.push(`/orders/${orderId}`)
  }

  const handleReorder = async (orderId: number) => {
    try {
      // Get order details and add items to cart
      const orderResponse = await orderService.getOrder(orderId)
      const order = orderResponse.data
      
      // Here you would add the items back to the cart
      // For now, just show a success message and redirect to cart
      toast.success('Produk berhasil ditambahkan ke keranjang!')
      router.push('/cart')
    } catch (error: any) {
      toast.error('Gagal menambahkan produk ke keranjang')
    }
  }

  const handleCancelOrder = async (orderId: number) => {
    try {
      await orderService.cancelOrder(orderId)
      toast.success('Pesanan berhasil dibatalkan')
      loadOrders(true)
    } catch (error: any) {
      toast.error(error.message || 'Gagal membatalkan pesanan')
    }
  }

  const filteredOrders = orders.filter(order => 
    order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.items.some(item => 
      item.product.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  )

  const getStatusOptions = () => [
    { value: "all", label: "Semua Status" },
    { value: "pending", label: "Menunggu" },
    { value: "processing", label: "Diproses" },
    { value: "shipped", label: "Dikirim" },
    { value: "delivered", label: "Diterima" },
    { value: "cancelled", label: "Dibatalkan" },
  ]

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <CustomerLayout>
        <div className="min-h-screen py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">Please Login</h2>
              <p className="text-gray-400 mb-6">You need to be logged in to view your orders.</p>
              <Button onClick={() => router.push('/login?redirect=/orders')}>Login</Button>
            </div>
          </div>
        </div>
      </CustomerLayout>
    )
  }

  return (
    <CustomerLayout>
      <div className="min-h-screen py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <FileText className="h-8 w-8" />
                Riwayat Pesanan
              </h1>
              <p className="text-slate-300 mt-1">Kelola dan lacak pesanan Anda</p>
            </div>
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              variant="outline"
              className="border-slate-500 text-slate-300 hover:bg-slate-600"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {/* Filters */}
          <Card className="bg-slate-700 border-slate-600 mb-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filter & Pencarian
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Cari nomor pesanan atau nama produk..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-slate-600 border-slate-500 text-white placeholder-slate-400"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    {getStatusOptions().map((option) => (
                      <SelectItem 
                        key={option.value} 
                        value={option.value}
                        className="text-white hover:bg-slate-600"
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Error State */}
          {error && (
            <Alert className="border-red-500 bg-red-500/10 mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-300">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Loading State */}
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-64 bg-slate-600" />
              ))}
            </div>
          ) : (
            <>
              {/* Orders List */}
              {filteredOrders.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-white mb-4">
                    {searchQuery || statusFilter !== "all" 
                      ? "Tidak Ada Pesanan Ditemukan" 
                      : "Belum Ada Pesanan"
                    }
                  </h2>
                  <p className="text-gray-400 mb-6">
                    {searchQuery || statusFilter !== "all"
                      ? "Coba ubah filter atau kata kunci pencarian"
                      : "Mulai berbelanja untuk membuat pesanan pertama Anda"
                    }
                  </p>
                  <div className="space-x-4">
                    {(searchQuery || statusFilter !== "all") && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSearchQuery("")
                          setStatusFilter("all")
                        }}
                        className="border-slate-500 text-slate-300 hover:bg-slate-600"
                      >
                        Reset Filter
                      </Button>
                    )}
                    <Button onClick={() => router.push('/')}>
                      Mulai Belanja
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onViewDetails={handleViewDetails}
                      onReorder={handleReorder}
                      onCancelOrder={handleCancelOrder}
                    />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      className="border-slate-500 text-slate-300 hover:bg-slate-600"
                    >
                      Previous
                    </Button>
                    
                    <div className="flex items-center gap-1">
                      {[...Array(Math.min(5, totalPages))].map((_, i) => {
                        const page = i + 1
                        return (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            onClick={() => setCurrentPage(page)}
                            className={
                              currentPage === page
                                ? "bg-green-600 hover:bg-green-700"
                                : "border-slate-500 text-slate-300 hover:bg-slate-600"
                            }
                          >
                            {page}
                          </Button>
                        )
                      })}
                    </div>
                    
                    <Button
                      variant="outline"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      className="border-slate-500 text-slate-300 hover:bg-slate-600"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </CustomerLayout>
  )
}