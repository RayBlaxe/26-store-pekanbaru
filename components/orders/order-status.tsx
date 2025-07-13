import { Badge } from "@/components/ui/badge"

interface OrderStatusProps {
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'expired'
  size?: 'sm' | 'md' | 'lg'
}

export default function OrderStatus({ status, paymentStatus, size = 'md' }: OrderStatusProps) {
  const getStatusConfig = (status: string) => {
    const configs = {
      // Order Status
      pending: { 
        label: 'Menunggu', 
        className: 'bg-yellow-600 hover:bg-yellow-700 text-white',
        icon: '⏳'
      },
      processing: { 
        label: 'Diproses', 
        className: 'bg-blue-600 hover:bg-blue-700 text-white',
        icon: '⚙️'
      },
      shipped: { 
        label: 'Dikirim', 
        className: 'bg-purple-600 hover:bg-purple-700 text-white',
        icon: '🚚'
      },
      delivered: { 
        label: 'Diterima', 
        className: 'bg-green-600 hover:bg-green-700 text-white',
        icon: '✅'
      },
      cancelled: { 
        label: 'Dibatalkan', 
        className: 'bg-red-600 hover:bg-red-700 text-white',
        icon: '❌'
      },
      // Payment Status
      paid: { 
        label: 'Sudah Dibayar', 
        className: 'bg-green-600 hover:bg-green-700 text-white',
        icon: '💳'
      },
      failed: { 
        label: 'Gagal', 
        className: 'bg-red-600 hover:bg-red-700 text-white',
        icon: '❌'
      },
      expired: { 
        label: 'Kedaluwarsa', 
        className: 'bg-gray-600 hover:bg-gray-700 text-white',
        icon: '⏰'
      },
    }
    return configs[status as keyof typeof configs] || {
      label: status,
      className: 'bg-gray-600 hover:bg-gray-700 text-white',
      icon: '❓'
    }
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  }

  const orderConfig = getStatusConfig(status)
  const paymentConfig = paymentStatus ? getStatusConfig(paymentStatus) : null

  return (
    <div className="flex flex-wrap gap-2">
      <Badge 
        className={`${orderConfig.className} ${sizeClasses[size]} flex items-center gap-1`}
      >
        <span className="text-xs">{orderConfig.icon}</span>
        <span>{orderConfig.label}</span>
      </Badge>
      
      {paymentConfig && (
        <Badge 
          className={`${paymentConfig.className} ${sizeClasses[size]} flex items-center gap-1`}
        >
          <span className="text-xs">{paymentConfig.icon}</span>
          <span>{paymentConfig.label}</span>
        </Badge>
      )}
    </div>
  )
}

export function getStatusProgress(status: string): number {
  const statusFlow = {
    pending: 25,
    processing: 50,
    shipped: 75,
    delivered: 100,
    cancelled: 0
  }
  return statusFlow[status as keyof typeof statusFlow] || 0
}

export function getNextStatus(currentStatus: string): string | null {
  const statusFlow = {
    pending: 'processing',
    processing: 'shipped',
    shipped: 'delivered',
    delivered: null,
    cancelled: null
  }
  return statusFlow[currentStatus as keyof typeof statusFlow] || null
}

export function getStatusSteps() {
  return [
    { key: 'pending', label: 'Menunggu', icon: '⏳' },
    { key: 'processing', label: 'Diproses', icon: '⚙️' },
    { key: 'shipped', label: 'Dikirim', icon: '🚚' },
    { key: 'delivered', label: 'Diterima', icon: '✅' },
  ]
}