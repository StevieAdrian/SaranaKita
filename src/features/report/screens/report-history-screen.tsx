import React from 'react';
import { ThemedText } from '@/shared/components/themed-text';
import { ThemedView } from '@/shared/components/themed-view';

export function ReportHistoryScreen(): React.JSX.Element {
  return (
    <ThemedView className="flex-1 justify-center p-6">
      <ThemedText variant="h1">Riwayat Laporan</ThemedText>
    </ThemedView>
  );
}
