import type { ReportFormErrors, ReportFormValues } from '../types';

const MIN_DESCRIPTION_LENGTH = 10;

export function validateReportForm(
  values: ReportFormValues,
  now: Date = new Date(),
): ReportFormErrors {
  const errors: ReportFormErrors = {};

  if (!values.title.trim()) {
    errors.title = 'Judul laporan wajib diisi.';
  }

  const description = values.description.trim();
  if (!description) {
    errors.description = 'Deskripsi wajib diisi.';
  } else if (description.length < MIN_DESCRIPTION_LENGTH) {
    errors.description = `Deskripsi minimal ${MIN_DESCRIPTION_LENGTH} karakter.`;
  }

  if (!values.categoryId) {
    errors.categoryId = 'Pilih kategori.';
  }

  if (!values.location.trim()) {
    errors.location = 'Kelas atau lokasi wajib diisi.';
  }

  if (values.incidentDate.getTime() > now.getTime()) {
    errors.incidentDate = 'Tanggal tidak boleh di masa depan.';
  }

  return errors;
}

export function hasErrors(errors: ReportFormErrors): boolean {
  return Object.keys(errors).length > 0;
}
