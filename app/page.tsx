"use client"

import CustomerLayout from "@/components/customer-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { ShoppingCart, Star, ArrowRight } from "lucide-react"
import { useQuery } from '@tanstack/react-query'
import { productService } from '@/services/product.service'
import { useCartStore } from '@/stores/cart.store'
import { formatPrice } from '@/lib/utils'
import { toast } from 'sonner'
import Link from 'next/link'

export default function HomePage() {
  const { addProductToCart } = useCartStore()
  
  // Fetch featured products (limit to 6 for homepage)
  const { data: productsData, isLoading, error } = useQuery({
    queryKey: ['homepage-products'],
    queryFn: () => productService.getProducts({ page: 1, per_page: 6 }),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })

  const handleAddToCart = async (product: any) => {
    try {
      await addProductToCart(product.id, 1)
    } catch (error) {
      // Error handling is already done in the store
    }
  }

  // Get the first image from the images array, fallback to image property or placeholder
  const getProductImage = (product: any) => {
    if (product.images && product.images.length > 0) {
      return product.images[0]
    }
    return product.image || '/placeholder.jpg'
  }

  const products = productsData?.data || []

  return (
    <CustomerLayout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <div className="relative h-96 bg-gradient-to-r from-background to-secondary">
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative z-10 flex items-center justify-center h-full">
            <div className="text-center text-foreground">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">LIFE IS ABOUT TIMING</h1>
              <p className="text-xl md:text-2xl">Temukan koleksi sepatu terbaik untuk gaya hidup aktif Anda</p>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">Koleksi Produk Terbaru</h2>
            <Link href="/products">
              <Button variant="outline" className="flex items-center gap-2">
                Lihat Semua Produk
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden animate-pulse">
                  <div className="aspect-square bg-gray-200" />
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Gagal memuat produk. Silakan coba lagi nanti.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-square relative bg-gray-100">
                    <Image 
                      src={getProductImage(product)} 
                      alt={product.name} 
                      fill 
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-1">{product.name}</h3>
                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(product.rating || 0) ? "text-yellow-400 fill-current" : "text-gray-400"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-gray-500 text-sm ml-2">({product.rating || 0})</span>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-lg">{product.formatted_price || formatPrice(parseFloat(product.price))}</span>
                      {product.stock > 0 && <Badge className="bg-green-600 text-white">Tersedia</Badge>}
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/products/${product.id}`} className="flex-1">
                        <Button variant="outline" className="w-full">
                          Lihat Detail
                        </Button>
                      </Link>
                      <Button 
                        className="flex-1 bg-primary hover:bg-primary/90"
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock === 0}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </CustomerLayout>
  )
}
