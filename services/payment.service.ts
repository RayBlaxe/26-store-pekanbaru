import { PaymentTokenResponse } from '@/types/product'
import { orderService } from './order.service'

declare global {
  interface Window {
    snap: {
      pay: (token: string, options: MidtransOptions) => void
      hide: () => void
    }
  }
}

interface MidtransOptions {
  onSuccess?: (result: any) => void
  onPending?: (result: any) => void
  onError?: (result: any) => void
  onClose?: () => void
}

interface PaymentResult {
  status_code: string
  status_message: string
  transaction_id: string
  order_id: string
  payment_type: string
  transaction_time: string
  transaction_status: string
  fraud_status?: string
}

class PaymentService {
  private static instance: PaymentService
  private snapLoaded = false
  private snapScript: HTMLScriptElement | null = null

  static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService()
    }
    return PaymentService.instance
  }

  async loadSnapScript(): Promise<void> {
    if (this.snapLoaded || typeof window === 'undefined') {
      return Promise.resolve()
    }

    return new Promise((resolve, reject) => {
      if (this.snapScript) {
        resolve()
        return
      }

      const script = document.createElement('script')
      script.src = 'https://app.sandbox.midtrans.com/snap/snap.js'
      script.setAttribute('data-client-key', process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || '')
      
      script.onload = () => {
        this.snapLoaded = true
        this.snapScript = script
        resolve()
      }
      
      script.onerror = () => {
        reject(new Error('Failed to load Midtrans Snap script'))
      }

      document.head.appendChild(script)
    })
  }

  async processPayment(orderId: number, options: Partial<MidtransOptions> = {}): Promise<void> {
    try {
      // Get payment token from API (either real or mock)
      const paymentData = await orderService.getPaymentToken(orderId)
      
      // Check if this is a mock token (starts with 'mock-payment-token')
      if (paymentData.token.startsWith('mock-payment-token')) {
        console.log('Using mock payment simulation for token:', paymentData.token)
        return this.simulateMockPayment(orderId, paymentData.token, options)
      }

      // For real Midtrans tokens, load Midtrans Snap script
      await this.loadSnapScript()

      if (!window.snap) {
        throw new Error('Midtrans Snap not loaded')
      }
      
      const defaultOptions: MidtransOptions = {
        onSuccess: (result: PaymentResult) => {
          console.log('Payment success:', result)
          if (options.onSuccess) {
            options.onSuccess(result)
          }
        },
        onPending: (result: PaymentResult) => {
          console.log('Payment pending:', result)
          if (options.onPending) {
            options.onPending(result)
          }
        },
        onError: (result: PaymentResult) => {
          console.error('Payment error:', result)
          if (options.onError) {
            options.onError(result)
          }
        },
        onClose: () => {
          console.log('Payment popup closed')
          if (options.onClose) {
            options.onClose()
          }
        },
      }

      // Process payment with Midtrans Snap
      console.log('Processing payment with real Midtrans token:', paymentData.token)
      window.snap.pay(paymentData.token, { ...defaultOptions, ...options })
      
    } catch (error) {
      console.error('Payment processing error:', error)
      throw error
    }
  }

  private async simulateMockPayment(orderId: number, token: string, options: Partial<MidtransOptions> = {}): Promise<void> {
    // Show a simple confirmation dialog for mock payment
    return new Promise((resolve) => {
      const mockResult: PaymentResult = {
        status_code: '200',
        status_message: 'Success, transaction is successful',
        transaction_id: `mock-txn-${orderId}-${Date.now()}`,
        order_id: `ORD-2024-${String(orderId).padStart(3, '0')}`,
        payment_type: 'credit_card',
        transaction_time: new Date().toISOString(),
        transaction_status: 'settlement',
        fraud_status: 'accept'
      }

      // Simulate payment dialog with better UX
      const message = [
        '🏪 26 Store Pekanbaru - Development Mode',
        '',
        `Order ID: ${mockResult.order_id}`,
        `Token: ${token}`,
        '',
        '⚠️  DEVELOPMENT MODE ACTIVE',
        'Midtrans is not configured, using mock payment.',
        '',
        'In this mode:',
        '• No real money is charged',
        '• Payment is simulated locally',
        '• Order status will be updated automatically',
        '',
        'To use real Midtrans:',
        '• Set MIDTRANS keys in .env files',
        '• Restart both frontend and backend',
        '',
        'Click "OK" to simulate successful payment',
        'Click "Cancel" to cancel payment'
      ].join('\n')

      const proceedWithPayment = window.confirm(message)

      if (proceedWithPayment) {
        console.log('Mock payment successful:', mockResult)
        if (options.onSuccess) {
          setTimeout(() => options.onSuccess!(mockResult), 1000)
        }
      } else {
        console.log('Mock payment cancelled')
        if (options.onClose) {
          setTimeout(() => options.onClose!(), 500)
        }
      }
      
      resolve()
    })
  }

  hidePaymentDialog(): void {
    if (typeof window !== 'undefined' && window.snap) {
      window.snap.hide()
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  validatePaymentAmount(amount: number): boolean {
    return amount > 0 && amount >= 10000 // Minimum 10,000 IDR
  }

  getPaymentMethods() {
    return [
      { id: 'credit_card', name: 'Kartu Kredit/Debit', icon: '💳' },
      { id: 'bank_transfer', name: 'Transfer Bank', icon: '🏦' },
      { id: 'e_wallet', name: 'E-Wallet', icon: '📱' },
      { id: 'convenience_store', name: 'Convenience Store', icon: '🏪' },
    ]
  }

  cleanup(): void {
    if (this.snapScript) {
      document.head.removeChild(this.snapScript)
      this.snapScript = null
      this.snapLoaded = false
    }
  }
}

export const paymentService = PaymentService.getInstance()