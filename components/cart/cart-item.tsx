import { useState } from 'react'
import Image from 'next/image'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CartItem as CartItemType } from '@/types/product'
import { useCartStore } from '@/stores/cart.store'
import { formatPrice } from '@/lib/utils'

interface CartItemProps {
  item: CartItemType
}

export function CartItem({ item }: CartItemProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)
  const { updateCartItem, removeFromCart } = useCartStore()

  const handleUpdateQuantity = async (newQuantity: number) => {
    if (newQuantity < 1) return
    
    try {
      setIsUpdating(true)
      await updateCartItem(item.id, newQuantity)
    } catch (error) {
      console.error('Error updating cart item:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleRemove = async () => {
    try {
      setIsRemoving(true)
      await removeFromCart(item.id)
    } catch (error) {
      console.error('Error removing cart item:', error)
    } finally {
      setIsRemoving(false)
    }
  }

  // Get the first image from the images array, fallback to image property or placeholder
  const getProductImage = () => {
    if (item.product.images && item.product.images.length > 0) {
      return item.product.images[0]
    }
    return item.product.image || '/placeholder.jpg'
  }

  return (
    <div className="flex items-center gap-4 py-4 border-b">
      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
        <Image
          src={getProductImage()}
          alt={item.product.name}
          fill
          className="object-cover"
          sizes="64px"
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-sm line-clamp-2">
          {item.product.name}
        </h3>
        <p className="text-sm text-muted-foreground">
          {item.product.formatted_price || formatPrice(parseFloat(item.product.price))}
        </p>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => handleUpdateQuantity(item.quantity - 1)}
          disabled={isUpdating || item.quantity <= 1}
        >
          <Minus className="h-4 w-4" />
        </Button>
        
        <span className="w-8 text-center text-sm font-medium">
          {item.quantity}
        </span>
        
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => handleUpdateQuantity(item.quantity + 1)}
          disabled={isUpdating}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="text-right">
          <p className="font-medium text-sm">
            {formatPrice(item.subtotal)}
          </p>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={handleRemove}
          disabled={isRemoving}
        >
          {isRemoving ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  )
}