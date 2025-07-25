import api from '@/lib/auth-service'
import { 
  Address, 
  AddressRequest, 
  AddressResponse, 
  AddressesResponse,
  ApiResponse 
} from '@/types/product'

export const addressService = {
  async getAddresses(): Promise<AddressesResponse> {
    const response = await api.get('/user-addresses')
    return response.data
  },

  async getAddress(addressId: number): Promise<AddressResponse> {
    const response = await api.get(`/user-addresses/${addressId}`)
    return response.data
  },

  async createAddress(addressData: AddressRequest): Promise<AddressResponse> {
    const response = await api.post('/user-addresses', addressData)
    return response.data
  },

  async updateAddress(addressId: number, addressData: AddressRequest): Promise<AddressResponse> {
    const response = await api.put(`/user-addresses/${addressId}`, addressData)
    return response.data
  },

  async deleteAddress(addressId: number): Promise<ApiResponse<null>> {
    const response = await api.delete(`/user-addresses/${addressId}`)
    return response.data
  },

  async setDefaultAddress(addressId: number): Promise<AddressResponse> {
    const response = await api.post(`/user-addresses/${addressId}/set-default`)
    return response.data
  }
}