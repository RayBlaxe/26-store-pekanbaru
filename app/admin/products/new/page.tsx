"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { ProductForm } from "@/components/admin/product-form"
import { ArrowLeft } from "lucide-react"
import { createProduct } from "@/services/admin.service"
import { toast } from "@/hooks/use-toast"

export default function NewProductPage() {
  const router = useRouter()

  const handleSubmit = async (data: any) => {
    try {
      const response = await createProduct(data)
      toast({
        title: "Product created",
        description: "The product has been successfully created.",
      })
      router.push('/admin/products')
    } catch (error) {
      console.error('Error creating product:', error)
      toast({
        title: "Error",
        description: "Failed to create product. Please try again.",
        variant: "destructive",
      })
      throw error
    }
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
            <h1 className="text-3xl font-bold">Add New Product</h1>
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
                <BreadcrumbPage>New Product</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Form */}
      <ProductForm onSubmit={handleSubmit} />
    </div>
  )
}