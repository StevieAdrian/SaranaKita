import {
  formatIsoDate,
  formatReporterRole,
  formatShortDate,
  initialOf,
  timelineCopy,
} from '../src/features/report/utils/detail-format';
import { REPORT_PROGRESS } from '../src/shared/components/report/report-progress-meta';

describe('formatReporterRole', () => {
  it.each([
    ['siswa', 'XII B', 'Siswa Kelas XII B'],
    ['siswa', null, 'Siswa'],
    ['guru', 'XII B', 'Guru'],
    ['staff', null, 'Staff'],
    ['administrator', null, 'Administrator'],
    [null, null, 'Pengguna'],
  ] as const)('%s / %s -> %s', (role, className, expected) => {
    expect(formatReporterRole(role, className)).toBe(expected);
  });
});

describe('date formatting', () => {
  it('formats short Indonesian dates', () => {
    expect(formatShortDate('2026-07-24T12:00:00')).toBe('24 Jul 2026');
    expect(formatShortDate('2026-08-01T12:00:00')).toBe('1 Agu 2026');
  });

  it('formats ISO dates', () => {
    expect(formatIsoDate('2026-07-24T12:00:00')).toBe('2026-07-24');
  });

  it('returns invalid input unchanged', () => {
    expect(formatShortDate('x')).toBe('x');
    expect(formatIsoDate('x')).toBe('x');
  });
});

describe('initialOf', () => {
  it.each([
    ['alicia', 'A'],
    ['  budi', 'B'],
    ['', '?'],
  ])('%p -> %p', (name, expected) => {
    expect(initialOf(name)).toBe(expected);
  });
});

describe('timeline & progress', () => {
  it('has copy for created events', () => {
    expect(timelineCopy('created').title).toBe('Laporan Dibuat');
  });

  it('progress grows with status and completes at done', () => {
    expect(REPORT_PROGRESS.waiting_verification.completedSteps).toBe(1);
    expect(REPORT_PROGRESS.in_review.percent).toBeLessThan(
      REPORT_PROGRESS.in_repair.percent,
    );
    expect(REPORT_PROGRESS.done).toMatchObject({
      percent: 100,
      completedSteps: 4,
    });
  });
});
