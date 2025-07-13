"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CreditCard, AlertCircle, CheckCircle } from "lucide-react"
import { Cart, Address, CreateOrderRequest } from "@/types/product"
import { orderService } from "@/services/order.service"
import { paymentService } from "@/services/payment.service"
import { useCartStore } from "@/stores/cart.store"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface PaymentButtonProps {
  cart: Cart
  selectedAddress: Address | null
  shippingCost: number
  onOrderCreated?: (orderId: number) => void
  disabled?: boolean
}

export default function PaymentButton({
  cart,
  selectedAddress,
  shippingCost,
  onOrderCreated,
  disabled = false
}: PaymentButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStep, setPaymentStep] = useState<'ready' | 'creating' | 'paying' | 'success' | 'error'>('ready')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { clearCart } = useCartStore()
  const router = useRouter()

  const totalAmount = cart.total + shippingCost

  const isFormValid = () => {
    return (
      selectedAddress &&
      cart.items.length > 0 &&
      paymentService.validatePaymentAmount(totalAmount)
    )
  }

  const handlePayment = async () => {
    if (!isFormValid() || !selectedAddress) {
      toast.error("Mohon lengkapi alamat pengiriman")
      return
    }

    try {
      setIsProcessing(true)
      setPaymentStep('creating')
      setErrorMessage(null)

      const orderData: CreateOrderRequest = {
        shipping_address: {
          name: selectedAddress.name,
          phone: selectedAddress.phone,
          address: selectedAddress.street,
          city: selectedAddress.city,
          state: selectedAddress.state,
          postal_code: selectedAddress.postal_code,
        },
        payment_method: 'midtrans',
        notes: `Order dari website 26 Store Pekanbaru - Total: ${paymentService.formatCurrency(totalAmount)}`
      }

      const orderResponse = await orderService.createOrder(orderData)
      const orderId = orderResponse.data.id

      if (onOrderCreated) {
        onOrderCreated(orderId)
      }

      setPaymentStep('paying')

      await paymentService.processPayment(orderId, {
        onSuccess: (result) => {
          console.log('Payment success:', result)
          setPaymentStep('success')
          setIsProcessing(false)
          clearCart()
          toast.success("Pembayaran berhasil! Pesanan Anda sedang diproses.")
          router.push(`/checkout/success?order_id=${orderId}`)
        },
        onPending: (result) => {
          console.log('Payment pending:', result)
          setPaymentStep('ready')
          setIsProcessing(false)
          toast.info("Pembayaran sedang diproses. Mohon selesaikan pembayaran Anda.")
          router.push(`/orders/${orderId}`)
        },
        onError: (result) => {
          console.error('Payment error:', result)
          setPaymentStep('error')
          setErrorMessage(result.status_message || 'Pembayaran gagal')
          setIsProcessing(false)
          toast.error("Pembayaran gagal. Silakan coba lagi.")
        },
        onClose: () => {
          if (paymentStep === 'paying') {
            setPaymentStep('ready')
            setIsProcessing(false)
            toast.info("Pembayaran dibatalkan. Pesanan masih tersimpan di riwayat pesanan.")
            router.push(`/orders/${orderId}`)
          }
        }
      })

    } catch (error: any) {
      console.error('Order creation error:', error)
      setPaymentStep('error')
      setErrorMessage(error.message || 'Gagal membuat pesanan')
      setIsProcessing(false)
      toast.error(error.message || "Gagal membuat pesanan. Silakan coba lagi.")
    }
  }

  const getButtonContent = () => {
    switch (paymentStep) {
      case 'creating':
        return (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Membuat Pesanan...
          </>
        )
      case 'paying':
        return (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Memproses Pembayaran...
          </>
        )
      case 'success':
        return (
          <>
            <CheckCircle className="h-4 w-4 mr-2" />
            Pembayaran Berhasil
          </>
        )
      default:
        return (
          <>
            <CreditCard className="h-4 w-4 mr-2" />
            Bayar Sekarang - {paymentService.formatCurrency(totalAmount)}
          </>
        )
    }
  }

  const getButtonVariant = () => {
    switch (paymentStep) {
      case 'success':
        return 'default'
      case 'error':
        return 'destructive'
      default:
        return 'default'
    }
  }

  return (
    <Card className="bg-slate-700 border-slate-600">
      <CardContent className="p-6 space-y-4">
        {/* Validation Alerts */}
        {!selectedAddress && (
          <Alert className="border-yellow-500 bg-yellow-500/10">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-yellow-300">
              Pilih alamat pengiriman terlebih dahulu
            </AlertDescription>
          </Alert>
        )}

        {cart.items.length === 0 && (
          <Alert className="border-red-500 bg-red-500/10">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-red-300">
              Keranjang belanja kosong
            </AlertDescription>
          </Alert>
        )}

        {!paymentService.validatePaymentAmount(totalAmount) && (
          <Alert className="border-red-500 bg-red-500/10">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-red-300">
              Minimal transaksi Rp 10.000
            </AlertDescription>
          </Alert>
        )}

        {/* Error Message */}
        {errorMessage && paymentStep === 'error' && (
          <Alert className="border-red-500 bg-red-500/10">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-red-300">
              {errorMessage}
            </AlertDescription>
          </Alert>
        )}

        {/* Payment Info */}
        <div className="bg-slate-600 p-4 rounded-lg border border-slate-500">
          <div className="flex items-center gap-3 mb-3">
            <div className="text-2xl">🔒</div>
            <div>
              <h4 className="text-white font-medium">Pembayaran Aman</h4>
              <p className="text-slate-300 text-sm">Powered by Midtrans</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <span>💳</span>
              <span>Kartu Kredit/Debit</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🏦</span>
              <span>Transfer Bank</span>
            </div>
            <div className="flex items-center gap-2">
              <span>📱</span>
              <span>E-Wallet</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🏪</span>
              <span>Convenience Store</span>
            </div>
          </div>
        </div>

        {/* Payment Button */}
        <Button
          onClick={handlePayment}
          disabled={disabled || !isFormValid() || isProcessing}
          className={`w-full h-12 text-lg font-semibold ${
            paymentStep === 'success' 
              ? 'bg-green-600 hover:bg-green-700' 
              : paymentStep === 'error'
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-green-600 hover:bg-green-700'
          }`}
          variant={getButtonVariant()}
        >
          {getButtonContent()}
        </Button>

        {/* Payment Steps Info */}
        {paymentStep === 'paying' && (
          <div className="text-center">
            <p className="text-slate-300 text-sm">
              Jangan tutup halaman ini sampai pembayaran selesai
            </p>
          </div>
        )}

        {paymentStep === 'ready' && isFormValid() && (
          <div className="text-center">
            <p className="text-slate-400 text-xs">
              Dengan melanjutkan, Anda menyetujui syarat dan ketentuan yang berlaku
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}