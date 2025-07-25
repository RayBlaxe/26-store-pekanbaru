"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Truck, Clock, MapPin } from "lucide-react"
import { shippingService, type CourierService, type ShippingCost } from "@/services/shipping.service"
import { formatPrice } from "@/lib/utils"
import { toast } from "sonner"

interface ShippingCalculatorProps {
  destinationCity?: string
  destinationPostalCode?: string
  onShippingSelect: (cost: ShippingCost & { service: CourierService }) => void
  selectedService?: string
  disabled?: boolean
}

export default function ShippingCalculator({
  destinationCity,
  destinationPostalCode,
  onShippingSelect,
  selectedService,
  disabled = false
}: ShippingCalculatorProps) {
  const [courierServices, setCourierServices] = useState<CourierService[]>([])
  const [shippingCosts, setShippingCosts] = useState<Record<string, ShippingCost>>({})
  const [loading, setLoading] = useState(false)
  const [calculatingService, setCalculatingService] = useState<string | null>(null)

  useEffect(() => {
    console.log('ShippingCalculator props:', { destinationCity, destinationPostalCode })
    if (destinationPostalCode) {
      loadCourierServices()
    } else {
      console.warn('No postal code provided - cannot calculate shipping costs')
      toast.error('Kode pos alamat diperlukan untuk menghitung ongkos kirim')
    }
  }, [destinationCity, destinationPostalCode])

  const loadCourierServices = async () => {
    if (!destinationPostalCode) {
      toast.error('Kode pos diperlukan untuk menghitung biaya pengiriman')
      return
    }
    
    try {
      setLoading(true)
      const response = await shippingService.getCourierServices(destinationPostalCode, 1.0)
      setCourierServices(response.data)
      
      // Auto-calculate costs for all services
      await calculateAllShippingCosts(response.data)
    } catch (error: any) {
      toast.error(error.message || 'Gagal memuat layanan kurir')
    } finally {
      setLoading(false)
    }
  }

  const calculateAllShippingCosts = async (services: CourierService[]) => {
    if (!destinationPostalCode) {
      console.error('No postal code available for shipping calculation')
      return
    }
    
    console.log('Calculating shipping costs for postal code:', destinationPostalCode)
    console.log('Available services:', services)
    
    const costs: Record<string, ShippingCost> = {}
    
    for (const service of services) {
      try {
        setCalculatingService(service.service)
        const requestData = {
          destination_postal_code: destinationPostalCode,
          courier_service: service.service
        }
        
        console.log(`Sending request for ${service.service}:`, requestData)
        const response = await shippingService.calculateCartShipping(requestData)
        costs[service.service] = response.data
        console.log(`Success for ${service.service}:`, response.data)
      } catch (error: any) {
        console.error(`Failed to calculate cost for ${service.service}:`, error)
        console.error('Error details:', error.response?.data)
      }
    }
    
    setShippingCosts(costs)
    setCalculatingService(null)
  }

  const handleServiceSelect = (serviceCode: string) => {
    const service = courierServices.find(s => s.service === serviceCode)
    const cost = shippingCosts[serviceCode]
    
    if (service && cost) {
      onShippingSelect({ ...cost, service })
    }
  }

  const formatEstimatedDays = (etd: string) => {
    return etd.includes('day') ? etd : `${etd} hari`
  }

  if (loading) {
    return (
      <Card className="bg-slate-700 border-slate-600">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Pilih Layanan Pengiriman
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            <span className="ml-3 text-slate-400">Memuat layanan pengiriman...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (courierServices.length === 0) {
    return (
      <Card className="bg-slate-700 border-slate-600">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Pilih Layanan Pengiriman
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <MapPin className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-400">Tidak ada layanan pengiriman tersedia untuk kota ini</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-slate-700 border-slate-600">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Pilih Layanan Pengiriman
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedService}
          onValueChange={handleServiceSelect}
          disabled={disabled}
        >
          <div className="space-y-3">
            {courierServices.map((service) => {
              const cost = shippingCosts[service.service]
              const isCalculating = calculatingService === service.service
              
              return (
                <div key={service.service} className="flex items-start space-x-3">
                  <RadioGroupItem
                    value={service.service}
                    id={`service-${service.service}`}
                    className="mt-1"
                    disabled={!cost || isCalculating}
                  />
                  <div className="flex-1 min-w-0">
                    <Label
                      htmlFor={`service-${service.service}`}
                      className="block cursor-pointer"
                    >
                      <div className="bg-slate-600 p-4 rounded-lg border border-slate-500 hover:border-slate-400 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-white">{service.name}</h4>
                              <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">
                                {service.service}
                              </span>
                            </div>
                            <p className="text-slate-300 text-sm mb-2">{service.description}</p>
                            
                            {isCalculating ? (
                              <div className="flex items-center gap-2 text-slate-400">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span className="text-sm">Menghitung biaya...</span>
                              </div>
                            ) : cost ? (
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className="flex items-center gap-1 text-slate-300">
                                    <Clock className="h-4 w-4" />
                                    <span className="text-sm">{formatEstimatedDays(cost.estimated_delivery)}</span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-white font-semibold">
                                    {formatPrice(cost.total_cost)}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="text-slate-400 text-sm">
                                Gagal menghitung biaya
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Label>
                  </div>
                </div>
              )
            })}
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  )
}