"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import CustomerLayout from "@/components/customer-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { AddressList } from "@/components/profile/address-list"
import { profileService } from "@/lib/profile-service"
import { addressService } from "@/services/address.service"
import { User as UserType } from "@/lib/auth-types"
import { Address, AddressRequest } from "@/types/product"
import { UpdateProfileRequest } from "@/lib/profile-types"
import { convertUserAddressToAddress, convertAddressRequestToCreateAddressRequest } from "@/lib/address-bridge"
import { User, MapPin, Edit, Save, X } from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState<UserType | null>(null)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    current_password: "",
    password: "",
    password_confirmation: "",
  })

  useEffect(() => {
    loadProfileData()
  }, [])

  const loadProfileData = async () => {
    try {
      setLoading(true)
      const [profileData, addressData] = await Promise.all([
        profileService.getProfile(),
        addressService.getAddresses()
      ])
      
      setUser(profileData)
      setAddresses(addressData.data)
      setProfileData({
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone || "",
        current_password: "",
        password: "",
        password_confirmation: "",
      })
    } catch (error) {
      console.error('Failed to load profile data:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const updateData: UpdateProfileRequest = {}
      
      if (profileData.name !== user?.name) updateData.name = profileData.name
      if (profileData.email !== user?.email) updateData.email = profileData.email
      if (profileData.phone !== user?.phone) updateData.phone = profileData.phone
      
      if (profileData.password) {
        updateData.current_password = profileData.current_password
        updateData.password = profileData.password
        updateData.password_confirmation = profileData.password_confirmation
      }
      
      if (Object.keys(updateData).length > 0) {
        const updatedUser = await profileService.updateProfile(updateData)
        setUser(updatedUser)
      }
      
      setIsEditing(false)
      setProfileData(prev => ({
        ...prev,
        current_password: "",
        password: "",
        password_confirmation: "",
      }))
    } catch (error) {
      console.error('Failed to update profile:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    if (user) {
      setProfileData({
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        current_password: "",
        password: "",
        password_confirmation: "",
      })
    }
    setIsEditing(false)
  }

  const handleCreateAddress = async (data: AddressRequest) => {
    const response = await addressService.createAddress(data)
    setAddresses(prev => [...prev, response.data])
  }

  const handleUpdateAddress = async (id: number, data: AddressRequest) => {
    const response = await addressService.updateAddress(id, data)
    setAddresses(prev => prev.map(addr => addr.id === id ? response.data : addr))
  }

  const handleDeleteAddress = async (id: number) => {
    await addressService.deleteAddress(id)
    setAddresses(prev => prev.filter(addr => addr.id !== id))
  }

  const handleSetDefaultAddress = async (id: number) => {
    const response = await addressService.setDefaultAddress(id)
    setAddresses(prev => prev.map(addr => ({
      ...addr,
      is_default: addr.id === id
    })))
  }

  if (loading) {
    return (
      <CustomerLayout>
        <div className="min-h-screen py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Skeleton className="h-8 w-48 mb-8 bg-slate-700" />
            <div className="space-y-4">
              <Skeleton className="h-96 bg-slate-700" />
            </div>
          </div>
        </div>
      </CustomerLayout>
    )
  }

  if (!user) return null

  return (
    <CustomerLayout>
      <div className="min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white mb-8">Profil Saya</h1>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-slate-700">
              <TabsTrigger value="profile" className="data-[state=active]:bg-slate-600 text-white">
                <User className="h-4 w-4 mr-2" />
                Profil
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
                        <Button 
                          onClick={handleSave} 
                          size="sm" 
                          disabled={saving}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {saving ? "Menyimpan..." : "Simpan"}
                        </Button>
                        <Button
                          onClick={handleCancel}
                          variant="outline"
                          size="sm"
                          disabled={saving}
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
                      <h3 className="text-white font-semibold text-lg">{user.name}</h3>
                      <p className="text-gray-400">{user.email}</p>
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
                    {isEditing && (
                      <>
                        <div className="md:col-span-2">
                          <Label htmlFor="current_password" className="text-gray-300">
                            Password Saat Ini (jika ingin mengganti password)
                          </Label>
                          <Input
                            id="current_password"
                            type="password"
                            value={profileData.current_password}
                            onChange={(e) => setProfileData({ ...profileData, current_password: e.target.value })}
                            className="bg-slate-600 border-slate-500 text-white"
                            placeholder="Masukkan password saat ini"
                          />
                        </div>
                        <div>
                          <Label htmlFor="password" className="text-gray-300">
                            Password Baru
                          </Label>
                          <Input
                            id="password"
                            type="password"
                            value={profileData.password}
                            onChange={(e) => setProfileData({ ...profileData, password: e.target.value })}
                            className="bg-slate-600 border-slate-500 text-white"
                            placeholder="Masukkan password baru"
                          />
                        </div>
                        <div>
                          <Label htmlFor="password_confirmation" className="text-gray-300">
                            Konfirmasi Password Baru
                          </Label>
                          <Input
                            id="password_confirmation"
                            type="password"
                            value={profileData.password_confirmation}
                            onChange={(e) => setProfileData({ ...profileData, password_confirmation: e.target.value })}
                            className="bg-slate-600 border-slate-500 text-white"
                            placeholder="Konfirmasi password baru"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>


            {/* Address Tab */}
            <TabsContent value="address">
              <Card className="bg-slate-700 border-slate-600">
                <CardContent className="p-6">
                  <AddressList
                    addresses={addresses}
                    onCreateAddress={handleCreateAddress}
                    onUpdateAddress={handleUpdateAddress}
                    onDeleteAddress={handleDeleteAddress}
                    onSetDefault={handleSetDefaultAddress}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </CustomerLayout>
  )
}
