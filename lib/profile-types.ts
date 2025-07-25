import { User } from './auth-types'

export interface UpdateProfileRequest {
  name?: string
  email?: string
  phone?: string
  current_password?: string
  password?: string
  password_confirmation?: string
}

export interface ProfileResponse {
  success: boolean
  message: string
  user: User
}