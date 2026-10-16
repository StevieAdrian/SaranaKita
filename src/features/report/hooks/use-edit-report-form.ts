import { useCallback, useEffect, useState } from 'react';
import { ApiError, toUserMessage } from '@/services/api';
import { getReportDetail } from '@/services/report';
import { uploadReportImage } from '@/services/upload';
import { toIsoDate } from '@/shared/utils/date';
import type { ReportDetail } from '@/services/report';
import type { ReportFormErrors, ReportFormValues } from '../types';
import { hasErrors, validateReportForm } from '../utils/validation';
import type { SubmitResult } from './use-create-report-form';
import { updateReport } from '@/services/report/report.api';

type EditValues = ReportFormValues;

function getServerMessage(error: unknown): string | null {
  if (
    !(error instanceof ApiError) ||
    error.status === 401 ||
    error.status >= 500
  ) {
    return null;
  }

  const body = error.body as { error?: unknown } | null;
  if (typeof body?.error === 'string') {
    return body.error;
  }

  const nested = (body?.error as { message?: unknown } | undefined)?.message;
  return typeof nested === 'string' ? nested : null;
}

export type UseEditReportForm = {
  readonly values: EditValues;
  readonly errors: ReportFormErrors;
  readonly loading: boolean;
  readonly loadError: string | null;
  readonly confirmVisible: boolean;
  readonly submitting: boolean;
  readonly existingImageUrl: string | null;
  readonly removeExistingImage: boolean;
  setField: <K extends keyof EditValues>(key: K, value: EditValues[K]) => void;
  requestSubmit: () => void;
  cancelSubmit: () => void;
  confirmSubmit: () => Promise<SubmitResult>;
  retryLoad: () => void;
};

const initialValues = (): EditValues => ({
  photo: null,
  title: '',
  description: '',
  categoryId: null,
  location: '',
  incidentDate: new Date(),
});

export function useEditReportForm(reportId: string): UseEditReportForm {
  const [values, setValues] = useState<EditValues>(initialValues);
  const [errors, setErrors] = useState<ReportFormErrors>({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [removeExistingImage, setRemoveExistingImage] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    async function load(): Promise<void> {
      setLoading(true);
      setLoadError(null);

      try {
        const report: ReportDetail = await getReportDetail(reportId);

        if (!active) return;

        setValues({
          photo: null,
          title: report.title,
          description: report.description,
          categoryId: report.category?.id ?? null,
          location: report.location,
          incidentDate: report.brokenDate
            ? new Date(`${report.brokenDate.slice(0, 10)}T00:00:00`)
            : new Date(),
        });

        setExistingImageUrl(report.imageUrls[0] ?? null);
        setRemoveExistingImage(false);
      } catch (error) {
        if (active) {
          setLoadError(getServerMessage(error) ?? toUserMessage(error));
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, [reportId, reloadKey]);

  const setField = useCallback(
    <K extends keyof EditValues>(key: K, value: EditValues[K]) => {
      setValues(previous => ({ ...previous, [key]: value }));

      if (key === 'photo' && value !== null) {
        setRemoveExistingImage(true);
      }

      setErrors(previous => {
        if (!previous[key]) return previous;
        const next = { ...previous };
        delete next[key];
        return next;
      });
    },
    [],
  );

  const requestSubmit = useCallback(() => {
    const nextErrors = validateReportForm(values);
    setErrors(nextErrors);

    if (!hasErrors(nextErrors)) {
      setConfirmVisible(true);
    }
  }, [values]);

  const cancelSubmit = useCallback(() => {
    setConfirmVisible(false);
  }, []);

  const confirmSubmit = useCallback(async (): Promise<SubmitResult> => {
    if (!values.categoryId) {
      return { ok: false, message: 'Pilih kategori.' };
    }

    setSubmitting(true);

    try {
      const uploadedImage = values.photo
        ? await uploadReportImage(values.photo)
        : null;

      await updateReport(reportId, {
        title: values.title.trim(),
        description: values.description.trim(),
        location: values.location.trim(),
        categoryId: values.categoryId,
        brokenDate: toIsoDate(values.incidentDate),
        ...(uploadedImage
          ? {
              imageUrl: uploadedImage.url,
              imagePublicId: uploadedImage.publicId,
            }
          : removeExistingImage
          ? { imageUrl: null }
          : {}),
      });

      setConfirmVisible(false);
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        message: getServerMessage(error) ?? toUserMessage(error),
      };
    } finally {
      setSubmitting(false);
    }
  }, [reportId, values, removeExistingImage]);

  const retryLoad = useCallback(() => {
    setReloadKey(previous => previous + 1);
  }, []);

  return {
    values,
    errors,
    loading,
    loadError,
    confirmVisible,
    submitting,
    existingImageUrl,
    removeExistingImage,
    setField,
    requestSubmit,
    cancelSubmit,
    confirmSubmit,
    retryLoad,
  };
}
