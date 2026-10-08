import { apiClient } from '@/services/api';
import type { Profile, UpdateProfileInput } from './types';

export function getProfile(): Promise<Profile> {
  return apiClient.get<Profile>('/profile');
}

export function updateProfile(input: UpdateProfileInput): Promise<Profile> {
  return apiClient.put<Profile>('/profile', input);
}
