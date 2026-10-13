import { useCallback, useEffect, useRef, useState } from 'react';
import { toUserMessage } from '@/services/api';
import { COMMENT_MAX_LENGTH } from '../constants';
import {
  getReportDetail,
  createReportComment,
  getReportComments,
  unvoteReport,
  voteReport,
  type ReportDetail,
  type ReportComment,
} from '@/services/report';

export type UseReportDetail = {
  readonly report: ReportDetail | null;
  readonly loading: boolean;
  readonly error: string | null;
  readonly voting: boolean;
  readonly comments: readonly ReportComment[];
  readonly commentsError: string | null;
  readonly submittingComment: boolean;
  readonly reload: () => void;
  readonly toggleVote: () => Promise<string | null>;
  readonly submitComment: (text: string) => Promise<string | null>;
};

export function useReportDetail(reportId: string): UseReportDetail {
  const [report, setReport] = useState<ReportDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [voting, setVoting] = useState(false);
  const [comments, setComments] = useState<ReportComment[]>([]);
  const [commentsError, setCommentsError] = useState<string | null>(null);
  const [submittingComment, setSubmittingComment] = useState(false);
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

  return {
    report,
    loading,
    error,
    voting,
    comments,
    commentsError,
    submittingComment,
    reload,
    toggleVote,
    submitComment,
  };
}
