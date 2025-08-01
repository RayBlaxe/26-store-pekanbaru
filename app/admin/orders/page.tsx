"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DataTable } from "@/components/admin/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Eye, Package, Truck, CheckCircle, XCircle, Clock, Filter, Search, Download } from "lucide-react"
import { getOrders, updateOrderStatus, exportOrders } from "@/services/admin.service"
import { toast } from "@/hooks/use-toast"
import { formatPrice, formatDate } from "@/lib/utils"

interface Order {
  id: string
  order_number: string
  customer: {
    id: string
    name: string
    email: string
  }
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  total_amount: number
  shipping_cost: number
  items_count: number
  shipping_address?: {
    name: string
    phone: string
    address: string
    city: string
    province: string
    postal_code: string
  }
  created_at: string
  updated_at: string
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

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({
    status: "all",
    payment_status: "all",
    search: "",
    startDate: "",
    endDate: ""
  })

  const fetchOrders = async (page = 1) => {
    try {
      setLoading(true)
      const params = {
        page,
        limit: 20,
        ...(filters.status !== "all" && { status: filters.status }),
        ...(filters.payment_status !== "all" && { payment_status: filters.payment_status }),
        ...(filters.search && { search: filters.search }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
      }
      
      const response = await getOrders(params)
      setOrders(response.data || [])
      setTotalPages(response.last_page || 1)
      setCurrentPage(response.current_page || page)
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast({
        title: "Error",
        description: "Failed to fetch orders. Please check if you're logged in as admin.",
        variant: "destructive",
      })
      setOrders([])
      setTotalPages(1)
      setCurrentPage(1)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders(1)
  }, [filters])

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus)
      setOrders(prev => prev.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus as Order['status'] }
          : order
      ))
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
    }
  }

  const handleExport = async (format: 'csv' | 'excel') => {
    try {
      const blob = await exportOrders(format, {
        ...(filters.status !== "all" && { status: filters.status }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
      })
      
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `orders.${format === 'excel' ? 'xlsx' : 'csv'}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      toast({
        title: "Export successful",
        description: `Orders exported as ${format.toUpperCase()}`,
      })
    } catch (error) {
      console.error('Error exporting orders:', error)
      toast({
        title: "Error",
        description: "Failed to export orders",
        variant: "destructive",
      })
    }
  }

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: "order_number",
      header: "Order Number",
      cell: ({ row }) => (
        <div className="font-medium text-blue-400">
          #{row.getValue("order_number")}
        </div>
      ),
    },
    {
      accessorKey: "customer",
      header: "Customer",
      cell: ({ row }) => {
        const customer = row.getValue("customer") as Order['customer']
        return (
          <div>
            <div className="font-medium text-white">{customer.name}</div>
            <div className="text-sm text-gray-400">{customer.email}</div>
          </div>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Order Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as Order['status']
        const config = statusConfig[status]
        const Icon = config.icon
        return (
          <Badge className={`${config.color} text-white hover:${config.color}/80`}>
            <Icon className="w-3 h-3 mr-1" />
            {config.label}
          </Badge>
        )
      },
    },
    {
      accessorKey: "payment_status",
      header: "Payment",
      cell: ({ row }) => {
        const status = row.getValue("payment_status") as Order['payment_status']
        const config = paymentStatusConfig[status]
        return (
          <Badge className={`${config.color} text-white hover:${config.color}/80`}>
            {config.label}
          </Badge>
        )
      },
    },
    {
      accessorKey: "total_amount",
      header: "Total",
      cell: ({ row }) => (
        <div className="font-medium text-white">
          {formatPrice(Number(row.getValue("total_amount")))}
        </div>
      ),
    },
    {
      accessorKey: "items_count",
      header: "Items",
      cell: ({ row }) => (
        <div className="text-center">
          {row.getValue("items_count")} items
        </div>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Date",
      cell: ({ row }) => (
        <div className="text-sm">
          {formatDate(row.getValue("created_at"))}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const order = row.original
        return (
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => router.push(`/admin/orders/${order.id}`)}
              className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Select
              value={order.status}
              onValueChange={(value) => handleStatusUpdate(order.id, value)}
            >
              <SelectTrigger className="w-32 bg-slate-600 border-slate-500">
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
        )
      },
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Order Management</h1>
          <p className="text-gray-400">Manage customer orders and shipments</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => handleExport('csv')}
            className="border-green-500 text-green-400 hover:bg-green-500 hover:text-white"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            onClick={() => handleExport('excel')}
            className="border-green-500 text-green-400 hover:bg-green-500 hover:text-white"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-slate-700 border-slate-600">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <Label className="text-gray-300">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Order number, customer..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10 bg-slate-600 border-slate-500 text-white"
                />
              </div>
            </div>
            <div>
              <Label className="text-gray-300">Order Status</Label>
              <Select
                value={filters.status}
                onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-gray-300">Status Pembayaran</Label>
              <Select
                value={filters.payment_status}
                onValueChange={(value) => setFilters(prev => ({ ...prev, payment_status: value }))}
              >
                <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payment</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-gray-300">Start Date</Label>
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                className="bg-slate-600 border-slate-500 text-white"
              />
            </div>
            <div>
              <Label className="text-gray-300">End Date</Label>
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                className="bg-slate-600 border-slate-500 text-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className="bg-slate-700 border-slate-600">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : (
            <>
              <DataTable
                columns={columns}
                data={orders}
                searchKey="order_number"
                searchPlaceholder="Search orders..."
              />
              
              {/* Custom Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-slate-600">
                  <div className="text-sm text-gray-400">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchOrders(currentPage - 1)}
                      disabled={currentPage <= 1}
                      className="border-slate-500 text-slate-300 hover:bg-slate-600"
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchOrders(currentPage + 1)}
                      disabled={currentPage >= totalPages}
                      className="border-slate-500 text-slate-300 hover:bg-slate-600"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
