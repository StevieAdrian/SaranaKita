import React, { useEffect, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { BottomSheet } from './bottom-sheet';
import { Button } from './button';
import { palette } from '@/shared/theme';
import { useRole } from '@/shared/context/theme-context';

const MAX_LENGTH = 300;
const MIN_LENGTH = 10;

const SAVE_BUTTON = {
  backgroundColor: palette.teacherPrimary,
  minHeight: 52,
  borderRadius: 12,
} as const;

const CANCEL_BUTTON = {
  backgroundColor: palette.teacherSoft,
  minHeight: 52,
  borderRadius: 12,
} as const;

export type RecommendationSheetProps = {
  visible: boolean;
  loading: boolean;
  onSubmit: (reason: string) => void;
  onCancel: () => void;
};

export function RecommendationSheet({
  visible,
  loading,
  onSubmit,
  onCancel,
}: RecommendationSheetProps): React.JSX.Element {
  const { theme, scheme } = useRole();
  const isDark = scheme === 'dark';
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (!visible) {
      setReason('');
    }
  }, [visible]);

  const trimmed = reason.trim();
  const canSubmit = trimmed.length >= MIN_LENGTH && trimmed.length <= MAX_LENGTH;

  const handleSubmit = () => {
    if (canSubmit && !loading) {
      onSubmit(trimmed);
    }
  };

  const handleCancel = () => {
    if (!loading) {
      setReason('');
      onCancel();
    }
  };

  return (
    <BottomSheet visible={visible} onClose={handleCancel}>
      <View className="gap-2 pb-5">
        <Text
          accessibilityRole="header"
          style={{ color: theme.textHeading }}
          className="text-xl font-bold"
        >
          Alasan Rekomendasi
        </Text>
        <Text style={{ color: theme.textMuted }} className="text-sm leading-5">
          Berikan Alasan Rekomendasi yang akan{`\n`}ditampilkan kepada siswa
        </Text>
      </View>

      <View
        style={{
          backgroundColor: theme.surfaceInput,
          borderColor: theme.borderInput,
        }}
        className="mb-2 rounded-xl border px-4 py-3"
      >
        <TextInput
          value={reason}
          onChangeText={setReason}
          placeholder="Tuliskan catatan evaluasi untuk perbaikan ini (min. 10 karakter)..."
          placeholderTextColor={theme.textPlaceholder}
          multiline
          maxLength={MAX_LENGTH}
          editable={!loading}
          style={{ textAlignVertical: 'top', color: theme.textInput }}
          className="min-h-[100px] text-sm leading-5"
        />
      </View>

      <Text style={{ color: theme.textMuted }} className="mb-5 self-end text-xs">
        {reason.length}/{MAX_LENGTH}
      </Text>

      <View className="gap-3">
        <Button
          title="Simpan"
          loading={loading}
          disabled={!canSubmit}
          onPress={handleSubmit}
          style={SAVE_BUTTON}
        />
        <Button
          title="Batal"
          variant="secondary"
          disabled={loading}
          onPress={handleCancel}
          style={[
            CANCEL_BUTTON,
            { backgroundColor: isDark ? theme.borderSubtle : palette.teacherSoft },
          ]}
        />
      </View>
    </BottomSheet>
  );
}
