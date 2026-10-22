import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { EvaluasiSheetProps, EvaluationRating } from '..';

export function EvaluasiSheet({
  visible,
  reportId,
  reportTitle,
  onClose,
  onSubmit,
}: EvaluasiSheetProps): React.JSX.Element {
  const [rate, setRate] = useState<EvaluationRating | 0>(0);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      setRate(0);
      setNotes('');
      setError(null);
    }
  }, [visible, reportId]);

  const handleSubmit = async () => {
    const trimmedNotes = notes.trim();

    if (!reportId) {
      setError('Laporan belum dipilih.');
      return;
    }

    if (rate === 0) {
      setError('Silakan pilih rating 1–5 bintang.');
      return;
    }

    if (trimmedNotes.length < 10 || trimmedNotes.length > 300) {
      setError('Catatan evaluasi harus terdiri dari 10–300 karakter.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit(reportId, rate, trimmedNotes);
      onClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Gagal menyimpan evaluasi. Silakan coba lagi.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    rate !== 0 && notes.trim().length >= 10 && notes.trim().length <= 300;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={isSubmitting ? () => {} : onClose}
    >
      <View className="flex-1 justify-end bg-black/40">
        <Pressable
          className="flex-1"
          disabled={isSubmitting}
          onPress={onClose}
          accessibilityLabel="Tutup popup evaluasi"
        />

        <View className="rounded-t-2xl bg-white px-4 pb-8 pt-3">
          <View className="mb-5 items-center">
            <View className="h-1.5 w-11 rounded-full bg-gray-200" />
          </View>

          <Text className="text-xl font-bold text-gray-900">
            Evaluasi Laporan
          </Text>

          <Text className="mt-1 text-sm text-gray-400">{reportTitle}</Text>

          <Text className="mt-4 text-sm font-semibold text-slate-700">
            Rating Pengerjaan <Text className="text-red-500">*</Text>
          </Text>

          <View className="mt-2 flex-row justify-center gap-3">
            {[1, 2, 3, 4, 5].map(value => (
              <Pressable
                key={value}
                disabled={isSubmitting}
                onPress={() => setRate(value as EvaluationRating)}
                accessibilityRole="button"
                accessibilityLabel={`${value} bintang`}
                accessibilityState={{ selected: value === rate }}
              >
                <Text
                  className={`text-3xl ${
                    value <= rate ? 'text-orange-500' : 'text-orange-400'
                  }`}
                >
                  {value <= rate ? '★' : '☆'}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text className="mt-5 text-sm font-semibold text-slate-700">
            Catatan Evaluasi <Text className="text-red-500">*</Text>
          </Text>

          <TextInput
            value={notes}
            onChangeText={setNotes}
            editable={!isSubmitting}
            multiline
            maxLength={300}
            placeholder="Tuliskan catatan evaluasi untuk perbaikan ini (min. 10 karakter)..."
            placeholderTextColor="#9CA3AF"
            textAlignVertical="top"
            className="mt-2 h-[104px] rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-800"
          />

          <Text className="mt-1 text-right text-xs text-gray-400">
            {notes.length}/300
          </Text>

          {error ? (
            <Text
              accessibilityRole="alert"
              className="mt-2 text-sm text-red-600"
            >
              {error}
            </Text>
          ) : null}

          <Pressable
            onPress={handleSubmit}
            disabled={isSubmitting || !isFormValid}
            className={`mt-4 min-h-11 items-center justify-center rounded-md ${
              isSubmitting || !isFormValid ? 'bg-slate-200' : 'bg-orange-500'
            }`}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text
                className={`font-semibold ${
                  isFormValid ? 'text-white' : 'text-slate-400'
                }`}
              >
                Simpan Evaluasi
              </Text>
            )}
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
