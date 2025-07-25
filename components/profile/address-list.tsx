"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Address, AddressRequest } from "@/types/product"
import { AddressDialog } from "./address-dialog"
import { Star, Trash2, Edit } from "lucide-react"

interface AddressListProps {
  addresses: Address[]
  onCreateAddress: (data: AddressRequest) => Promise<void>
  onUpdateAddress: (id: number, data: AddressRequest) => Promise<void>
  onDeleteAddress: (id: number) => Promise<void>
  onSetDefault: (id: number) => Promise<void>
}

export function AddressList({ 
  addresses, 
  onCreateAddress, 
  onUpdateAddress, 
  onDeleteAddress, 
  onSetDefault 
}: AddressListProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const handleDelete = async (id: number) => {
    setDeletingId(id)
    try {
      await onDeleteAddress(id)
    } catch (error) {
      console.error("Failed to delete address:", error)
    } finally {
      setDeletingId(null)
    }
  }

  const handleSetDefault = async (id: number) => {
    try {
      await onSetDefault(id)
    } catch (error) {
      console.error("Failed to set default address:", error)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Alamat Pengiriman</h3>
        <AddressDialog onSave={onCreateAddress} />
      </div>

      {addresses.length === 0 ? (
        <Card className="bg-slate-700 border-slate-600">
          <CardContent className="py-8">
            <div className="text-center text-gray-400">
              <p className="mb-4">Belum ada alamat yang disimpan</p>
              <AddressDialog onSave={onCreateAddress} />
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {addresses.map((address) => (
            <Card key={address.id} className="bg-slate-700 border-slate-600">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {address.is_default && (
                        <Badge className="bg-blue-600 text-white">
                          <Star className="h-3 w-3 mr-1" />
                          Utama
                        </Badge>
                      )}
                    </div>
                    <p className="text-white font-medium mb-1">{address.address}</p>
                    <p className="text-gray-300 text-sm mb-1">
                      {address.city}, {address.province} {address.postal_code}
                    </p>
                    <p className="text-gray-400 text-sm">{address.phone}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {!address.is_default && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSetDefault(address.id)}
                        className="border-slate-500 text-slate-300 hover:bg-slate-500 hover:text-white"
                      >
                        <Star className="h-4 w-4 mr-1" />
                        Utama
                      </Button>
                    )}
                    
                    <AddressDialog
                      address={address}
                      onSave={(data) => onUpdateAddress(address.id, data)}
                      isEditing={true}
                    />
                    
                    {!address.is_default && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-slate-800 border-slate-600">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-white">Hapus Alamat</AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-300">
                              Apakah Anda yakin ingin menghapus alamat ini? Tindakan ini tidak dapat dibatalkan.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="border-slate-600 text-slate-300 hover:bg-slate-700">
                              Batal
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(address.id)}
                              disabled={deletingId === address.id}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              {deletingId === address.id ? "Menghapus..." : "Hapus"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}