"use client"

import { useState } from "react"
import CustomerLayout from "@/components/customer-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import { MapPin } from "lucide-react"

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState("transfer")

  const orderItems = [
    {
      id: 1,
      name: "Sepatu X",
      price: 500000,
      quantity: 1,
      image: "/placeholder.svg?height=60&width=60",
    },
  ]

  const subtotal = 500000
  const shipping = 15000
  const total = subtotal + shipping

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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header with product images */}
          <div className="flex justify-center mb-8">
            <div className="flex space-x-4">
              <Image
                src="/placeholder.svg?height=80&width=80"
                alt="Product"
                width={80}
                height={80}
                className="rounded"
              />
              <Image
                src="/placeholder.svg?height=80&width=80"
                alt="Product"
                width={80}
                height={80}
                className="rounded"
              />
              <Image
                src="/placeholder.svg?height=80&width=80"
                alt="Product"
                width={80}
                height={80}
                className="rounded"
              />
              <Image
                src="/placeholder.svg?height=80&width=80"
                alt="Product"
                width={80}
                height={80}
                className="rounded"
              />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-white text-center mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Shipping Information */}
            <Card className="bg-slate-700 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Informasi Pengiriman
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-slate-600 p-3 rounded-lg">
                  <p className="text-white text-sm">Jl. Aroma Pekanbaru 72, Duri, Mandau, KAB. Bengkalis 28784</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-gray-300">
                      Nama Depan
                    </Label>
                    <Input
                      id="firstName"
                      className="bg-slate-600 border-slate-500 text-white"
                      placeholder="Nama depan"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-gray-300">
                      Nama Belakang
                    </Label>
                    <Input
                      id="lastName"
                      className="bg-slate-600 border-slate-500 text-white"
                      placeholder="Nama belakang"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="phone" className="text-gray-300">
                    Nomor Telepon
                  </Label>
                  <Input id="phone" className="bg-slate-600 border-slate-500 text-white" placeholder="Nomor telepon" />
                </div>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card className="bg-slate-700 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white">Ringkasan Pesanan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Items */}
                {orderItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      width={60}
                      height={60}
                      className="rounded bg-slate-800"
                    />
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{item.name}</h4>
                      <p className="text-gray-400 text-sm">Ukuran: 42</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white">x {item.quantity}</p>
                      <p className="text-white font-semibold">{formatPrice(item.price)}</p>
                    </div>
                  </div>
                ))}

                <Separator className="bg-slate-600" />

                {/* Payment Method */}
                <div>
                  <Label className="text-white font-medium mb-3 block">Metode Pembayaran</Label>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="transfer" id="transfer" />
                      <Label htmlFor="transfer" className="text-gray-300">
                        Transfer Bank
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="text-gray-300">
                        Bayar di Tempat (COD)
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <Separator className="bg-slate-600" />

                {/* Price Summary */}
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Ongkos Kirim</span>
                    <span>{formatPrice(shipping)}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                <Separator className="bg-slate-600" />

                <div className="text-right">
                  <p className="text-white font-bold text-xl">Total: {formatPrice(total)}</p>
                </div>

                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">Buat Pesanan</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </CustomerLayout>
  )
}
