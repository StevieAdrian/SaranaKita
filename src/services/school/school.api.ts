import { apiClient } from '@/services/api';

export type School = {
  readonly id: string;
  readonly name: string | null;
};

export function getMySchool(): Promise<School> {
  return apiClient.get<School>('/schools/me');
}
