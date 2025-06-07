import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-800 flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex items-center justify-center space-x-3 mb-8">
          <div className="w-12 h-12 bg-red-600 rounded flex items-center justify-center">
            <span className="text-white font-bold text-xl">26</span>
          </div>
          <h1 className="text-4xl font-bold text-white">STORE PEKANBARU</h1>
        </div>

        <p className="text-xl text-gray-300 mb-12">Platform E-Commerce untuk Produk Olahraga Terbaik</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Admin Access */}
          <Card className="bg-slate-700 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Admin Panel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">Kelola produk, pelanggan, dan transaksi dengan mudah</p>
              <div className="space-y-2">
                <Link href="/admin/products" className="block">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">Masuk sebagai Admin</Button>
                </Link>
                <div className="text-sm text-gray-400">Fitur: Manajemen Produk, Pelanggan, Laporan Penjualan</div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Access */}
          <Card className="bg-slate-700 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Customer Portal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">Belanja produk olahraga berkualitas dengan mudah</p>
              <div className="space-y-2">
                <Link href="/products" className="block">
                  <Button className="w-full bg-green-600 hover:bg-green-700">Mulai Belanja</Button>
                </Link>
                <div className="text-sm text-gray-400">Fitur: Katalog Produk, Keranjang, Checkout, Tracking</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-gray-400 text-sm">
          <p>© 2024 26 Store Pekanbaru. Platform E-Commerce Next.js & Laravel.</p>
        </div>
      </div>
    </div>
  )
}
