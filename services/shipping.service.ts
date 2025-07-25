import api from '@/lib/auth-service'

export interface ShippingCost {
  courier_name: string
  courier_code: string
  service: string
  service_description: string
  total_cost: number
  estimated_delivery: string
  weight_grams: number
  origin: string
  destination: string
  all_services?: RajaOngkirService[]
  is_fallback?: boolean
}

export interface RajaOngkirService {
  name: string
  code: string
  service: string
  description: string
  cost: number
  etd: string
}

export interface DestinationSearch {
  postal_code: string
  city_name: string
  subdistrict_name: string
  type: string
  province: string
}

export interface CourierService {
  code: string
  name: string
  service: string
  description: string
  cost: number
  etd: string
}

export interface ShippingCalculationRequest {
  destination_postal_code: string
  total_weight?: number
  courier_service?: string
}

export interface CartShippingCalculationRequest {
  destination_postal_code: string
  courier_service?: string
}

export const shippingService = {
  async calculateShipping(data: ShippingCalculationRequest): Promise<{ data: ShippingCost }> {
    try {
      const response = await api.post('/shipping/calculate', data)
      return response.data
    } catch (error) {
      console.error('Failed to calculate shipping:', error)
      throw error
    }
  },

  async calculateCartShipping(data: CartShippingCalculationRequest): Promise<{ data: ShippingCost & { total_weight: number, item_count: number } }> {
    try {
      const response = await api.post('/shipping/calculate-cart', data)
      return response.data
    } catch (error) {
      console.error('Failed to calculate cart shipping:', error)
      throw error
    }
  },

  async getCourierServices(postalCode: string, weight: number = 1.0): Promise<{ data: CourierService[] }> {
    try {
      const response = await api.get(
        `/shipping/courier-services?postal_code=${encodeURIComponent(postalCode)}&weight=${weight}`
      )
      return response.data
    } catch (error) {
      console.error('Failed to get courier services:', error)
      throw error
    }
  },

  async searchDestinations(query: string, limit: number = 10, offset: number = 0): Promise<{ data: DestinationSearch[], meta: any }> {
    try {
      const response = await api.get(
        `/shipping/search-destinations?search=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`
      )
      return response.data
    } catch (error) {
      console.error('Failed to search destinations:', error)
      throw error
    }
  },

  async getOriginInfo(): Promise<{ data: { postal_code: string, city: string, province: string, country: string, store_name: string } }> {
    try {
      const response = await api.get('/shipping/origin')
      return response.data
    } catch (error) {
      console.error('Failed to get origin info:', error)
      throw error
    }
  }
}