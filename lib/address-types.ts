export interface UserAddress {
  id: number
  user_id: number
  address: string
  city: string
  province: string
  postal_code: string
  phone: string
  is_default: boolean
  created_at?: string
  updated_at?: string
}

export interface CreateAddressRequest {
  address: string
  city: string
  province: string
  postal_code: string
  phone: string
  is_default?: boolean
}

export interface UpdateAddressRequest {
  address?: string
  city?: string
  province?: string
  postal_code?: string
  phone?: string
  is_default?: boolean
}

export interface AddressResponse {
  success: boolean
  message: string
  data: UserAddress
}

export interface AddressListResponse {
  success: boolean
  data: UserAddress[]
}