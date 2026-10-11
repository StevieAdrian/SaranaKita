import type { FeedReport, VoteResult } from '@/services/report';

export function toggleVote(
  reports: readonly FeedReport[],
  id: string,
): FeedReport[] {
  return reports.map(report =>
    report.id === id
      ? {
          ...report,
          votedByMe: !report.votedByMe,
          votes: Math.max(0, report.votes + (report.votedByMe ? -1 : 1)),
        }
      : report,
  );
}

export function applyVoteResult(
  reports: readonly FeedReport[],
  result: VoteResult,
): FeedReport[] {
  return reports.map(report =>
    report.id === result.reportId
      ? { ...report, votes: result.votes, votedByMe: result.votedByMe }
      : report,
  );
}

export function mergePage(
  current: readonly FeedReport[],
  next: readonly FeedReport[],
): FeedReport[] {
  const seen = new Set(current.map(report => report.id));
  return [...current, ...next.filter(report => !seen.has(report.id))];
}

export function toDisplayDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}
