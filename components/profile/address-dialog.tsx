"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Address, AddressRequest } from "@/types/product"
import { Plus, Edit, Save, X, AlertCircle } from "lucide-react"
import { toast } from "sonner"

interface AddressDialogProps {
  address?: Address
  onSave: (data: AddressRequest) => Promise<void>
  trigger?: React.ReactNode
  isEditing?: boolean
}

export function AddressDialog({ address, onSave, trigger, isEditing = false }: AddressDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({})
  const [formData, setFormData] = useState({
    address: address?.address || "",
    city: address?.city || "",
    province: address?.province || "",
    postal_code: address?.postal_code || "",
    phone: address?.phone || "",
    is_default: address?.is_default || false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setValidationErrors({})
    
    try {
      await onSave(formData)
      toast.success(isEditing ? "Alamat berhasil diperbarui" : "Alamat berhasil ditambahkan")
      setOpen(false)
      if (!isEditing) {
        setFormData({
          address: "",
          city: "",
          province: "",
          postal_code: "",
          phone: "",
          is_default: false,
        })
      }
    } catch (error: any) {
      console.error("Failed to save address:", error)
      
      if (error.response?.status === 422 && error.response?.data?.errors) {
        // Handle validation errors
        setValidationErrors(error.response.data.errors)
        setError("Silakan periksa kembali data yang Anda masukkan")
      } else {
        // Handle other errors
        const errorMessage = error.response?.data?.message || error.message || "Gagal menyimpan alamat"
        setError(errorMessage)
        toast.error(errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  const defaultTrigger = isEditing ? (
    <Button
      size="sm"
      variant="outline"
      className="border-slate-500 text-slate-300 hover:bg-slate-500 hover:text-white"
    >
      <Edit className="h-4 w-4" />
    </Button>
  ) : (
    <Button
      variant="outline"
      size="sm"
      className="border-slate-500 text-slate-300 hover:bg-slate-600 hover:text-white"
    >
      <Plus className="h-4 w-4 mr-2" />
      Tambah Alamat
    </Button>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="bg-slate-800 border-slate-600 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">
            {isEditing ? "Edit Alamat" : "Tambah Alamat Baru"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert className="bg-red-900/20 border-red-500 text-red-200">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div>
            <Label htmlFor="address" className="text-gray-300">
              Alamat Lengkap
            </Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className={`bg-slate-700 border-slate-600 text-white ${validationErrors.address ? 'border-red-500' : ''}`}
              placeholder="Jl. Contoh No. 123"
              required
            />
            {validationErrors.address && (
              <p className="text-red-400 text-sm mt-1">{validationErrors.address[0]}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city" className="text-gray-300">
                Kota
              </Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className={`bg-slate-700 border-slate-600 text-white ${validationErrors.city ? 'border-red-500' : ''}`}
                placeholder="Pekanbaru"
                required
              />
              {validationErrors.city && (
                <p className="text-red-400 text-sm mt-1">{validationErrors.city[0]}</p>
              )}
            </div>
            <div>
              <Label htmlFor="province" className="text-gray-300">
                Provinsi
              </Label>
              <Input
                id="province"
                value={formData.province}
                onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                className={`bg-slate-700 border-slate-600 text-white ${validationErrors.province ? 'border-red-500' : ''}`}
                placeholder="Riau"
                required
              />
              {validationErrors.province && (
                <p className="text-red-400 text-sm mt-1">{validationErrors.province[0]}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="postal_code" className="text-gray-300">
                Kode Pos
              </Label>
              <Input
                id="postal_code"
                value={formData.postal_code}
                onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                className={`bg-slate-700 border-slate-600 text-white ${validationErrors.postal_code ? 'border-red-500' : ''}`}
                placeholder="28118"
                required
              />
              {validationErrors.postal_code && (
                <p className="text-red-400 text-sm mt-1">{validationErrors.postal_code[0]}</p>
              )}
            </div>
            <div>
              <Label htmlFor="phone" className="text-gray-300">
                No. Telepon
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={`bg-slate-700 border-slate-600 text-white ${validationErrors.phone ? 'border-red-500' : ''}`}
                placeholder="08123456789"
                required
              />
              {validationErrors.phone && (
                <p className="text-red-400 text-sm mt-1">{validationErrors.phone[0]}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_default"
              checked={formData.is_default}
              onCheckedChange={(checked) => 
                setFormData({ ...formData, is_default: checked as boolean })
              }
              className="border-slate-600 data-[state=checked]:bg-blue-600"
            />
            <Label htmlFor="is_default" className="text-gray-300 text-sm">
              Jadikan alamat utama
            </Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <X className="h-4 w-4 mr-2" />
              Batal
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}