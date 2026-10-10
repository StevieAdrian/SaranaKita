import { hasErrors, validateReportForm } from '../src/features/report/utils/validation';
import type { ReportFormValues } from '../src/features/report/types';

const NOW = new Date('2025-09-15T10:00:00Z');

const validValues: ReportFormValues = {
  photo: null,
  title: 'Proyektor Ruang 12B Rusak',
  description: 'Proyektor tidak menyala sejak pagi.',
  categoryId: 'electronics',
  locationId: 'room-12b',
  incidentDate: new Date('2025-09-14T10:00:00Z'),
};

describe('validateReportForm', () => {
  it('returns no errors for valid values', () => {
    expect(hasErrors(validateReportForm(validValues, NOW))).toBe(false);
  });

  it('requires title, description, category and location', () => {
    const errors = validateReportForm(
      { ...validValues, title: '  ', description: '', categoryId: null, locationId: null },
      NOW,
    );
    expect(Object.keys(errors).sort()).toEqual(
      ['categoryId', 'description', 'locationId', 'title'].sort(),
    );
  });

  it('rejects a description that is too short', () => {
    const errors = validateReportForm({ ...validValues, description: 'rusak' }, NOW);
    expect(errors.description).toBeDefined();
  });

  it('rejects a future incident date', () => {
    const errors = validateReportForm(
      { ...validValues, incidentDate: new Date('2025-09-16T10:00:00Z') },
      NOW,
    );
    expect(errors.incidentDate).toBeDefined();
  });

  it('does not require a photo', () => {
    const errors = validateReportForm({ ...validValues, photo: null }, NOW);
    expect(errors.photo).toBeUndefined();
  });
});
