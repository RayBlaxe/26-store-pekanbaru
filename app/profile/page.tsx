"use client"

import { useState } from "react"
import CustomerLayout from "@/components/customer-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, MapPin, Package, Edit, Save, X } from "lucide-react"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+62 812-3456-7890",
    address: "Jl. Aroma Pekanbaru 72, Duri, Mandau, KAB. Bengkalis 28784",
    birthDate: "1990-01-15",
    gender: "Laki-laki",
  })

  const orderHistory = [
    {
      id: "ORD-2023-001",
      date: "2023-12-15",
      total: 515000,
      status: "Diterima",
      items: ["Sepatu X"],
    },
    {
      id: "ORD-2023-002",
      date: "2023-12-10",
      total: 350000,
      status: "Dalam Pengiriman",
      items: ["Jersey Sport"],
    },
    {
      id: "ORD-2023-003",
      date: "2023-12-05",
      total: 750000,
      status: "Diterima",
      items: ["Sepatu Futsal", "Bola Futsal"],
    },
  ]

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleSave = () => {
    setIsEditing(false)
    // Here you would typically save to backend
  }

  const handleCancel = () => {
    setIsEditing(false)
    // Reset form data if needed
  }

  return (
    <CustomerLayout>
      <div className="min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white mb-8">Profil Saya</h1>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-slate-700">
              <TabsTrigger value="profile" className="data-[state=active]:bg-slate-600 text-white">
                <User className="h-4 w-4 mr-2" />
                Profil
              </TabsTrigger>
              <TabsTrigger value="orders" className="data-[state=active]:bg-slate-600 text-white">
                <Package className="h-4 w-4 mr-2" />
                Riwayat Pesanan
              </TabsTrigger>
              <TabsTrigger value="address" className="data-[state=active]:bg-slate-600 text-white">
                <MapPin className="h-4 w-4 mr-2" />
                Alamat
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card className="bg-slate-700 border-slate-600">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Informasi Profil
                    </CardTitle>
                    {!isEditing ? (
                      <Button
                        onClick={() => setIsEditing(true)}
                        variant="outline"
                        size="sm"
                        className="border-slate-500 text-slate-300 hover:bg-slate-600 hover:text-white"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    ) : (
                      <div className="flex space-x-2">
                        <Button onClick={handleSave} size="sm" className="bg-green-600 hover:bg-green-700">
                          <Save className="h-4 w-4 mr-2" />
                          Simpan
                        </Button>
                        <Button
                          onClick={handleCancel}
                          variant="outline"
                          size="sm"
                          className="border-slate-500 text-slate-300 hover:bg-slate-600 hover:text-white"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Batal
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src="/placeholder.svg?height=80&width=80" />
                      <AvatarFallback className="bg-slate-600 text-white text-xl">JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-white font-semibold text-lg">{profileData.name}</h3>
                      <p className="text-gray-400">{profileData.email}</p>
                      <Badge className="mt-1 bg-green-600 text-white">Verified</Badge>
                    </div>
                  </div>

                  <Separator className="bg-slate-600" />

                  {/* Profile Form */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-gray-300">
                        Nama Lengkap
                      </Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        disabled={!isEditing}
                        className="bg-slate-600 border-slate-500 text-white disabled:opacity-70"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-gray-300">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        disabled={!isEditing}
                        className="bg-slate-600 border-slate-500 text-white disabled:opacity-70"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-gray-300">
                        Nomor Telepon
                      </Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        disabled={!isEditing}
                        className="bg-slate-600 border-slate-500 text-white disabled:opacity-70"
                      />
                    </div>
                    <div>
                      <Label htmlFor="birthDate" className="text-gray-300">
                        Tanggal Lahir
                      </Label>
                      <Input
                        id="birthDate"
                        type="date"
                        value={profileData.birthDate}
                        onChange={(e) => setProfileData({ ...profileData, birthDate: e.target.value })}
                        disabled={!isEditing}
                        className="bg-slate-600 border-slate-500 text-white disabled:opacity-70"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="address" className="text-gray-300">
                        Alamat
                      </Label>
                      <Input
                        id="address"
                        value={profileData.address}
                        onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                        disabled={!isEditing}
                        className="bg-slate-600 border-slate-500 text-white disabled:opacity-70"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders">
              <Card className="bg-slate-700 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Package className="h-5 w-5 mr-2" />
                    Riwayat Pesanan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orderHistory.map((order) => (
                      <div key={order.id} className="bg-slate-600 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="text-white font-semibold">{order.id}</h4>
                            <p className="text-gray-400 text-sm">{order.date}</p>
                          </div>
                          <Badge
                            className={
                              order.status === "Diterima"
                                ? "bg-green-600 text-white"
                                : order.status === "Dalam Pengiriman"
                                  ? "bg-blue-600 text-white"
                                  : "bg-yellow-600 text-white"
                            }
                          >
                            {order.status}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-gray-300 text-sm">{order.items.join(", ")}</p>
                            <p className="text-white font-semibold">{formatPrice(order.total)}</p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-slate-500 text-slate-300 hover:bg-slate-500 hover:text-white"
                          >
                            Lihat Detail
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Address Tab */}
            <TabsContent value="address">
              <Card className="bg-slate-700 border-slate-600">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center">
                      <MapPin className="h-5 w-5 mr-2" />
                      Alamat Pengiriman
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-500 text-slate-300 hover:bg-slate-600 hover:text-white"
                    >
                      Tambah Alamat
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-slate-600 p-4 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-white font-semibold mb-1">Alamat Utama</h4>
                        <p className="text-gray-300 mb-2">{profileData.name}</p>
                        <p className="text-gray-300 mb-2">{profileData.phone}</p>
                        <p className="text-gray-300">{profileData.address}</p>
                        <Badge className="mt-2 bg-blue-600 text-white">Default</Badge>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-500 text-slate-300 hover:bg-slate-500 hover:text-white"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </CustomerLayout>
  )
}
