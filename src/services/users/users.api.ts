import { apiClient } from '@/services/api';
import type {
  CreateUserInput,
  ManageUser,
  UpdateUserInput,
  UserSummary,
} from './types';

type PaginatedUsersResponse = {
  items: ManageUser[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export async function getUsers(params?: {
  search?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedUsersResponse> {
  const query = new URLSearchParams();
  if (params?.search) query.append('search', params.search);
  if (params?.page) query.append('page', String(params.page));
  if (params?.limit) query.append('limit', String(params.limit));

  const qs = query.toString();
  return apiClient.get<PaginatedUsersResponse>(`/users${qs ? `?${qs}` : ''}`);
}

export async function getUserSummary(): Promise<UserSummary> {
  return apiClient.get<UserSummary>('/users/summary');
}

export async function getUserById(id: string): Promise<ManageUser> {
  return apiClient.get<ManageUser>(`/users/${id}`);
}

export async function createUser(
  input: CreateUserInput,
): Promise<ManageUser> {
  return apiClient.post<ManageUser>('/users', input);
}

export async function updateUser(
  id: string,
  input: UpdateUserInput,
): Promise<ManageUser> {
  return apiClient.patch<ManageUser>(`/users/${id}`, input);
}

export async function deleteUser(id: string): Promise<void> {
  return apiClient.delete<void>(`/users/${id}`);
}
