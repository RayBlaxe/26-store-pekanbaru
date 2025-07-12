'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft, Star, ShoppingCart, Heart, Share2, Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useCartStore } from '@/stores/cart.store'
import { useAuthStore } from '@/stores/auth-store'
import { productService } from '@/services/product.service'
import { formatPrice } from '@/lib/utils'

export default function ProductDetailPage() {
  const params = useParams()
  const productId = parseInt(params.id as string)
  
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  
  const { addToCart } = useCartStore()
  const { isAuthenticated } = useAuthStore()

  const { data: productData, isLoading, error } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => productService.getProduct(productId),
    enabled: !!productId,
  })

  const product = productData?.data

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      window.location.href = '/login'
      return
    }

    if (!product) return

    try {
      setIsAddingToCart(true)
      await addToCart({
        product_id: product.id,
        quantity
      })
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 1)) {
      setQuantity(newQuantity)
    }
  }

  const handleGoBack = () => {
    window.history.back()
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-32 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-square bg-gray-200 rounded-lg"></div>
            <div className="space-y-6">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={handleGoBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={handleGoBack}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Products
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg border">
            <Image
              src={product.image || '/placeholder.jpg'}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Badge variant="secondary" className="text-lg">
                  Out of Stock
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            {product.category && (
              <Badge variant="outline" className="mb-4">
                {product.category.name}
              </Badge>
            )}
            
            {product.rating && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating!)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating.toFixed(1)} out of 5
                </span>
              </div>
            )}
          </div>

          <div>
            <p className="text-3xl font-bold text-primary mb-2">
              {formatPrice(product.price)}
            </p>
            <p className="text-sm text-muted-foreground">
              Stock: {product.stock} available
            </p>
          </div>

          {product.description && (
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          <Separator />

          {/* Quantity Selector */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="font-medium">Quantity:</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || isAddingToCart}
                className="w-full"
                size="lg"
              >
                {isAddingToCart ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Adding to Cart...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                  </div>
                )}
              </Button>

              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="flex-1">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="flex-1">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Product Info */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>Product ID:</span>
              <span className="font-medium">{product.id}</span>
            </div>
            <div className="flex justify-between">
              <span>Category:</span>
              <span className="font-medium">{product.category?.name || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span>Stock:</span>
              <span className="font-medium">{product.stock} units</span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <Badge variant={product.stock > 0 ? "default" : "secondary"}>
                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Shipping & Returns</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>✓ Free shipping on orders over IDR 500,000</p>
            <p>✓ 30-day return policy</p>
            <p>✓ 1-year warranty included</p>
            <p>✓ Secure payment processing</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}