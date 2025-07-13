import { Address, AddressRequest, AddressResponse, AddressesResponse } from '@/types/product'

// Mock addresses data
let mockAddresses: Address[] = [
  {
    id: 1,
    user_id: 1,
    name: 'John Doe',
    phone: '08123456789',
    street: 'Jl. Merdeka No. 123, RT/RW 001/002',
    city: 'Pekanbaru',
    state: 'Riau',
    postal_code: '28111',
    is_default: true,
    created_at: '2024-01-15T08:00:00Z',
    updated_at: '2024-01-15T08:00:00Z'
  },
  {
    id: 2,
    user_id: 1,
    name: 'John Doe',
    phone: '08123456789',
    street: 'Jl. Sudirman No. 456, Komplek ABC Blok D No. 12',
    city: 'Pekanbaru',
    state: 'Riau',
    postal_code: '28112',
    is_default: false,
    created_at: '2024-01-20T10:30:00Z',
    updated_at: '2024-01-20T10:30:00Z'
  }
]

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const mockAddressService = {
  async getAddresses(): Promise<AddressesResponse> {
    await delay(300)
    return { data: mockAddresses }
  },

  async getAddress(addressId: number): Promise<AddressResponse> {
    await delay(200)
    
    const address = mockAddresses.find(a => a.id === addressId)
    if (!address) {
      throw new Error('Address not found')
    }
    
    return { data: address }
  },

  async createAddress(addressData: AddressRequest): Promise<AddressResponse> {
    await delay(400)
    
    // If this is set as default, remove default from others
    if (addressData.is_default) {
      mockAddresses = mockAddresses.map(addr => ({
        ...addr,
        is_default: false
      }))
    }
    
    const newAddress: Address = {
      id: mockAddresses.length + 1,
      user_id: 1,
      ...addressData,
      is_default: addressData.is_default || false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    mockAddresses.push(newAddress)
    return { data: newAddress }
  },

  async updateAddress(addressId: number, addressData: AddressRequest): Promise<AddressResponse> {
    await delay(400)
    
    const addressIndex = mockAddresses.findIndex(a => a.id === addressId)
    if (addressIndex === -1) {
      throw new Error('Address not found')
    }
    
    // If this is set as default, remove default from others
    if (addressData.is_default) {
      mockAddresses = mockAddresses.map(addr => ({
        ...addr,
        is_default: addr.id === addressId
      }))
    }
    
    mockAddresses[addressIndex] = {
      ...mockAddresses[addressIndex],
      ...addressData,
      updated_at: new Date().toISOString()
    }
    
    return { data: mockAddresses[addressIndex] }
  },

  async deleteAddress(addressId: number): Promise<{ message: string }> {
    await delay(300)
    
    const addressIndex = mockAddresses.findIndex(a => a.id === addressId)
    if (addressIndex === -1) {
      throw new Error('Address not found')
    }
    
    const deletedAddress = mockAddresses[addressIndex]
    mockAddresses.splice(addressIndex, 1)
    
    // If deleted address was default, make first remaining address default
    if (deletedAddress.is_default && mockAddresses.length > 0) {
      mockAddresses[0].is_default = true
    }
    
    return { message: 'Address deleted successfully' }
  },

  async setDefaultAddress(addressId: number): Promise<AddressResponse> {
    await delay(300)
    
    const addressIndex = mockAddresses.findIndex(a => a.id === addressId)
    if (addressIndex === -1) {
      throw new Error('Address not found')
    }
    
    // Remove default from all addresses
    mockAddresses = mockAddresses.map(addr => ({
      ...addr,
      is_default: addr.id === addressId,
      updated_at: addr.id === addressId ? new Date().toISOString() : addr.updated_at
    }))
    
    return { data: mockAddresses[addressIndex] }
  }
}