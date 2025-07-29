"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Eye, User, Mail, Phone, Calendar } from "lucide-react"
import { getUsers } from "@/services/admin.service"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"

// User interface definition

interface User {
  id: string
  name: string
  email: string
  phone?: string
  role: 'admin' | 'customer' | 'superadmin'
  created_at: string
  updated_at: string
  last_login?: string
  order_count?: number
  total_spent?: number
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [roleFilter, setRoleFilter] = useState<string>("")
  const router = useRouter()
  const { user: currentUser } = useAuth()

  // Determine if current user can see all users or just customers
  const canSeeAllUsers = currentUser?.role === 'superadmin'
  
  useEffect(() => {
    fetchUsers()
  }, [currentUser])

  // Trigger new search when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm !== "" || roleFilter !== "") {
        fetchUsers()
      }
    }, 300) // Debounce search

    return () => clearTimeout(timeoutId)
  }, [searchTerm, roleFilter])

  const { toast } = useToast()

  const fetchUsers = async () => {
    try {
      setLoading(true)
      
      // For admin users, only fetch customers. For superadmin, fetch based on filter
      let defaultRoleFilter = ''
      if (!canSeeAllUsers) {
        defaultRoleFilter = 'customer'
      }
      
      const response = await getUsers({ 
        search: searchTerm, 
        role: roleFilter || defaultRoleFilter
      })
      
      // Make sure we have data in the expected format
      if (response && (response.data || Array.isArray(response))) {
        setUsers(response.data || response)
      } else {
        console.error('Invalid API response format:', response)
        setUsers([])
      }
    } catch (error: any) {
      console.error('Failed to fetch users:', error)
      setUsers([])
      // Show error message to the user
      const errorMessage = error.response?.data?.message || 'Failed to load user data. Please try again.'
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      })
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {canSeeAllUsers ? 'Data Pengguna' : 'Data Pelanggan'}
          </h1>
          <p className="text-gray-400 mt-1">
            {canSeeAllUsers 
              ? 'Kelola dan lihat detail semua pengguna sistem' 
              : 'Kelola dan lihat detail akun pelanggan'
            }
          </p>
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

        {/* Only show role filter for superadmin */}
        {canSeeAllUsers && (
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 bg-slate-700 border-slate-600 text-white rounded-md"
          >
            <option value="">Semua Role</option>
            <option value="customer">Pelanggan</option>
            <option value="admin">Admin</option>
            <option value="superadmin">Super Admin</option>
          </select>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <div className="flex items-center">
            <User className="h-8 w-8 text-blue-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-400">
                {canSeeAllUsers ? 'Total Pengguna' : 'Total Pelanggan'}
              </p>
              <p className="text-2xl font-semibold text-white">{users.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-purple-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-400">
                {canSeeAllUsers ? 'Pengguna Baru' : 'Pelanggan Baru'}
              </p>
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
              <TableHead>Pengguna</TableHead>
                <TableHead>Peran</TableHead>
                <TableHead>Tanggal Bergabung</TableHead>
                <TableHead>Login Terakhir</TableHead>
                <TableHead>Total Pesanan</TableHead>
                <TableHead>Total Pengeluaran</TableHead>
                <TableHead>Tindakan</TableHead>
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
                  {canSeeAllUsers ? 'Tidak ada data pengguna yang ditemukan' : 'Tidak ada data pelanggan yang ditemukan'}
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900">{user.name}</div>
                      {canSeeAllUsers && (
                        <div className="text-sm text-gray-500 capitalize">
                          {user.role === 'superadmin' ? 'Super Admin' : 
                           user.role === 'admin' ? 'Admin' : 'Pelanggan'}
                        </div>
                      )}
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
                  
                  <TableCell className="text-sm text-gray-500">
                    {formatDate(user.created_at)}
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {user.last_login ? formatDate(user.last_login) : '-'}
                  </TableCell>
                  <TableCell className="text-sm text-gray-900">
                    {user.role === 'customer' ? `${user.order_count || 0} pesanan` : '-'}
                  </TableCell>
                  <TableCell className="text-sm text-gray-900 font-medium">
                    {user.role === 'customer' ? formatCurrency(user.total_spent) : '-'}
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
