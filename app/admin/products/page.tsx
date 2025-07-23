"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DataTable } from "@/components/admin/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Plus, Edit, Trash2, Eye, Package, AlertTriangle, Filter } from "lucide-react"
import { getProducts, deleteProduct, bulkDeleteProducts } from "@/services/admin.service"
import { toast } from "@/hooks/use-toast"

interface Product {
  id: string
  name: string
  price: number
  stock: number
  category: {
    id: string
    name: string
    slug: string
    description?: string
    image?: string
    is_active: boolean
    created_at: string
    updated_at: string
  } | string // Support both object and string format
  brand?: string
  images: string[]
  isActive?: boolean
  is_active?: boolean // Laravel snake_case format
  sku?: string
  createdAt: string
  created_at?: string // Laravel snake_case format
}

export default function ProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    category: "all",
    inStock: "all"
  })

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await getProducts({
        category: filters.category !== "all" ? filters.category : undefined,
        inStock: filters.inStock !== "all" ? filters.inStock === "true" : undefined
      })
      console.log('API Response:', response) // Debug log
      setProducts(response.data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
      toast({
        title: "Error",
        description: "Failed to fetch products. Please check if the backend is running.",
        variant: "destructive",
      })
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [filters])

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id)
      setProducts(prev => prev.filter(p => p.id !== id))
      toast({
        title: "Product deleted",
        description: "The product has been successfully deleted.",
      })
    } catch (error) {
      console.error('Error deleting product:', error)
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDeleteDialogOpen(false)
      setProductToDelete(null)
    }
  }

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "images",
      header: "Image",
      cell: ({ row }) => {
        const product = row.original
        const images = Array.isArray(product.images) ? product.images : []
        const imageUrl = images.length > 0 ? images[0] : '/placeholder.jpg'
        return (
          <div className="relative w-12 h-12">
            <Image
              src={imageUrl}
              alt={product.name || 'Product image'}
              fill
              className="object-cover rounded"
            />
          </div>
        )
      },
    },
    {
      accessorKey: "name",
      header: "Product Name",
      cell: ({ row }) => {
        const name = row.getValue("name") as string
        const sku = row.original.sku
        return (
          <div>
            <div className="font-medium">{name}</div>
            {sku && <div className="text-sm text-muted-foreground">SKU: {sku}</div>}
          </div>
        )
      },
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => {
        const category = row.getValue("category") as Product["category"]
        const categoryName = typeof category === 'string' ? category : category?.name || 'No Category'
        return <Badge variant="outline">{categoryName}</Badge>
      },
    },
    {
      accessorKey: "brand",
      header: "Brand",
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => {
        const price = row.getValue("price") as number
        return <div className="font-medium">Rp {price.toLocaleString('id-ID')}</div>
      },
    },
    {
      accessorKey: "stock",
      header: "Stock",
      cell: ({ row }) => {
        const stock = row.getValue("stock") as number
        return (
          <div className="flex items-center gap-2">
            <span className={stock <= 10 ? "text-orange-600 font-medium" : ""}>{stock}</span>
            {stock <= 10 && <AlertTriangle className="h-4 w-4 text-orange-500" />}
          </div>
        )
      },
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => {
        const product = row.original
        const isActive = product.isActive ?? product.is_active ?? false
        return (
          <Badge variant={isActive ? "default" : "secondary"}>
            {isActive ? "Active" : "Inactive"}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const product = row.original
        return (
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" asChild>
              <Link href={`/admin/products/${product.id}`}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <Link href={`/admin/products/${product.id}/edit`}>
                <Edit className="h-4 w-4" />
              </Link>
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => {
                setProductToDelete(product.id)
                setDeleteDialogOpen(true)
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]

  const lowStockCount = products.filter(p => p.stock <= 10).length
  const activeProductsCount = products.filter(p => p.isActive ?? p.is_active ?? false).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">Manage your product inventory</p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProductsCount}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{lowStockCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Sepatu">Sepatu</SelectItem>
                <SelectItem value="Baju">Baju</SelectItem>
                <SelectItem value="Celana">Celana</SelectItem>
                <SelectItem value="Aksesoris">Aksesoris</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filters.inStock} onValueChange={(value) => setFilters(prev => ({ ...prev, inStock: value }))}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Stock Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                <SelectItem value="true">In Stock</SelectItem>
                <SelectItem value="false">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Products</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <DataTable 
              columns={columns} 
              data={products}
              searchKey="name"
              searchPlaceholder="Search products..."
            />
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product from your inventory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => productToDelete && handleDelete(productToDelete)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
