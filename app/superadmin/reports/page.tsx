"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CalendarDays, TrendingUp, DollarSign, ShoppingCart, Package, Users, Download, FileText } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { getSalesReport } from "@/services/admin.service"
import { exportToPDF, exportToExcel } from "@/lib/export-utils"

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

  const fetchReports = async () => {
    try {
      setLoading(true)
      const params: any = { period: dateRange }
      
      if (dateRange === "custom" && startDate && endDate) {
        params.start_date = startDate
        params.end_date = endDate
      }

      const response = await getSalesReport(params)
      setMetrics(response)
    } catch (error) {
      console.error('Error fetching reports:', error)
      toast({
        title: "Error",
        description: "Failed to fetch report data. Please check if the backend is running.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReports()
  }, [dateRange, startDate, endDate])

  const handleExport = async (type: 'pdf' | 'excel') => {
    if (!metrics) {
      toast({
        title: "Error",
        description: "No data available to export.",
        variant: "destructive",
      })
      return
    }

    try {
      toast({
        title: "Export Started",
        description: `Generating ${type.toUpperCase()} report...`,
      })

      const periodText = dateRange === "custom" && startDate && endDate
        ? `${startDate} to ${endDate}`
        : dateRange.replace(/(\d+)(\w+)/, '$1 $2').replace(/days?|months?|year/, match => match + (match.endsWith('s') ? '' : 's'))

      if (type === 'pdf') {
        exportToPDF(metrics, periodText)
      } else {
        exportToExcel(metrics, periodText)
      }

      toast({
        title: "Export Complete",
        description: `Report has been downloaded as ${type.toUpperCase()}`,
      })
    } catch (error) {
      console.error('Export error:', error)
      toast({
        title: "Export Failed",
        description: "Failed to generate report. Please try again.",
        variant: "destructive",
      })
    }
  }
            </Card>

            {/* Order Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Order Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={report.order_status_distribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ status, count }) => `${status}: ${count}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {report.order_status_distribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Category Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Category Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={report.category_performance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category_name" />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <Tooltip formatter={(value: number) => [formatCurrency(value), 'Revenue']} />
                    <Bar dataKey="total_revenue" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle>Sales by Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={report.sales_by_payment_method}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="method" />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <Tooltip formatter={(value: number) => [formatCurrency(value), 'Revenue']} />
                    <Bar dataKey="revenue" fill="#22c55e" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Top Customers Table */}
          <Card>
            <CardHeader>
              <CardTitle>Top Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Customer</th>
                      <th className="text-left p-2">Email</th>
                      <th className="text-right p-2">Orders</th>
                      <th className="text-right p-2">Total Spent</th>
                      <th className="text-right p-2">Avg Order Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.top_customers.map((customer) => (
                      <tr key={customer.id} className="border-b">
                        <td className="p-2 font-medium">{customer.name}</td>
                        <td className="p-2 text-gray-600">{customer.email}</td>
                        <td className="p-2 text-right">{customer.order_count}</td>
                        <td className="p-2 text-right font-medium">{formatCurrency(customer.total_spent)}</td>
                        <td className="p-2 text-right">{formatCurrency(customer.avg_order_value)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
