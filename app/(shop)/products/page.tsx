'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { ProductGrid } from '@/components/products/product-grid'
import { ProductFilters } from '@/components/products/product-filters'
import { Button } from '@/components/ui/button'
import { useProductStore } from '@/stores/product.store'
import { productService } from '@/services/product.service'
import { Product } from '@/types/product'
import CustomerLayout from '@/components/customer-layout'

export default function ProductsPage() {
  const { 
    filters, 
    setCurrentPage,
    resetPagination 
  } = useProductStore()
  
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [hasNextPage, setHasNextPage] = useState(true)

  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => productService.getCategories(),
  })

  const { 
    data: productsData, 
    isLoading: productsLoading, 
    refetch: refetchProducts 
  } = useQuery({
    queryKey: ['products', filters],
    queryFn: () => productService.getProducts(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  useEffect(() => {
    if (productsData) {
      if (filters.page === 1) {
        setAllProducts(productsData.data)
      } else {
        setAllProducts(prev => [...prev, ...productsData.data])
      }
      setHasNextPage(productsData.current_page < productsData.last_page)
    }
  }, [productsData, filters.page])

  const handleFilterChange = () => {
    resetPagination()
    setAllProducts([])
    refetchProducts()
  }

  const handleLoadMore = () => {
    if (hasNextPage && !productsLoading) {
      setCurrentPage(filters.page! + 1)
    }
  }

  const handleProductClick = (product: Product) => {
    window.location.href = `/products/${product.id}`
  }

  return (
    <CustomerLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Products</h1>
          <p className="text-muted-foreground">
            Discover our collection of quality sports equipment
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <div className="sticky top-4">
              <ProductFilters
                categories={categoriesData?.data || []}
                isLoading={categoriesLoading}
                onFilterChange={handleFilterChange}
              />
            </div>
          </aside>

          <main className="lg:col-span-3">
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {productsData?.total 
                    ? `${productsData.total} products found`
                    : 'Loading products...'
                  }
                </p>
                
                {filters.page === 1 && (
                  <p className="text-sm text-muted-foreground">
                    Page {productsData?.current_page || 1} of {productsData?.last_page || 1}
                  </p>
                )}
              </div>
            </div>

            <ProductGrid
              products={allProducts}
              isLoading={productsLoading && filters.page === 1}
              onViewDetails={handleProductClick}
            />

            {/* Load More Button */}
            {hasNextPage && allProducts.length > 0 && (
              <div className="flex justify-center mt-8">
                <Button
                  onClick={handleLoadMore}
                  disabled={productsLoading}
                  size="lg"
                  className="min-w-32"
                >
                  {productsLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading...
                    </div>
                  ) : (
                    'Load More'
                  )}
                </Button>
              </div>
            )}

            {/* No more products message */}
            {!hasNextPage && allProducts.length > 0 && (
              <div className="text-center mt-8 py-4 text-muted-foreground">
                <p>You've reached the end of our product catalog</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </CustomerLayout>
  )
}