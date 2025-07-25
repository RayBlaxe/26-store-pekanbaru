"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Loader2, Package, Truck } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { trackingService, type UpdateTrackingRequest } from "@/services/tracking.service"

interface TrackingUpdateFormProps {
  orderId: number
  currentTrackingNumber?: string
  onUpdate: () => void
}

const trackingUpdateSchema = z.object({
  tracking_status: z.string().min(1, "Status harus dipilih"),
  tracking_number: z.string().optional(),
  location: z.string().optional(),
  description: z.string().optional(),
})

const trackingStatuses = [
  { value: 'pending', label: 'Menunggu', description: 'Pesanan sedang menunggu konfirmasi' },
  { value: 'processing', label: 'Diproses', description: 'Pesanan sedang diproses' },
  { value: 'packed', label: 'Dikemas', description: 'Pesanan telah dikemas dan siap dikirim' },
  { value: 'tracking_assigned', label: 'Resi Diberikan', description: 'Nomor resi telah diberikan' },
  { value: 'in_transit', label: 'Dalam Perjalanan', description: 'Pesanan dalam perjalanan' },
  { value: 'shipped', label: 'Dikirim', description: 'Pesanan telah dikirim' },
  { value: 'out_for_delivery', label: 'Pengiriman Terakhir', description: 'Pesanan sedang dalam pengiriman terakhir' },
  { value: 'delivered', label: 'Diterima', description: 'Pesanan telah diterima' },
]

export default function TrackingUpdateForm({ orderId, currentTrackingNumber, onUpdate }: TrackingUpdateFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<UpdateTrackingRequest>({
    resolver: zodResolver(trackingUpdateSchema),
    defaultValues: {
      tracking_status: "",
      tracking_number: currentTrackingNumber || "",
      location: "",
      description: "",
    },
  })

  const onSubmit = async (data: UpdateTrackingRequest) => {
    try {
      setIsSubmitting(true)
      await trackingService.updateOrderTracking(orderId, data)
      toast.success("Status tracking berhasil diperbarui!")
      onUpdate()
      form.reset()
    } catch (error: any) {
      toast.error(error.message || "Gagal memperbarui status tracking")
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedStatus = form.watch('tracking_status')
  const selectedStatusInfo = trackingStatuses.find(s => s.value === selectedStatus)

  return (
    <Card className="bg-slate-700 border-slate-600">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Package className="h-5 w-5" />
          Update Status Tracking
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Tracking Status */}
            <FormField
              control={form.control}
              name="tracking_status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Status Tracking</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                        <SelectValue placeholder="Pilih status tracking" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-slate-600 border-slate-500">
                      {trackingStatuses.map((status) => (
                        <SelectItem key={status.value} value={status.value} className="text-white hover:bg-slate-500">
                          <div>
                            <div className="font-medium">{status.label}</div>
                            <div className="text-sm text-slate-300">{status.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Auto-description for selected status */}
            {selectedStatusInfo && (
              <div className="p-3 bg-slate-600 rounded-lg border border-slate-500">
                <p className="text-sm text-slate-300">
                  <strong className="text-white">Deskripsi Default:</strong> {selectedStatusInfo.description}
                </p>
              </div>
            )}

            {/* Tracking Number */}
            <FormField
              control={form.control}
              name="tracking_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Nomor Resi (Opsional)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-slate-600 border-slate-500 text-white"
                      placeholder="Masukkan nomor resi jika ada"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Location */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Lokasi (Opsional)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-slate-600 border-slate-500 text-white"
                      placeholder="Contoh: Sortir Center Jakarta, Hub Pekanbaru"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Custom Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Deskripsi Kustom (Opsional)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="bg-slate-600 border-slate-500 text-white"
                      placeholder="Deskripsi tambahan jika diperlukan"
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                className="flex-1 border-slate-500 text-slate-300 hover:bg-slate-600"
                disabled={isSubmitting}
              >
                Reset
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Memperbarui...
                  </>
                ) : (
                  <>
                    <Truck className="h-4 w-4 mr-2" />
                    Update Status
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}