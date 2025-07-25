"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, MapPin, Edit } from "lucide-react"
import { Address, AddressRequest } from "@/types/product"
import { addressService } from "@/services/address.service"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"

interface ShippingFormProps {
  addresses: Address[]
  selectedAddress: Address | null
  onAddressSelect: (address: Address) => void
  onAddressAdd: (address: Address) => void
  isLoading?: boolean
}

const addressSchema = z.object({
  address: z.string().min(5, "Alamat minimal 5 karakter"),
  city: z.string().min(2, "Kota minimal 2 karakter"),
  province: z.string().min(2, "Provinsi minimal 2 karakter"),
  postal_code: z.string().min(5, "Kode pos minimal 5 digit"),
  phone: z.string().min(10, "Nomor telepon minimal 10 digit"),
  is_default: z.boolean().optional(),
})

export default function ShippingForm({
  addresses,
  selectedAddress,
  onAddressSelect,
  onAddressAdd,
  isLoading = false
}: ShippingFormProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<AddressRequest>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      address: "",
      city: "",
      province: "",
      postal_code: "",
      phone: "",
      is_default: false,
    },
  })

  const onSubmit = async (data: AddressRequest) => {
    try {
      setIsSubmitting(true)
      const response = await addressService.createAddress(data)
      onAddressAdd(response.data)
      toast.success("Alamat berhasil ditambahkan!")
      setIsDialogOpen(false)
      form.reset()
    } catch (error: any) {
      toast.error(error.message || "Gagal menambahkan alamat")
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatAddress = (address: Address) => {
    return `${address.address}, ${address.city}, ${address.province} ${address.postal_code}`
  }

  return (
    <Card className="bg-slate-700 border-slate-600">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <span className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Alamat Pengiriman
          </span>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="border-slate-500 text-slate-300 hover:bg-slate-600">
                <Plus className="h-4 w-4 mr-1" />
                Tambah Alamat
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-700 border-slate-600 text-white">
              <DialogHeader>
                <DialogTitle>Tambah Alamat Baru</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kota</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="bg-slate-600 border-slate-500 text-white"
                              placeholder="Pekanbaru"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nomor Telepon</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="bg-slate-600 border-slate-500 text-white"
                              placeholder="08xxxxxxxxxx"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alamat Lengkap</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="bg-slate-600 border-slate-500 text-white"
                            placeholder="Jalan, No. Rumah, RT/RW"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="province"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Provinsi</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="bg-slate-600 border-slate-500 text-white"
                              placeholder="Riau"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="postal_code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kode Pos</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="bg-slate-600 border-slate-500 text-white"
                              placeholder="28118"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="is_default"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="border-slate-500"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Jadikan alamat utama</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      className="flex-1 border-slate-500 text-slate-300 hover:bg-slate-600"
                    >
                      Batal
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      {isSubmitting ? "Menyimpan..." : "Simpan Alamat"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {addresses.length === 0 ? (
          <div className="text-center py-8">
            <MapPin className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-400 mb-4">Belum ada alamat tersimpan</p>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Tambah Alamat Pertama
            </Button>
          </div>
        ) : (
          <RadioGroup
            value={selectedAddress?.id.toString()}
            onValueChange={(value) => {
              const address = addresses.find(addr => addr.id.toString() === value)
              if (address) onAddressSelect(address)
            }}
            disabled={isLoading}
          >
            <div className="space-y-3">
              {addresses.map((address) => (
                <div key={address.id} className="flex items-start space-x-3">
                  <RadioGroupItem
                    value={address.id.toString()}
                    id={`address-${address.id}`}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <Label
                      htmlFor={`address-${address.id}`}
                      className="block cursor-pointer"
                    >
                      <div className="bg-slate-600 p-4 rounded-lg border border-slate-500 hover:border-slate-400 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-white">{address.name}</h4>
                              {address.is_default && (
                                <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">
                                  Utama
                                </span>
                              )}
                            </div>
                            <p className="text-slate-300 text-sm mb-1">{address.phone}</p>
                            <p className="text-slate-300 text-sm">{formatAddress(address)}</p>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-slate-400 hover:text-white"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Label>
                  </div>
                </div>
              ))}
            </div>
          </RadioGroup>
        )}
      </CardContent>
    </Card>
  )
}