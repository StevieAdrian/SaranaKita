import React from 'react';
import { Text, View } from 'react-native';
import { useRole } from '@/shared/context/theme-context';
import { BottomSheet } from './bottom-sheet';
import { Button } from './button';

export type ConfirmSheetProps = {
  visible: boolean;
  title: string;
  message: React.ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

const CONFIRM_BUTTON = { minHeight: 48 } as const;
const CANCEL_BUTTON = { minHeight: 48 } as const;

export function ConfirmSheet({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel = 'Batal',
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmSheetProps): React.JSX.Element {
  const { theme } = useRole();

  return (
    <BottomSheet visible={visible} onClose={loading ? () => { } : onCancel}>
      <View className="gap-2 pb-6">
        <Text
          accessibilityRole="header"
          style={{ color: theme.textHeading }}
          className="text-center text-xl font-bold"
        >
          {title}
        </Text>
        <Text style={{ color: theme.textSecondary }} className="text-center text-sm">{message}</Text>
      </View>
      <View className="gap-3">
        <Button
          title={confirmLabel}
          loading={loading}
          onPress={onConfirm}
          style={[CONFIRM_BUTTON, { backgroundColor: theme.primary }]}
        />
        <Button
          title={cancelLabel}
          variant="secondary"
          disabled={loading}
          onPress={onCancel}
          style={CANCEL_BUTTON}
        />
      </View>
    </BottomSheet>
  );
}
