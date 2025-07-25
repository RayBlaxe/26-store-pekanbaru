import api from './auth-service'
import { User } from './auth-types'
import { UpdateProfileRequest, ProfileResponse } from './profile-types'

export const profileService = {
  async getProfile(): Promise<User> {
    const response = await api.get<User>('/user')
    return response.data
  },

  async updateProfile(data: UpdateProfileRequest): Promise<User> {
    const response = await api.put<ProfileResponse>('/profile', data)
    return response.data.user
  }
}