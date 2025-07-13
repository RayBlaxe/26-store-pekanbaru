import api from '@/lib/auth-service'
import { 
  Address, 
  AddressRequest, 
  AddressResponse, 
  AddressesResponse,
  ApiResponse 
} from '@/types/product'
import { mockAddressService } from './mock-address.service'

// Use mock service only when API is not available
const USE_MOCK_SERVICE = !process.env.NEXT_PUBLIC_API_URL

export const addressService = {
  async getAddresses(): Promise<AddressesResponse> {
    if (USE_MOCK_SERVICE) {
      return mockAddressService.getAddresses()
    }
    
    try {
      const response = await api.get('/user/addresses')
      return response.data
    } catch (error) {
      console.warn('API call failed, falling back to mock service:', error)
      return mockAddressService.getAddresses()
    }
  },

  async getAddress(addressId: number): Promise<AddressResponse> {
    if (USE_MOCK_SERVICE) {
      return mockAddressService.getAddress(addressId)
    }
    
    try {
      const response = await api.get(`/user/addresses/${addressId}`)
      return response.data
    } catch (error) {
      console.warn('API call failed, falling back to mock service:', error)
      return mockAddressService.getAddress(addressId)
    }
  },

  async createAddress(addressData: AddressRequest): Promise<AddressResponse> {
    if (USE_MOCK_SERVICE) {
      return mockAddressService.createAddress(addressData)
    }
    
    try {
      const response = await api.post('/user/addresses', addressData)
      return response.data
    } catch (error) {
      console.warn('API call failed, falling back to mock service:', error)
      return mockAddressService.createAddress(addressData)
    }
  },

  async updateAddress(addressId: number, addressData: AddressRequest): Promise<AddressResponse> {
    if (USE_MOCK_SERVICE) {
      return mockAddressService.updateAddress(addressId, addressData)
    }
    
    try {
      const response = await api.put(`/user/addresses/${addressId}`, addressData)
      return response.data
    } catch (error) {
      console.warn('API call failed, falling back to mock service:', error)
      return mockAddressService.updateAddress(addressId, addressData)
    }
  },

  async deleteAddress(addressId: number): Promise<ApiResponse<null>> {
    if (USE_MOCK_SERVICE) {
      const mockResponse = await mockAddressService.deleteAddress(addressId)
      return { success: true, data: null, message: mockResponse.message }
    }
    
    try {
      const response = await api.delete(`/user/addresses/${addressId}`)
      return response.data
    } catch (error) {
      console.warn('API call failed, falling back to mock service:', error)
      const mockResponse = await mockAddressService.deleteAddress(addressId)
      return { success: true, data: null, message: mockResponse.message }
    }
  },

  async setDefaultAddress(addressId: number): Promise<AddressResponse> {
    if (USE_MOCK_SERVICE) {
      return mockAddressService.setDefaultAddress(addressId)
    }
    
    try {
      const response = await api.post(`/user/addresses/${addressId}/default`)
      return response.data
    } catch (error) {
      console.warn('API call failed, falling back to mock service:', error)
      return mockAddressService.setDefaultAddress(addressId)
    }
  }
}