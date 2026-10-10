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
