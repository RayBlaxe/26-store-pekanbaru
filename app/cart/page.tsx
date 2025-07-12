"use client"

import { useEffect } from "react"
import CustomerLayout from "@/components/customer-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react"
import { useCartStore } from "@/stores/cart.store"
import { useAuthStore } from "@/stores/auth-store"
import { formatPrice } from "@/lib/utils"

export default function CartPage() {
  const { 
    cart, 
    isLoading, 
    fetchCart, 
    updateCartItem, 
    removeFromCart,
    getTotalItems,
    getTotalPrice 
  } = useCartStore()
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart()
    }
  }, [isAuthenticated, fetchCart])

  const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return
    try {
      await updateCartItem(itemId, newQuantity)
    } catch (error) {
      console.error('Failed to update quantity:', error)
    }
  }

  const handleRemoveItem = async (itemId: number) => {
    try {
      await removeFromCart(itemId)
    } catch (error) {
      console.error('Failed to remove item:', error)
    }
  }

  const totalItems = getTotalItems()
  const totalPrice = getTotalPrice()
  const shipping = 15000
  const finalTotal = totalPrice + shipping

  const getProductImage = (item: any) => {
    if (item.product.images && item.product.images.length > 0) {
      return item.product.images[0]
    }
    return item.product.image || '/placeholder.jpg'
  }

  if (!isAuthenticated) {
    return (
      <CustomerLayout>
        <div className="min-h-screen py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">Please Login</h2>
              <p className="text-gray-400 mb-6">You need to be logged in to view your cart.</p>
              <Button onClick={() => window.location.href = '/login'}>Login</Button>
            </div>
          </div>
        </div>
      </CustomerLayout>
    )
  }

  if (isLoading) {
    return (
      <CustomerLayout>
        <div className="min-h-screen py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto mb-4" />
              <p className="text-white">Loading cart...</p>
            </div>
          </div>
        </div>
      </CustomerLayout>
    )
  }

  return (
    <CustomerLayout>
      <div className="min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white mb-8">Keranjang Belanja</h1>

          {!cart || cart.items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">Keranjang Kosong</h2>
              <p className="text-gray-400 mb-6">Belum ada produk di keranjang Anda.</p>
              <Button onClick={() => window.location.href = '/'}>Mulai Belanja</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cart.items.map((item) => (
                  <Card key={item.id} className="bg-slate-700 border-slate-600">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <Image
                          src={getProductImage(item)}
                          alt={item.product.name}
                          width={80}
                          height={80}
                          className="rounded-lg bg-slate-800"
                        />
                        <div className="flex-1">
                          <h3 className="text-white font-semibold">{item.product.name}</h3>
                          <p className="text-gray-400">{formatPrice(Number(item.product.price))}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            className="border-slate-500 text-slate-300 hover:bg-slate-600 hover:text-white"
                            disabled={isLoading}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleUpdateQuantity(item.id, Number.parseInt(e.target.value) || 1)}
                            className="w-16 text-center bg-slate-600 border-slate-500 text-white"
                            disabled={isLoading}
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            className="border-slate-500 text-slate-300 hover:bg-slate-600 hover:text-white"
                            disabled={isLoading}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRemoveItem(item.id)}
                          className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                          disabled={isLoading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Order Summary */}
              <div>
                <Card className="bg-slate-700 border-slate-600">
                  <CardHeader>
                    <CardTitle className="text-white">Ringkasan Pesanan</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-gray-300">
                      <span>Subtotal ({totalItems} items)</span>
                      <span>{formatPrice(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Ongkos Kirim</span>
                      <span>{formatPrice(shipping)}</span>
                    </div>
                    <Separator className="bg-slate-600" />
                    <div className="flex justify-between text-white font-semibold text-lg">
                      <span>Total</span>
                      <span>{formatPrice(finalTotal)}</span>
                    </div>
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => window.location.href = '/checkout'}
                      disabled={isLoading}
                    >
                      Lanjut ke Checkout
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </CustomerLayout>
  )
}
