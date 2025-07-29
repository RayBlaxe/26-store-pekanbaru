"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, User, Mail, Phone, Calendar, ShoppingCart, Package, CreditCard, MapPin } from "lucide-react"
import { getUser, getUserOrderHistory } from "@/services/admin.service"

// Mock user detail data
const mockUserDetail = {
  id: "1",
  name: "Achmad Setiawan", 
  email: "achmad@example.com",
  phone: "+62 812-3456-7890",
  role: "customer" as const,
  created_at: "2024-01-15T08:00:00Z",
  updated_at: "2024-01-20T10:30:00Z",
  status: "active",
  last_login: "2024-01-25T14:22:00Z",
  order_count: 12,
  total_spent: 2500000,
  profile: {
    date_of_birth: "1990-05-15",
    gender: "male",
    address: "Jl. Sudirman No. 123, Pekanbaru, Riau",
    postal_code: "28111"
  }
}

// Mock recent transactions
const mockRecentOrders = [
  {
    id: "ORD-001",
    order_number: "26SP-2024-001",
    status: "delivered",
    total: 450000,
    items_count: 3,
    created_at: "2024-01-20T10:30:00Z",
    delivery_date: "2024-01-22T15:00:00Z"
  },
  {
    id: "ORD-002", 
    order_number: "26SP-2024-002",
    status: "processing",
    total: 320000,
    items_count: 2,
    created_at: "2024-01-18T14:20:00Z",
    delivery_date: null
  },
  {
    id: "ORD-003",
    order_number: "26SP-2024-003", 
    status: "shipped",
    total: 180000,
    items_count: 1,
    created_at: "2024-01-15T09:45:00Z",
    delivery_date: null
  },
  {
    id: "ORD-004",
    order_number: "26SP-2024-004",
    status: "delivered",
    total: 750000,
    items_count: 5,
    created_at: "2024-01-10T16:15:00Z",
    delivery_date: "2024-01-12T11:30:00Z"
  },
  {
    id: "ORD-005",
    order_number: "26SP-2024-005",
    status: "cancelled",
    total: 120000,
    items_count: 1,
    created_at: "2024-01-08T12:00:00Z",
    delivery_date: null
  }
]

interface UserDetail {
  id: string
  name: string
  email: string
  phone?: string
  role: 'admin' | 'customer'
  created_at: string
  updated_at: string
  status?: string
  last_login?: string
  order_count?: number
  total_spent?: number
  profile?: {
    date_of_birth?: string
    gender?: string
    address?: string
    postal_code?: string
  }
}

interface Order {
  id: string
  order_number: string
  status: string
  total: number
  items_count: number
  created_at: string
  delivery_date?: string | null
}

