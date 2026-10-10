import type { SelectOption } from '@/shared/components/ui';

// TODO: replace with data from the API.
export const REPORT_LOCATIONS: readonly SelectOption[] = [
  { value: 'room-12a', label: 'Ruang 12A' },
  { value: 'room-12b', label: 'Ruang 12B' },
  { value: 'lab-computer', label: 'Lab Komputer' },
  { value: 'library', label: 'Perpustakaan' },
  { value: 'canteen', label: 'Kantin' },
];

export const TITLE_MAX_LENGTH = 100;
export const DESCRIPTION_MAX_LENGTH = 500;
