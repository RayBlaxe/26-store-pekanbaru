"use client"

import CustomerLayout from "@/components/customer-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { ShoppingCart, Star } from "lucide-react"

const products = [
  {
    id: 1,
    name: "Sepatu X",
    price: "Rp. 500.000",
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.5,
    inStock: true,
  },
  {
    id: 2,
    name: "Sepatu X",
    price: "Rp. 500.000",
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.3,
    inStock: true,
  },
  {
    id: 3,
    name: "Sepatu X",
    price: "Rp. 500.000",
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.7,
    inStock: true,
  },
]

export default function ProductsPage() {
  return (
    <CustomerLayout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <div className="relative h-96 bg-gradient-to-r from-slate-900 to-slate-700">
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 flex items-center justify-center h-full">
            <div className="text-center text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">LIFE IS ABOUT TIMING</h1>
              <p className="text-xl md:text-2xl">Temukan koleksi sepatu terbaik untuk gaya hidup aktif Anda</p>
            </div>
          </div>
          {/* Product images in header */}
          <div className="absolute top-4 left-4 right-4 flex justify-between opacity-50">
            <div className="w-20 h-20 bg-slate-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs">Sepatu 1</span>
            </div>
            <div className="w-20 h-20 bg-slate-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs">Sepatu 2</span>
            </div>
            <div className="w-20 h-20 bg-slate-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs">Sepatu 3</span>
            </div>
            <div className="w-20 h-20 bg-slate-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs">Sepatu 4</span>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Koleksi Mengagumkan Sepatu Produk Hit</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="bg-slate-700 border-slate-600 overflow-hidden">
                <div className="aspect-square relative bg-black rounded-t-lg">
                  <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                </div>
                <CardContent className="p-4">
                  <h3 className="text-white font-semibold text-lg mb-2">{product.name}</h3>
                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-400"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-gray-400 text-sm ml-2">({product.rating})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white font-bold text-lg">{product.price}</span>
                    {product.inStock && <Badge className="bg-green-600 text-white">Tersedia</Badge>}
                  </div>
                  <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Masukkan Keranjang
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </CustomerLayout>
  )
}
