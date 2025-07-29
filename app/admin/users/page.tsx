"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Eye, User, Mail, Phone, Calendar } from "lucide-react"
import { getUsers } from "@/services/admin.service"

// Mock data for development - replace with actual API call
const mockUsers = [
  {
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
    total_spent: 2500000
  },
  {
    id: "2", 
    name: "Wahyu Pratama",
    email: "wahyu@example.com",
    phone: "+62 813-4567-8901",
    role: "customer" as const,
    created_at: "2024-01-10T09:15:00Z",
    updated_at: "2024-01-22T16:45:00Z",
    status: "active",
    last_login: "2024-01-24T11:15:00Z",
    order_count: 8,
    total_spent: 1750000
  },
  {
    id: "3",
    name: "Fauzan Abdullah", 
    email: "fauzan@example.com",
    phone: "+62 814-5678-9012",
    role: "customer" as const,
    created_at: "2024-01-05T14:30:00Z",
    updated_at: "2024-01-18T12:20:00Z",
    status: "inactive",
    last_login: "2024-01-18T12:20:00Z",
    order_count: 5,
    total_spent: 950000
  },
]

interface User {
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
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [roleFilter, setRoleFilter] = useState<string>("")
  const [statusFilter, setStatusFilter] = useState<string>("")
  const router = useRouter()

  useEffect(() => {
    fetchUsers()
  }, [])

  // Trigger new search when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm !== "" || roleFilter !== "" || statusFilter !== "") {
        fetchUsers()
      }
    }, 300) // Debounce search

    return () => clearTimeout(timeoutId)
  }, [searchTerm, roleFilter, statusFilter])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await getUsers({ 
        search: searchTerm, 
        role: roleFilter, 
        status: statusFilter 
      })
      setUsers(response.data || response)
    } catch (error) {
      console.error('Failed to fetch users:', error)
      // Fallback to mock data on error
      await new Promise(resolve => setTimeout(resolve, 500))
      setUsers(mockUsers)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users

  const formatCurrency = (amount?: number) => {
    if (!amount) return "Rp 0"
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status?: string) => {
    if (status === 'active') {
      return <Badge className="bg-green-100 text-green-800 border-green-200">Aktif</Badge>
    }
    return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Tidak Aktif</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Data Pengguna</h1>
          <p className="text-gray-400 mt-1">Kelola dan lihat detail akun pelanggan</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="search"
            placeholder="Cari nama atau email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-gray-400"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 bg-slate-700 border-slate-600 text-white rounded-md"
        >
          <option value="">Semua Role</option>
          <option value="customer">Pelanggan</option>
          <option value="admin">Admin</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-slate-700 border-slate-600 text-white rounded-md"
        >
          <option value="">Semua Status</option>
          <option value="active">Aktif</option>
          <option value="inactive">Tidak Aktif</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <div className="flex items-center">
            <User className="h-8 w-8 text-blue-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-400">Total Pengguna</p>
              <p className="text-2xl font-semibold text-white">{users.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <div className="flex items-center">
            <User className="h-8 w-8 text-green-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-400">Pelanggan Aktif</p>
              <p className="text-2xl font-semibold text-white">
                {users.filter(u => u.role === 'customer' && u.status === 'active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-purple-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-400">Pengguna Baru</p>
              <p className="text-2xl font-semibold text-white">
                {users.filter(u => {
                  const createdDate = new Date(u.created_at)
                  const weekAgo = new Date()
                  weekAgo.setDate(weekAgo.getDate() - 7)
                  return createdDate > weekAgo
                }).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <div className="flex items-center">
            <Mail className="h-8 w-8 text-orange-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-400">Total Transaksi</p>
              <p className="text-2xl font-semibold text-white">
                {users.reduce((sum, u) => sum + (u.order_count || 0), 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold text-gray-900">Pengguna</TableHead>
              <TableHead className="font-semibold text-gray-900">Kontak</TableHead>
              <TableHead className="font-semibold text-gray-900">Status</TableHead>
              <TableHead className="font-semibold text-gray-900">Bergabung</TableHead>
              <TableHead className="font-semibold text-gray-900">Login Terakhir</TableHead>
              <TableHead className="font-semibold text-gray-900">Transaksi</TableHead>
              <TableHead className="font-semibold text-gray-900">Total Belanja</TableHead>
              <TableHead className="font-semibold text-gray-900">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                    <span className="ml-2">Memuat data...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  Tidak ada data pengguna yang ditemukan
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500 capitalize">{user.role}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm text-gray-900">{user.email}</div>
                      {user.phone && (
                        <div className="text-sm text-gray-500">{user.phone}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(user.status)}
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {formatDate(user.created_at)}
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {user.last_login ? formatDate(user.last_login) : '-'}
                  </TableCell>
                  <TableCell className="text-sm text-gray-900">
                    {user.order_count || 0} pesanan
                  </TableCell>
                  <TableCell className="text-sm text-gray-900 font-medium">
                    {formatCurrency(user.total_spent)}
                  </TableCell>
                  <TableCell>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => router.push(`/admin/users/${user.id}`)}
                      className="flex items-center gap-1"
                    >
                      <Eye className="h-4 w-4" />
                      Detail
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
