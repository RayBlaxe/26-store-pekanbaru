"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { ProductForm } from "@/components/admin/product-form"
import { ArrowLeft } from "lucide-react"
import { getProduct, updateProduct } from "@/services/admin.service"
import { toast } from "@/hooks/use-toast"

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProduct(params.id as string)
        setProduct(response.data)
      } catch (error) {
        console.error('Error fetching product:', error)
        // Set mock data for development
        setProduct({
          id: params.id,
          name: 'Sepatu Futsal Specs Metasala',
          description: 'Sepatu futsal berkualitas tinggi dengan teknologi terdepan',
          price: 500000,
          comparePrice: 600000,
          sku: 'SPU-001',
          stock: 50,
          category: '1',
          brand: 'Specs',
          weight: 0.8,
          dimensions: {
            length: 30,
            width: 20,
            height: 12,
          },
          isActive: true,
          isFeatured: false,
          tags: 'sepatu, futsal, olahraga, specs',
          images: ['/placeholder.jpg'],
        })
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchProduct()
    }
  }, [params.id])

  const handleSubmit = async (data: any) => {
    try {
      const response = await updateProduct(params.id as string, data)
      toast({
        title: "Product updated",
        description: "The product has been successfully updated.",
      })
      router.push('/admin/products')
    } catch (error) {
      console.error('Error updating product:', error)
      toast({
        title: "Error",
        description: "Failed to update product. Please try again.",
        variant: "destructive",
      })
      throw error
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/products">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/products">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <h1 className="text-3xl font-bold">Product Not Found</h1>
            </div>
          </div>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <p>The product you're looking for doesn't exist.</p>
            <Button asChild className="mt-4">
              <Link href="/admin/products">Back to Products</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/products">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-3xl font-bold">Edit Product</h1>
          </div>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin/products">Products</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Edit {product.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Form */}
      <ProductForm initialData={product} onSubmit={handleSubmit} />
    </div>
  )
}