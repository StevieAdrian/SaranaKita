import type { RadioOption } from '@/shared/components/ui/radio-group';
import type { Gender } from '../types';

export * from './auth-constants';
export { CLASS_OPTIONS } from '@/shared/constants';

export const GENDER_OPTIONS: readonly RadioOption<Gender>[] = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
] as const;
