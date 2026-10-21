import type { RadioOption } from '@/shared/components/ui/radio-group';
import type { Gender } from '../types';

export * from './auth-constants';
export { CLASS_OPTIONS } from '@/shared/constants';

export const GENDER_OPTIONS: readonly RadioOption<Gender>[] = [
  { value: 'Laki-Laki', label: 'Laki-Laki' },
  { value: 'Perempuan', label: 'Perempuan' },
] as const;
