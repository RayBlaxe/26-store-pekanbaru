import api from './auth-service'
import { UserAddress, CreateAddressRequest, UpdateAddressRequest, AddressResponse, AddressListResponse } from './address-types'

export const addressService = {
  async getAddresses(): Promise<UserAddress[]> {
    const response = await api.get<AddressListResponse>('/user-addresses')
    return response.data.data
  },

  async createAddress(data: CreateAddressRequest): Promise<UserAddress> {
    const response = await api.post<AddressResponse>('/user-addresses', data)
    return response.data.data
  },

  async updateAddress(id: number, data: UpdateAddressRequest): Promise<UserAddress> {
    const response = await api.put<AddressResponse>(`/user-addresses/${id}`, data)
    return response.data.data
  },

  async deleteAddress(id: number): Promise<void> {
    await api.delete(`/user-addresses/${id}`)
  },

  async setDefaultAddress(id: number): Promise<UserAddress> {
    const response = await api.post<AddressResponse>(`/user-addresses/${id}/set-default`)
    return response.data.data
  },

  async getAddress(id: number): Promise<UserAddress> {
    const response = await api.get<AddressResponse>(`/user-addresses/${id}`)
    return response.data.data
  }
}