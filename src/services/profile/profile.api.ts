import { apiClient } from '@/services/api';
import type {
  ChangePasswordInput,
  FullProfile,
  Profile,
  UpdateProfileInput,
} from './types';

export function getProfile(): Promise<Profile> {
  return apiClient.get<Profile>('/profile');
}

export function updateProfile(input: UpdateProfileInput): Promise<Profile> {
  return apiClient.put<Profile>('/profile', input);
}

export function getFullProfile(): Promise<FullProfile> {
  return apiClient.get<FullProfile>('/profile/myprofile');
}

export function updateFullProfile(
  input: UpdateProfileInput,
): Promise<FullProfile> {
  return apiClient.put<FullProfile>('/profile/myprofile', input);
}

export function changePassword(
  input: ChangePasswordInput,
): Promise<{ message: string }> {
  return apiClient.post<{ message: string }>(
    '/profile/change-password',
    input,
  );
}
