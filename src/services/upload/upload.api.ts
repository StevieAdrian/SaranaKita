import { apiClient } from '@/services/api';
import type { UploadableFile, UploadedImage } from './types';

export function uploadReportImage(file: UploadableFile): Promise<UploadedImage> {
  const formData = new FormData();
  formData.append('file', {
    uri: file.uri,
    name: file.fileName ?? `report-${Date.now()}.jpg`,
    type: file.type ?? 'image/jpeg',
  } as unknown as Blob);

  return apiClient.upload<UploadedImage>('/uploads/report-image', formData);
}

export function uploadAvatarImage(
  file: UploadableFile,
  username?: string,
): Promise<UploadedImage> {
  const formData = new FormData();
  const cleanUsername = username?.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
  const fileName = cleanUsername ? `avatar-${cleanUsername}.jpg` : `avatar-${Date.now()}.jpg`;

  formData.append('file', {
    uri: file.uri,
    name: fileName,
    type: file.type ?? 'image/jpeg',
  } as unknown as Blob);

  const query = cleanUsername ? `?username=${encodeURIComponent(cleanUsername)}` : '';
  return apiClient.upload<UploadedImage>(`/uploads/avatar${query}`, formData, { skipAuth: true });
}
