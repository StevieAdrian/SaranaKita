import {
  DEFAULT_FILTERS,
  isDefaultFilters,
  toggleStatus,
} from '../src/features/home/utils/filters';
import { toQuery } from '../src/services/report/feed.api';

jest.mock('../src/services/api', () => ({ apiClient: {} }));

describe('toggleStatus', () => {
  it('adds a status in canonical order', () => {
    expect(toggleStatus(['done'], 'waiting_verification')).toEqual([
      'waiting_verification',
      'done',
    ]);
  });

  it('removes a selected status', () => {
    expect(toggleStatus(['in_review', 'done'], 'done')).toEqual(['in_review']);
  });
});

describe('isDefaultFilters', () => {
  it('is true for the defaults', () => {
    expect(isDefaultFilters(DEFAULT_FILTERS)).toBe(true);
  });

  it.each([
    [{ statuses: ['done'] as const, sort: 'latest' as const }],
    [{ statuses: [] as const, sort: 'most_votes' as const }],
  ])('is false when changed: %p', filters => {
    expect(isDefaultFilters(filters)).toBe(false);
  });
});

describe('toQuery', () => {
  it('skips empty values and joins arrays', () => {
    expect(
      toQuery({
        page: 1,
        search: '',
        categoryId: undefined,
        status: ['waiting_verification', 'done'],
        sort: 'most_votes',
      }),
    ).toBe('?page=1&status=waiting_verification%2Cdone&sort=most_votes');
  });

  it('omits empty arrays', () => {
    expect(toQuery({ status: [] })).toBe('');
  });

  it('encodes search text', () => {
    expect(toQuery({ search: 'kelas X&B' })).toBe('?search=kelas+X%26B');
  });
});
