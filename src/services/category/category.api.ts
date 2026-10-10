import { apiClient } from '@/services/api';
import type { Category } from './types';

export function getCategories(): Promise<Category[]> {
  return apiClient.get<Category[]>('/categories');
}
