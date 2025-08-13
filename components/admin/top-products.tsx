"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { formatPriceCompact } from "@/lib/utils"

interface Product {
  id: string
  name: string
  sku: string
  image: string | null
  total_sold: number
  total_revenue: number
  current_stock: number
}

interface TopProductsProps {
  products: Product[]
  loading?: boolean
}

export function TopProducts({ products, loading }: TopProductsProps) {
  if (loading) {
    return (
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Produk Teratas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                </div>
                <div className="text-right space-y-2">
                  <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 w-12 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="col-span-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Produk Teratas</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/products">
            Lihat semua
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">Belum ada data produk</p>
          ) : (
            products.map((product, index) => (
              <div key={product.id} className="flex items-center space-x-4">
                <div className="relative w-12 h-12">
                  <Image
                    src={product.image || '/placeholder.jpg'}
                    alt={product.name}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <div className="flex-1">
                  <Link 
                    href={`/admin/products/${product.id}/edit`}
                    className="font-medium hover:underline line-clamp-1"
                  >
                    {product.name}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    Stok: {product.current_stock} unit
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-primary">#{index + 1}</span>
                  </div>
                  <p className="font-medium">
                    {product.total_sold} terjual
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatPriceCompact(product.total_revenue)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
