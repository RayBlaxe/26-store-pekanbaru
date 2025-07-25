"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import CustomerLayout from "@/components/customer-layout"
import ShippingForm from "@/components/checkout/shipping-form"
import ShippingCalculator from "@/components/checkout/shipping-calculator"
import OrderSummary from "@/components/checkout/order-summary"
import PaymentButton from "@/components/checkout/payment-button"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, ShoppingCart, AlertCircle } from "lucide-react"
import { useCartStore } from "@/stores/cart.store"
import { useAuthStore } from "@/stores/auth-store"
import { addressService } from "@/services/address.service"
import { shippingService, type ShippingCost, type CourierService } from "@/services/shipping.service"
import { Address } from "@/types/product"
import { toast } from "sonner"

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, isLoading: cartLoading, fetchCart } = useCartStore()
  const { isAuthenticated } = useAuthStore()
  
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true)
  const [selectedShipping, setSelectedShipping] = useState<(ShippingCost & { service: CourierService }) | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/checkout')
      return
    }

    fetchCart()
    loadAddresses()
  }, [isAuthenticated, fetchCart, router])

  const loadAddresses = async () => {
    try {
      setIsLoadingAddresses(true)
      const response = await addressService.getAddresses()
      setAddresses(response.data)
      
      const defaultAddress = response.data.find(addr => addr.is_default)
      if (defaultAddress) {
        setSelectedAddress(defaultAddress)
      } else if (response.data.length > 0) {
        setSelectedAddress(response.data[0])
      }
    } catch (error: any) {
      console.error('Failed to load addresses:', error)
      toast.error("Gagal memuat alamat. Silakan coba lagi.")
    } finally {
      setIsLoadingAddresses(false)
    }
  }

  const handleAddressSelect = (address: Address) => {
    setSelectedAddress(address)
  }

  const handleAddressAdd = (address: Address) => {
    setAddresses(prev => [...prev, address])
    setSelectedAddress(address)
  }

  const handleShippingSelect = (shippingData: ShippingCost & { service: CourierService }) => {
    setSelectedShipping(shippingData)
  }

  const handleOrderCreated = (orderId: number) => {
    console.log('Order created:', orderId)
  }

  const handleBackToCart = () => {
    router.push('/cart')
  }

  // Loading state
  if (cartLoading || isLoadingAddresses) {
    return (
      <CustomerLayout>
        <div className="min-h-screen py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <Skeleton className="h-8 w-48 bg-slate-600" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-64 bg-slate-600" />
                <Skeleton className="h-32 bg-slate-600" />
              </div>
              <div>
                <Skeleton className="h-96 bg-slate-600" />
              </div>
            </div>
          </div>
        </div>
      </CustomerLayout>
    )
  }

  // No authentication
  if (!isAuthenticated) {
    return (
      <CustomerLayout>
        <div className="min-h-screen py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">Please Login</h2>
              <p className="text-gray-400 mb-6">You need to be logged in to checkout.</p>
              <Button onClick={() => router.push('/login?redirect=/checkout')}>Login</Button>
            </div>
          </div>
        </div>
      </CustomerLayout>
    )
  }

  // Empty cart
  if (!cart || cart.items.length === 0) {
    return (
      <CustomerLayout>
        <div className="min-h-screen py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">Keranjang Kosong</h2>
              <p className="text-gray-400 mb-6">Tambahkan produk ke keranjang terlebih dahulu.</p>
              <div className="space-x-4">
                <Button variant="outline" onClick={() => router.push('/')}>
                  Mulai Belanja
                </Button>
                <Button onClick={handleBackToCart}>
                  Lihat Keranjang
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CustomerLayout>
    )
  }

  return (
    <CustomerLayout>
      <div className="min-h-screen py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToCart}
              className="text-slate-300 hover:text-white hover:bg-slate-600"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Keranjang
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">Checkout</h1>
              <p className="text-slate-300">Lengkapi pesanan Anda</p>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address */}
              <ShippingForm
                addresses={addresses}
                selectedAddress={selectedAddress}
                onAddressSelect={handleAddressSelect}
                onAddressAdd={handleAddressAdd}
                isLoading={cartLoading}
              />

              {/* Shipping Calculator */}
              {selectedAddress && (
                <ShippingCalculator
                  destinationCity={selectedAddress.city}
                  destinationPostalCode={selectedAddress.postal_code}
                  onShippingSelect={handleShippingSelect}
                  selectedService={selectedShipping?.service.code}
                  disabled={cartLoading}
                />
              )}

              {/* Order Review */}
              <Card className="bg-slate-700 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white">Review Pesanan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {cart.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center py-2">
                        <div>
                          <h4 className="text-white font-medium">{item.product.name}</h4>
                          <p className="text-slate-300 text-sm">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-white font-semibold">
                          {new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }).format(item.subtotal)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Important Notes */}
              <Alert className="border-blue-500 bg-blue-500/10">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-blue-300">
                  <strong>Catatan Penting:</strong>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li>• Pastikan alamat pengiriman sudah benar</li>
                    <li>• Pembayaran akan diproses melalui Midtrans</li>
                    <li>• Pesanan akan dikirim setelah pembayaran dikonfirmasi</li>
                    <li>• Estimasi pengiriman 2-3 hari kerja</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </div>

            {/* Right Column - Order Summary & Payment */}
            <div className="space-y-6">
              <OrderSummary
                cart={cart}
                selectedAddress={selectedAddress}
                shippingCost={selectedShipping?.total_cost || 0}
                shippingService={selectedShipping?.service}
                isLoading={cartLoading}
              />

              <PaymentButton
                cart={cart}
                selectedAddress={selectedAddress}
                shippingCost={selectedShipping?.total_cost || 0}
                courierService={selectedShipping?.service.code}
                onOrderCreated={handleOrderCreated}
                disabled={cartLoading || !selectedAddress || !selectedShipping}
              />
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  )
}