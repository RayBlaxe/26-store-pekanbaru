import { useState } from 'react'
import Image from 'next/image'
import { Star, ShoppingCart, Heart } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCartStore } from '@/stores/cart.store'
import { useAuthStore } from '@/stores/auth-store'
import { Product } from '@/types/product'
import { formatPrice } from '@/lib/utils'

interface ProductCardProps {
  product: Product
  onViewDetails?: (product: Product) => void
}

export function ProductCard({ product, onViewDetails }: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { addToCart } = useCartStore()
  const { isAuthenticated } = useAuthStore()

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      window.location.href = '/login'
      return
    }

    try {
      setIsLoading(true)
      await addToCart({
        product_id: product.id,
        quantity: 1
      })
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(product)
    } else {
      window.location.href = `/products/${product.id}`
    }
  }

  // Get the first image from the images array, fallback to image property or placeholder
  const getProductImage = () => {
    if (product.images && product.images.length > 0) {
      return product.images[0]
    }
    return product.image || '/placeholder.jpg'
  }

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-0">
        <div className="relative aspect-square overflow-hidden rounded-t-lg">
          <Image
            src={getProductImage()}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-200 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="secondary">Out of Stock</Badge>
            </div>
          )}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-white/90 hover:bg-white"
            >
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="p-4">
          <h3 
            className="font-medium text-sm mb-1 line-clamp-2 cursor-pointer hover:text-primary"
            onClick={handleViewDetails}
          >
            {product.name}
          </h3>
          
          {product.category && (
            <p className="text-xs text-muted-foreground mb-2">
              {product.category.name}
            </p>
          )}
          
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-lg">
              {product.formatted_price || formatPrice(parseFloat(product.price))}
            </span>
            
            {product.rating && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm text-muted-foreground">
                  {product.rating.toFixed(1)}
                </span>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
            <span>Stock: {product.stock}</span>
            {product.stock > 0 && (
              <Badge variant="outline" className="text-green-600">
                Available
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={handleAddToCart}
          disabled={product.stock === 0 || isLoading}
          className="w-full"
          size="sm"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Adding...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </div>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}