import { useCallback, useEffect, useRef, useState } from 'react';
import { toUserMessage } from '@/services/api';
import { COMMENT_MAX_LENGTH } from '../constants';
import { REPORT_STATUS } from '@/services/report/status.constants';
import {
  getReportDetail,
  createReportComment,
  getReportComments,
  unvoteReport,
  voteReport,
  recommendReport,
  removeRecommendation,
  rejectReport as rejectReportApi,
  updateReportStatus as updateReportStatusApi,
  type ReportDetail,
  type ReportComment,
  type UpdateReportStatusInput,
} from '@/services/report';

export type UseReportDetail = {
  readonly report: ReportDetail | null;
  readonly loading: boolean;
  readonly error: string | null;
  readonly voting: boolean;
  readonly recommending: boolean;
  readonly rejecting: boolean;
  readonly comments: readonly ReportComment[];
  readonly commentsError: string | null;
  readonly submittingComment: boolean;
  readonly changingStatus: boolean;
  readonly reload: () => void;
  readonly toggleVote: () => Promise<string | null>;
  readonly toggleRecommendation: (reason?: string) => Promise<string | null>;
  readonly submitReject: () => Promise<string | null>;
  readonly submitComment: (text: string) => Promise<string | null>;
  readonly changeStatus: (
    input: UpdateReportStatusInput,
  ) => Promise<string | null>;
};

export function useReportDetail(reportId: string): UseReportDetail {
  const [report, setReport] = useState<ReportDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [voting, setVoting] = useState(false);
  const [recommending, setRecommending] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [comments, setComments] = useState<ReportComment[]>([]);
  const [commentsError, setCommentsError] = useState<string | null>(null);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [changingStatus, setChangingStatus] = useState(false);
  const submittingCommentRef = useRef(false);
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
    setCommentsError(null);
    getReportComments(reportId)
      .then(items => {
        if (id === requestId.current) {
          setComments(current => {
            const merged = new Map(current.map(item => [item.id, item]));
            items.forEach(item => merged.set(item.id, item));
            return [...merged.values()].sort((a, b) =>
              a.createdAt.localeCompare(b.createdAt),
            );
          });
        }
      })
      .catch(err => {
        if (id === requestId.current) {
          setCommentsError(toUserMessage(err));
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

  const toggleRecommendation = useCallback(
    async (reason?: string): Promise<string | null> => {
      if (!report || recommending) {
        return null;
      }
      const normalizedReason = reason?.trim() ?? '';
      if (!report.recommendedByMe) {
        if (normalizedReason.length < 10) {
          return 'Alasan rekomendasi minimal 10 karakter.';
        }
        if (normalizedReason.length > 300) {
          return 'Alasan rekomendasi maksimal 300 karakter.';
        }
      }
      setRecommending(true);
      try {
        const result = report.recommendedByMe
          ? await removeRecommendation(report.id)
          : await recommendReport(report.id, normalizedReason);
        setReport(current =>
          current
            ? {
                ...current,
                recommendations: result.recommendations,
                recommendedByMe: result.recommendedByMe,
              }
            : current,
        );
        return null;
      } catch (err) {
        return toUserMessage(err);
      } finally {
        setRecommending(false);
      }
    },
    [report, recommending],
  );

  const submitReject = useCallback(async (): Promise<string | null> => {
    if (!report || rejecting) {
      return null;
    }
    setRejecting(true);
    try {
      await rejectReportApi(report.id);
      setReport(current =>
        current
          ? { ...current, status: REPORT_STATUS.REJECTED }
          : current,
      );

      return null;
    } catch (err) {
      return toUserMessage(err);
    } finally {
      setRejecting(false);
    }
  }, [report, rejecting]);

  const submitComment = useCallback(
    async (text: string): Promise<string | null> => {
      if (!report || submittingCommentRef.current) {
        return null;
      }
      const commentText = text.trim();
      if (!commentText || commentText.length > COMMENT_MAX_LENGTH) {
        return `Komentar harus berisi 1 sampai ${COMMENT_MAX_LENGTH} karakter.`;
      }
      submittingCommentRef.current = true;
      setSubmittingComment(true);
      try {
        const created = await createReportComment(report.id, commentText);
        setComments(current => [...current, created]);
        setReport(current =>
          current ? { ...current, comments: current.comments + 1 } : current,
        );
        setCommentsError(null);
        return null;
      } catch (err) {
        return toUserMessage(err);
      } finally {
        submittingCommentRef.current = false;
        setSubmittingComment(false);
      }
    },
    [report, submittingComment],
  );

  const changeStatus = useCallback(
    async (input: UpdateReportStatusInput): Promise<string | null> => {
      if (!report || changingStatus) {
        return null;
      }
      setChangingStatus(true);
      try {
        const updated = await updateReportStatusApi(report.id, input);
        setReport(updated);
        setCommentsError(null);
        return null;
      } catch (err) {
        return toUserMessage(err);
      } finally {
        setChangingStatus(false);
      }
    },
    [report, changingStatus],
  );

  return {
    report,
    loading,
    error,
    voting,
    recommending,
    rejecting,
    comments,
    commentsError,
    submittingComment,
    changingStatus,
    reload,
    toggleVote,
    toggleRecommendation,
    submitReject,
    submitComment,
    changeStatus,
  };
}
