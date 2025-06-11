import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, ShoppingCart, Package, BarChart3, TrendingUp } from "lucide-react"

const adminStats = [
  { title: "Total Produk", value: "156", icon: Package, color: "bg-blue-600" },
  { title: "Total Pelanggan", value: "1,234", icon: Users, color: "bg-green-600" },
  { title: "Penjualan Hari Ini", value: "Rp 2.5M", icon: TrendingUp, color: "bg-yellow-600" },
  { title: "Pesanan Pending", value: "23", icon: ShoppingCart, color: "bg-red-600" },
]

const quickActions = [
  { title: "Kelola Produk", href: "/admin/products", icon: Package, description: "Tambah, edit, atau hapus produk" },
  { title: "Kelola Pelanggan", href: "/admin/customers", icon: Users, description: "Lihat dan kelola data pelanggan" },
  { title: "Data Penjualan", href: "/admin/sales", icon: ShoppingCart, description: "Monitor transaksi penjualan" },
  { title: "Laporan", href: "/admin/reports", icon: BarChart3, description: "Lihat laporan penjualan" },
]

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-red-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xl">26</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-gray-400">26 Store Pekanbaru</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-white text-sm">Hi, Admin!</span>
            <div className="w-8 h-8 bg-gray-400 rounded-full"></div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {adminStats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.title} className="bg-slate-700 border-slate-600">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
                      <p className="text-white text-2xl font-bold">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Quick Actions */}
        <Card className="bg-slate-700 border-slate-600 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Aksi Cepat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action) => {
                const Icon = action.icon
                return (
                  <Link key={action.title} href={action.href}>
                    <Card className="bg-slate-600 border-slate-500 hover:bg-slate-500 transition-colors cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3 mb-2">
                          <Icon className="h-5 w-5 text-blue-400" />
                          <h3 className="text-white font-semibold">{action.title}</h3>
                        </div>
                        <p className="text-gray-400 text-sm">{action.description}</p>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-slate-700 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white">Pesanan Terbaru</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { id: "ORD-001", customer: "John Doe", amount: "Rp 500.000", status: "Pending" },
                  { id: "ORD-002", customer: "Jane Smith", amount: "Rp 350.000", status: "Diproses" },
                  { id: "ORD-003", customer: "Bob Wilson", amount: "Rp 750.000", status: "Dikirim" },
                ].map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-slate-600 rounded-lg">
                    <div>
                      <p className="text-white font-medium">{order.id}</p>
                      <p className="text-gray-400 text-sm">{order.customer}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-semibold">{order.amount}</p>
                      <p className="text-blue-400 text-sm">{order.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-700 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white">Produk Terlaris</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Sepatu Futsal Specs", sold: 45, stock: 15 },
                  { name: "Sepatu Bola Ortuseight", sold: 32, stock: 8 },
                  { name: "Jersey Sport", sold: 28, stock: 22 },
                ].map((product, index) => (
                  <div key={product.name} className="flex items-center justify-between p-3 bg-slate-600 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-blue-400 font-bold">#{index + 1}</span>
                      <div>
                        <p className="text-white font-medium">{product.name}</p>
                        <p className="text-gray-400 text-sm">Stok: {product.stock}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 font-semibold">{product.sold} terjual</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Access Customer Portal */}
        <div className="mt-8 text-center">
          <Card className="bg-slate-700 border-slate-600 inline-block">
            <CardContent className="p-6">
              <h3 className="text-white font-semibold mb-2">Lihat Portal Pelanggan</h3>
              <p className="text-gray-400 mb-4">Akses tampilan yang dilihat pelanggan</p>
              <Link href="/">
                <Button className="bg-green-600 hover:bg-green-700">Buka Portal Pelanggan</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