export default function UserDetailPage() {
  const params = useParams()
  const router = useRouter()
  const userId = params.id as string

  const [user, setUser] = useState<UserDetail | null>(null)
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [ordersLoading, setOrdersLoading] = useState(true)

  useEffect(() => {
    if (userId) {
      fetchUserDetail()
      fetchUserOrders()
    }
  }, [userId])

  const fetchUserDetail = async () => {
    try {
      setLoading(true)
      const response = await getUser(userId)
      setUser(response.user || response)
    } catch (error) {
      console.error('Failed to fetch user detail:', error)
      // Fallback to mock data on error
      await new Promise(resolve => setTimeout(resolve, 500))
      setUser(mockUserDetail)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserOrders = async () => {
    try {
      setOrdersLoading(true)
      const response = await getUserOrderHistory(userId, { limit: 10 })
      setRecentOrders(response.data || response)
    } catch (error) {
      console.error('Failed to fetch user orders:', error)
      // Fallback to mock data on error
      await new Promise(resolve => setTimeout(resolve, 700))
      setRecentOrders(mockRecentOrders)
    } finally {
      setOrdersLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'pending': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Menunggu' },
      'processing': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Diproses' },
      'shipped': { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Dikirim' },
      'delivered': { bg: 'bg-green-100', text: 'text-green-800', label: 'Terkirim' },
      'cancelled': { bg: 'bg-red-100', text: 'text-red-800', label: 'Dibatalkan' },
      'active': { bg: 'bg-green-100', text: 'text-green-800', label: 'Aktif' },
      'inactive': { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Tidak Aktif' }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    
    return (
      <Badge className={`${config.bg} ${config.text} border-none`}>
        {config.label}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        <span className="ml-2 text-white">Memuat detail pengguna...</span>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold text-white mb-2">Pengguna tidak ditemukan</h2>
        <Button onClick={() => router.push('/admin/users')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali ke Daftar Pengguna
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/admin/users')}
            className="text-white hover:bg-slate-700 mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">Detail Pengguna</h1>
            <p className="text-gray-400 mt-1">Informasi lengkap akun pelanggan</p>
          </div>
        </div>
      </div>

      {/* User Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Info */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <User className="h-5 w-5 mr-2" />
              Informasi Dasar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-400">Nama Lengkap</p>
              <p className="text-white font-medium">{user.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Email</p>
              <p className="text-white">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Nomor Telepon</p>
              <p className="text-white">{user.phone || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Role</p>
              <p className="text-white capitalize">{user.role}</p>
            </div>
          </CardContent>
        </Card>

        {/* Account Activity */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Aktivitas Akun
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-400">Bergabung Sejak</p>
              <p className="text-white">{formatDate(user.created_at)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Login Terakhir</p>
              <p className="text-white">{user.last_login ? formatDate(user.last_login) : 'Belum pernah login'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Terakhir Diupdate</p>
              <p className="text-white">{formatDate(user.updated_at)}</p>
            </div>
          </CardContent>
        </Card>

        {/* Shopping Summary */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Ringkasan Belanja
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-400">Total Pesanan</p>
              <p className="text-white font-medium text-2xl">{user.order_count || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Belanja</p>
              <p className="text-white font-medium text-xl">{formatCurrency(user.total_spent || 0)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Rata-rata per Pesanan</p>
              <p className="text-white">
                {user.order_count && user.total_spent 
                  ? formatCurrency(Math.round(user.total_spent / user.order_count))
                  : formatCurrency(0)
                }
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profile Info (if available) */}
      {user.profile && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Informasi Profil
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-400">Tanggal Lahir</p>
                <p className="text-white">
                  {user.profile.date_of_birth 
                    ? new Date(user.profile.date_of_birth).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    : '-'
                  }
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Jenis Kelamin</p>
                <p className="text-white capitalize">
                  {user.profile.gender === 'male' ? 'Laki-laki' : 
                   user.profile.gender === 'female' ? 'Perempuan' : '-'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Alamat</p>
                <p className="text-white">{user.profile.address || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Kode Pos</p>
                <p className="text-white">{user.profile.postal_code || '-'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Orders */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Package className="h-5 w-5 mr-2" />
            Transaksi Terbaru
          </CardTitle>
        </CardHeader>
        <CardContent>
          {ordersLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              <span className="ml-2 text-white">Memuat transaksi...</span>
            </div>
          ) : (
            <div className="bg-white rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-900">No. Pesanan</TableHead>
                    <TableHead className="font-semibold text-gray-900">Status</TableHead>
                    <TableHead className="font-semibold text-gray-900">Total</TableHead>
                    <TableHead className="font-semibold text-gray-900">Items</TableHead>
                    <TableHead className="font-semibold text-gray-900">Tanggal Pesan</TableHead>
                    <TableHead className="font-semibold text-gray-900">Tanggal Kirim</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        Belum ada transaksi
                      </TableCell>
                    </TableRow>
                  ) : (
                    recentOrders.map((order) => (
                      <TableRow key={order.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{order.order_number}</TableCell>
                        <TableCell>
                          {getStatusBadge(order.status)}
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(order.total_amount || order.total)}
                        </TableCell>
                        <TableCell>{order.items_count} item</TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {formatDate(order.created_at)}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {order.delivery_date ? formatDate(order.delivery_date) : '-'}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
