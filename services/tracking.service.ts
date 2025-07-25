import api from '@/lib/auth-service'

export interface TrackingHistory {
  status: string
  timestamp: string
  location?: string
  description: string
  updated_by: string
}

export interface TrackingInfo {
  order_number: string
  status: string
  tracking_number?: string
  tracking_history: TrackingHistory[]
  tracking_progress: number
  latest_status?: TrackingHistory
  shipped_at?: string
  delivered_at?: string
  courier_service: string
}

export interface UpdateTrackingRequest {
  tracking_status: string
  location?: string
  description?: string
  tracking_number?: string
}

export const trackingService = {
  async getOrderTracking(orderId: number): Promise<{ data: TrackingInfo }> {
    try {
      const response = await api.get(`/orders/${orderId}/tracking`)
      return response.data
    } catch (error) {
      console.error('Failed to get order tracking:', error)
      throw error
    }
  },

  async updateOrderTracking(orderId: number, data: UpdateTrackingRequest): Promise<{ data: any }> {
    try {
      const response = await api.put(`/orders/${orderId}/tracking`, data)
      return response.data
    } catch (error) {
      console.error('Failed to update order tracking:', error)
      throw error
    }
  }
}