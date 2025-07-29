import { useEffect } from 'react'
import { ShoppingCart, X } from 'lucide-react'
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetFooter 
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { CartItem } from './cart-item'
import { useCartStore } from '@/stores/cart.store'
import { useAuthStore } from '@/stores/auth-store'
import { formatPrice } from '@/lib/utils'

interface CartDrawerProps {
  trigger?: React.ReactNode
}

export function CartDrawer({ trigger }: CartDrawerProps) {
  const { 
    cart, 
    isOpen, 
    isLoading, 
    openCart, 
    closeCart, 
    fetchCart,
    getTotalItems,
    getTotalPrice
  } = useCartStore()
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (isAuthenticated && isOpen) {
      fetchCart()
    }
  }, [isAuthenticated, isOpen, fetchCart])

  const totalItems = getTotalItems()
  const totalPrice = getTotalPrice()

  const handleCheckout = () => {
    closeCart()
    window.location.href = '/checkout'
  }

  const CartTrigger = trigger || (
    <Button variant="outline" size="icon" className="relative">
      <ShoppingCart className="h-4 w-4" />
      {totalItems > 0 && (
        <Badge 
          variant="destructive" 
          className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
        >
          {totalItems}
        </Badge>
      )}
    </Button>
  )

  if (!isAuthenticated) {
    return (
      <Button 
        variant="outline" 
        size="icon" 
        onClick={() => window.location.href = '/login'}
        className="relative"
      >
        <ShoppingCart className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => open ? openCart() : closeCart()}>
      <SheetTrigger asChild>
        {CartTrigger}
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Shopping Cart
            {totalItems > 0 && (
              <Badge variant="secondary">
                {totalItems} item{totalItems !== 1 ? 's' : ''}
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex flex-col h-full">
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">Loading cart...</p>
              </div>
            </div>
          ) : !cart || cart.items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium mb-2">Your cart is empty</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Add some products to get started
                </p>
                <Button onClick={closeCart} variant="outline">
                  Continue Shopping
                </Button>
              </div>
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1 -mx-6 px-6">
                <div className="space-y-0">
                  {cart.items.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </div>
              </ScrollArea>
              
              <div className="border-t pt-4 mt-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal ({totalItems} items)</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      closeCart()
                      window.location.href = '/cart'
                    }}
                    className="flex-1"
                  >
                    Lihat Keranjang
                  </Button>
                  <Button 
                    onClick={handleCheckout}
                    className="flex-1 bg-proceed hover:bg-proceed/90"
                  >
                    Lanjut ke Pembayaran
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}