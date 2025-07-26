"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CalendarDays, TrendingUp, DollarSign, ShoppingCart, Package, Users, Download, FileText } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { formatPrice, formatDate } from "@/lib/utils"

// Mock data - replace with actual API calls
interface SalesMetrics {
  totalRevenue: number
  totalOrders: number
  totalProducts: number
  totalCustomers: number
  avgOrderValue: number
  revenueGrowth: number
  ordersGrowth: number
  topSellingProducts: Array<{
    id: string
    name: string
    soldQty: number
    revenue: number
  }>
  recentOrders: Array<{
    id: string
    orderNumber: string
    customer: string
    total: number
    status: string
    date: string
  }>
  monthlyRevenue: Array<{
    month: string
    revenue: number
    orders: number
  }>
}

export default function ReportsPage() {
  const [metrics, setMetrics] = useState<SalesMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState("30days")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  // Mock data
  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true)
      // Simulate API call
      setTimeout(() => {
        setMetrics({
          totalRevenue: 15750000,
          totalOrders: 127,
          totalProducts: 45,
          totalCustomers: 89,
          avgOrderValue: 124015,
          revenueGrowth: 23.5,
          ordersGrowth: 12.8,
          topSellingProducts: [
            { id: "1", name: "Nike Air Max 270", soldQty: 24, revenue: 4800000 },
            { id: "2", name: "Adidas Ultraboost 22", soldQty: 18, revenue: 3600000 },
            { id: "3", name: "Converse Chuck Taylor", soldQty: 15, revenue: 1350000 },
            { id: "4", name: "Vans Old Skool", soldQty: 12, revenue: 1440000 },
            { id: "5", name: "Puma RS-X", soldQty: 10, revenue: 1500000 },
          ],
          recentOrders: [
            { id: "1", orderNumber: "ORD-2024-001", customer: "John Doe", total: 450000, status: "delivered", date: "2024-01-15" },
            { id: "2", orderNumber: "ORD-2024-002", customer: "Jane Smith", total: 320000, status: "shipped", date: "2024-01-14" },
            { id: "3", orderNumber: "ORD-2024-003", customer: "Bob Wilson", total: 180000, status: "processing", date: "2024-01-13" },
            { id: "4", orderNumber: "ORD-2024-004", customer: "Alice Brown", total: 275000, status: "delivered", date: "2024-01-12" },
            { id: "5", orderNumber: "ORD-2024-005", customer: "Mike Johnson", total: 390000, status: "cancelled", date: "2024-01-11" },
          ],
          monthlyRevenue: [
            { month: "Jan", revenue: 2500000, orders: 45 },
            { month: "Feb", revenue: 2800000, orders: 52 },
            { month: "Mar", revenue: 3200000, orders: 48 },
            { month: "Apr", revenue: 2900000, orders: 51 },
            { month: "May", revenue: 3400000, orders: 67 },
            { month: "Jun", revenue: 3100000, orders: 58 },
          ]
        })
        setLoading(false)
      }, 1000)
    }

    fetchReports()
  }, [dateRange, startDate, endDate])

  const handleExport = (type: 'pdf' | 'excel') => {
    // Mock export functionality
    toast({
      title: "Export Started",
      description: `Generating ${type.toUpperCase()} report...`,
    })
    
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: `Report has been downloaded as ${type.toUpperCase()}`,
      })
    }, 2000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!metrics) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-white mb-4">No Data Available</h2>
        <p className="text-gray-400">Unable to load report data</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Sales Reports & Analytics</h1>
          <p className="text-gray-400">Comprehensive business insights and performance metrics</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => handleExport('excel')}
            className="border-green-500 text-green-400 hover:bg-green-500 hover:text-white"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
          <Button
            variant="outline"
            onClick={() => handleExport('pdf')}
            className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
          >
            <FileText className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Date Range Filter */}
      <Card className="bg-slate-700 border-slate-600">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <CalendarDays className="h-5 w-5 mr-2" />
            Report Period
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-gray-300">Period</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 Days</SelectItem>
                  <SelectItem value="30days">Last 30 Days</SelectItem>
                  <SelectItem value="90days">Last 90 Days</SelectItem>
                  <SelectItem value="6months">Last 6 Months</SelectItem>
                  <SelectItem value="1year">Last Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {dateRange === "custom" && (
              <>
                <div>
                  <Label className="text-gray-300">Start Date</Label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="bg-slate-600 border-slate-500 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">End Date</Label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="bg-slate-600 border-slate-500 text-white"
                  />
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-700 border-slate-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Revenue</p>
                <p className="text-2xl font-bold text-white">{formatPrice(metrics.totalRevenue)}</p>
                <p className="text-green-400 text-sm">+{metrics.revenueGrowth}% from last period</p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-full">
                <DollarSign className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-700 border-slate-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Orders</p>
                <p className="text-2xl font-bold text-white">{metrics.totalOrders}</p>
                <p className="text-blue-400 text-sm">+{metrics.ordersGrowth}% from last period</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-full">
                <ShoppingCart className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-700 border-slate-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Avg Order Value</p>
                <p className="text-2xl font-bold text-white">{formatPrice(metrics.avgOrderValue)}</p>
                <p className="text-purple-400 text-sm">Per order average</p>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-full">
                <TrendingUp className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-700 border-slate-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Customers</p>
                <p className="text-2xl font-bold text-white">{metrics.totalCustomers}</p>
                <p className="text-orange-400 text-sm">Active customers</p>
              </div>
              <div className="p-3 bg-orange-500/20 rounded-full">
                <Users className="h-6 w-6 text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Products */}
        <Card className="bg-slate-700 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Top Selling Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics.topSellingProducts.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-slate-600 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-white font-medium">{product.name}</p>
                      <p className="text-gray-400 text-sm">{product.soldQty} units sold</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">{formatPrice(product.revenue)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card className="bg-slate-700 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-slate-600 rounded-lg">
                  <div>
                    <p className="text-white font-medium">#{order.orderNumber}</p>
                    <p className="text-gray-400 text-sm">{order.customer}</p>
                    <p className="text-gray-400 text-xs">{formatDate(order.date)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">{formatPrice(order.total)}</p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === 'delivered' ? 'bg-green-500/20 text-green-400' :
                      order.status === 'shipped' ? 'bg-blue-500/20 text-blue-400' :
                      order.status === 'processing' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Revenue Chart */}
      <Card className="bg-slate-700 border-slate-600">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Monthly Revenue Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            {metrics.monthlyRevenue.map((month) => (
              <div key={month.month} className="text-center">
                <div className="bg-slate-600 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">{month.month}</p>
                  <p className="text-white font-bold text-lg">{formatPrice(month.revenue)}</p>
                  <p className="text-gray-400 text-xs">{month.orders} orders</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
