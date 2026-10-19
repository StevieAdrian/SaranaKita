import type { SelectOption } from '@/shared/components/ui';

export const CLASS_OPTIONS: readonly SelectOption[] = [
  { value: 'X-A', label: 'X-A' },
  { value: 'X-B', label: 'X-B' },
  { value: 'XI-A', label: 'XI-A' },
  { value: 'XI-B', label: 'XI-B' },
  { value: 'XI-C', label: 'XI-C' },
  { value: 'XII-A', label: 'XII-A' },
  { value: 'XII-B', label: 'XII-B' },
  { value: 'XII-C', label: 'XII-C' },
] as const;
