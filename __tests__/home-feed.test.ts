import {
  applyVoteResult,
  mergePage,
  toDisplayDate,
  toggleVote,
} from '../src/features/home/utils/feed';
import type { FeedReport } from '../src/services/report';

function report(overrides: Partial<FeedReport> & { id: string }): FeedReport {
  return {
    title: 'Judul',
    description: 'Deskripsi',
    location: 'X A',
    categoryId: 'c1',
    status: 'waiting_verification',
    imageUrl: null,
    reporter_id: 'user-1',
    reporterName: 'Alicia',
    reporterClass: 'X A',
    createdAt: '2026-07-01T10:00:00Z',
    votes: 0,
    comments: 0,
    recommendations: 0,
    votedByMe: false,
    recommendedByMe: false,
    note: null,
    ...overrides,
  };
}

const reports = [
  report({ id: 'a', votes: 10 }),
  report({ id: 'b', votes: 3, votedByMe: true }),
];

describe('toggleVote', () => {
  it('adds a vote', () => {
    expect(toggleVote(reports, 'a')[0]).toMatchObject({
      votedByMe: true,
      votes: 11,
    });
  });

  it('removes an existing vote', () => {
    expect(toggleVote(reports, 'b')[1]).toMatchObject({
      votedByMe: false,
      votes: 2,
    });
  });

  it('is reversible', () => {
    expect(toggleVote(toggleVote(reports, 'a'), 'a')).toEqual(reports);
  });

  it('leaves other reports untouched', () => {
    expect(toggleVote(reports, 'a')[1]).toBe(reports[1]);
  });
});

describe('applyVoteResult', () => {
  it('overwrites votes with the server result', () => {
    const next = applyVoteResult(reports, {
      reportId: 'a',
      votes: 42,
      votedByMe: true,
    });
    expect(next[0]).toMatchObject({ votes: 42, votedByMe: true });
    expect(next[1]).toBe(reports[1]);
  });
});

describe('mergePage', () => {
  it('appends new items and skips duplicates', () => {
    const merged = mergePage(reports, [
      report({ id: 'b' }),
      report({ id: 'c' }),
    ]);
    expect(merged.map(r => r.id)).toEqual(['a', 'b', 'c']);
    expect(merged[1]).toBe(reports[1]);
  });
});

describe('toDisplayDate', () => {
  it('formats ISO timestamps as YYYY-MM-DD', () => {
    expect(toDisplayDate('2026-07-24T05:00:00Z')).toMatch(/^2026-07-2[45]$/);
  });

  it('returns the input when it is not a date', () => {
    expect(toDisplayDate('bukan tanggal')).toBe('bukan tanggal');
  });
});
