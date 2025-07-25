import api from '@/lib/auth-service'

export interface ShippingCost {
  base_rate: number
  weight_category: string
  weight_multiplier: number
  courier_service: string
  courier_multiplier: number
  total_cost: number
  estimated_days: {
    min: number
    max: number
  }
}

export interface CourierService {
  code: string
  name: string
  description: string
  multiplier: number
}

export interface ShippingCalculationRequest {
  destination_city: string
  total_weight?: number
  courier_service?: string
}

export interface CartShippingCalculationRequest {
  destination_city?: string
  destination_postal_code?: string
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

  async getCourierServices(city: string): Promise<{ data: CourierService[] }> {
    try {
      const response = await api.get(`/shipping/courier-services?city=${encodeURIComponent(city)}`)
      return response.data
    } catch (error) {
      console.error('Failed to get courier services:', error)
      throw error
    }
  },

  async getSupportedCities(): Promise<{ data: string[] }> {
    try {
      const response = await api.get('/shipping/cities')
      return response.data
    } catch (error) {
      console.error('Failed to get supported cities:', error)
      throw error
    }
  },

  async getOriginInfo(): Promise<{ data: { postal_code: string, city: string, province: string, country: string } }> {
    try {
      const response = await api.get('/shipping/origin')
      return response.data
    } catch (error) {
      console.error('Failed to get origin info:', error)
      throw error
    }
  }
}