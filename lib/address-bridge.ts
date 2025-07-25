// Bridge between different address type structures
import { UserAddress, CreateAddressRequest, UpdateAddressRequest } from './address-types'
import { Address, AddressRequest } from '@/types/product'

export function convertUserAddressToAddress(userAddress: UserAddress): Address {
  return {
    id: userAddress.id,
    user_id: userAddress.user_id,
    name: '', // Not stored in UserAddress, could use user name
    phone: userAddress.phone,
    street: userAddress.address, // UserAddress.address maps to Address.street
    city: userAddress.city,
    state: userAddress.province, // UserAddress.province maps to Address.state
    postal_code: userAddress.postal_code,
    is_default: userAddress.is_default,
    created_at: userAddress.created_at,
    updated_at: userAddress.updated_at,
  }
}

export function convertAddressToUserAddress(address: Address): UserAddress {
  return {
    id: address.id,
    user_id: address.user_id,
    address: address.street, // Address.street maps to UserAddress.address
    city: address.city,
    province: address.state, // Address.state maps to UserAddress.province
    postal_code: address.postal_code,
    phone: address.phone,
    is_default: address.is_default,
    created_at: address.created_at,
    updated_at: address.updated_at,
  }
}

export function convertCreateAddressRequestToAddressRequest(
  createRequest: CreateAddressRequest,
  userName?: string
): AddressRequest {
  return {
    name: userName || '', // Use provided name or empty string
    phone: createRequest.phone,
    street: createRequest.address,
    city: createRequest.city,
    state: createRequest.province,
    postal_code: createRequest.postal_code,
    is_default: createRequest.is_default,
  }
}

export function convertAddressRequestToCreateAddressRequest(
  addressRequest: AddressRequest
): CreateAddressRequest {
  return {
    address: addressRequest.street,
    city: addressRequest.city,
    province: addressRequest.state,
    postal_code: addressRequest.postal_code,
    phone: addressRequest.phone,
    is_default: addressRequest.is_default,
  }
}