"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { formatPriceCompact } from "@/lib/utils"

interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_email: string
  total_amount: number
  status: string
  created_at: string
}

interface RecentOrdersProps {
  orders: Order[]
  loading?: boolean
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-purple-100 text-purple-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
}

export function RecentOrders({ orders, loading }: RecentOrdersProps) {
  if (loading) {
    return (
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Pesanan Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                </div>
                <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="col-span-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Pesanan Terbaru</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/orders">
            Lihat semua
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">Tidak ada pesanan terbaru</p>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="flex items-center justify-between space-x-4">
                <div className="flex-1">
                  <Link 
                    href={`/admin/orders/${order.id}`}
                    className="font-medium hover:underline"
                  >
                    #{order.order_number}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    {order.customer_name} • {order.customer_email}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {formatPriceCompact(order.total_amount)}
                  </p>
                  <Badge 
                    className={`${
                      statusColors[order.status as keyof typeof statusColors] || 
                      "bg-gray-100 text-gray-800"
                    } capitalize`}
                    variant="secondary"
                  >
                    {{
                      pending: 'Menunggu',
                      confirmed: 'Dikonfirmasi',
                      processing: 'Diproses',
                      shipped: 'Dikirim',
                      delivered: 'Terkirim',
                      cancelled: 'Dibatalkan'
                    }[order.status as keyof typeof statusColors] || order.status}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
