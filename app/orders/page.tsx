"use client"

import CustomerLayout from "@/components/customer-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Package, Truck, CheckCircle, Clock } from "lucide-react"

const orderStatuses = [
  { id: 1, label: "Dikonfirmasi", completed: true, icon: CheckCircle },
  { id: 2, label: "Diproses", completed: true, icon: Package },
  { id: 3, label: "Dalam Pengiriman", completed: true, icon: Truck },
  { id: 4, label: "Diterima", completed: false, icon: CheckCircle },
]

export default function OrdersPage() {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <CustomerLayout>
      <div className="min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header with product images */}
          <div className="flex justify-center mb-8">
            <div className="flex space-x-4">
              <div className="w-20 h-20 bg-slate-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs">Sepatu 1</span>
              </div>
              <div className="w-20 h-20 bg-slate-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs">Sepatu 2</span>
              </div>
              <div className="w-20 h-20 bg-slate-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs">Sepatu 3</span>
              </div>
              <div className="w-20 h-20 bg-slate-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs">Sepatu 4</span>
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-white text-center mb-8">Status Pesanan</h1>

          {/* Order Status Tracking */}
          <Card className="bg-slate-700 border-slate-600 mb-6">
            <CardHeader>
              <CardTitle className="text-white">Lacak Pesanan #ORD-2023-001</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-6">
                {orderStatuses.map((status, index) => {
                  const Icon = status.icon
                  return (
                    <div key={status.id} className="flex flex-col items-center flex-1">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                          status.completed ? "bg-green-600" : "bg-gray-600"
                        }`}
                      >
                        <Icon className={`h-5 w-5 ${status.completed ? "text-white" : "text-gray-400"}`} />
                      </div>
                      <span className={`text-sm text-center ${status.completed ? "text-green-400" : "text-gray-400"}`}>
                        {status.label}
                      </span>
                      {index < orderStatuses.length - 1 && (
                        <div className={`h-1 w-full mt-2 ${status.completed ? "bg-green-600" : "bg-gray-600"}`} />
                      )}
                    </div>
                  )
                })}
              </div>

              <div className="grid grid-cols-1 gap-6">
                {/* Order Details */}
                <div className="bg-slate-600 p-4 rounded-lg">
                  <h4 className="text-white font-semibold mb-3">Detail Pesanan</h4>
                  <div className="flex items-center space-x-3 mb-4">
                    <Image
                      src="/placeholder.svg?height=60&width=60"
                      alt="Sepatu X"
                      width={60}
                      height={60}
                      className="rounded bg-slate-800"
                    />
                    <div>
                      <h5 className="text-white font-medium">Sepatu X</h5>
                      <p className="text-gray-400 text-sm">Ukuran: 42</p>
                      <p className="text-white font-semibold">{formatPrice(500000)}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Subtotal:</span>
                      <span className="text-white">{formatPrice(500000)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Ongkos Kirim:</span>
                      <span className="text-white">{formatPrice(15000)}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span className="text-white">Total Pembayaran:</span>
                      <span className="text-green-400">{formatPrice(515000)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-slate-600 rounded-lg">
                <p className="text-gray-300 text-sm">
                  <Clock className="h-4 w-4 inline mr-2" />
                  Pesanan Anda sedang dalam perjalanan dan akan tiba dalam 1-2 hari kerja.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Additional Order Actions */}
          <div className="flex justify-center space-x-4">
            <Button variant="outline" className="border-slate-500 text-slate-300 hover:bg-slate-600 hover:text-white">
              Hubungi Penjual
            </Button>
            <Button className="bg-red-600 hover:bg-red-700 text-white">Batalkan Pesanan</Button>
          </div>
        </div>
      </div>
    </CustomerLayout>
  )
}
