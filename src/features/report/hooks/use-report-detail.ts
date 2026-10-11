import { useCallback, useEffect, useRef, useState } from 'react';
import { toUserMessage } from '@/services/api';
import {
  getReportDetail,
  unvoteReport,
  voteReport,
  type ReportDetail,
} from '@/services/report';

export type UseReportDetail = {
  readonly report: ReportDetail | null;
  readonly loading: boolean;
  readonly error: string | null;
  readonly voting: boolean;
  readonly reload: () => void;
  readonly toggleVote: () => Promise<string | null>;
};

export function useReportDetail(reportId: string): UseReportDetail {
  const [report, setReport] = useState<ReportDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [voting, setVoting] = useState(false);
  const requestId = useRef(0);

  const reload = useCallback(() => {
    const id = ++requestId.current;
    setLoading(true);
    setError(null);
    getReportDetail(reportId)
      .then(detail => {
        if (id === requestId.current) {
          setReport(detail);
        }
      })
      .catch(err => {
        if (id === requestId.current) {
          setError(toUserMessage(err));
        }
      })
      .finally(() => {
        if (id === requestId.current) {
          setLoading(false);
        }
      });
  }, [reportId]);

  useEffect(() => {
    reload();
  }, [reload]);

  const toggleVote = useCallback(async (): Promise<string | null> => {
    if (!report || voting) {
      return null;
    }
    setVoting(true);
    try {
      const result = report.votedByMe
        ? await unvoteReport(report.id)
        : await voteReport(report.id);
      setReport(current =>
        current
          ? { ...current, votes: result.votes, votedByMe: result.votedByMe }
          : current,
      );
      return null;
    } catch (err) {
      return toUserMessage(err);
    } finally {
      setVoting(false);
    }
  }, [report, voting]);

  return { report, loading, error, voting, reload, toggleVote };
}
