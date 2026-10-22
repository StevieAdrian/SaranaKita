export type EvaluationRating = 1 | 2 | 3 | 4 | 5;

export type EvaluasiFormValues = {
  rate: EvaluationRating | 0;
  notes: string;
};

export type EvaluasiSheetProps = {
  visible: boolean;
  reportId: string | null;
  reportTitle: string;
  onClose: () => void;
  onSubmit: (
    reportId: string,
    rate: EvaluationRating,
    notes: string,
  ) => Promise<void>;
};

export type HistoryFilter = 'all' | 'mine' | 'supported' | 'recommended';
