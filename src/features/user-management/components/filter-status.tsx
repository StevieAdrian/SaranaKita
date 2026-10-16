import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { BottomSheet, RadioGroup } from '@/shared/components/ui';
import { useRole } from '@/shared/context/theme-context';
import { radius, spacing } from '@/shared/theme';
import { STATUS_FILTER_OPTIONS } from '../utils/constants';

export type FilterStatusProps = {
  visible: boolean;
  selectedStatus: string;
  onApply: (status: string) => void;
  onClose: () => void;
};

export function FilterStatus({
  visible,
  selectedStatus,
  onApply,
  onClose,
}: FilterStatusProps): React.JSX.Element {
  const { theme } = useRole();
  const [localStatus, setLocalStatus] = useState(selectedStatus);

  const handleReset = () => {
    setLocalStatus('all');
  };

  const handleApply = () => {
    onApply(localStatus);
    onClose();
  };

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={styles.sheetContent}>
        {/* Popup */}
        <View style={styles.headerRow}>
          <Text
            accessibilityRole="header"
            style={[styles.sheetTitle, { color: theme.textHeading }]}
          >
            Filter Status
          </Text>

          <Pressable
            onPress={handleReset}
            accessibilityRole="button"
            accessibilityLabel="Reset filter status"
          >
            <Text style={[styles.resetText, { color: theme.primary }]}>
              Reset
            </Text>
          </Pressable>
        </View>

        <RadioGroup
          options={STATUS_FILTER_OPTIONS}
          value={localStatus}
          onChange={setLocalStatus}
          style={styles.radioGroup}
        />

        {/* Button */}
        <Pressable
          onPress={handleApply}
          accessibilityRole="button"
          accessibilityLabel="Terapkan Filter"
          style={({ pressed }) => [
            styles.applyButton,
            { backgroundColor: theme.primary },
            pressed && styles.pressed,
          ]}
        >
          <Text style={[styles.applyText, { color: theme.onPrimary }]}>
            Terapkan Filter
          </Text>
        </Pressable>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  sheetContent: {
    paddingBottom: spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingBottom: spacing.xs,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  resetText: {
    fontSize: 14,
    fontWeight: '600',
  },
  radioGroup: {
    marginBottom: spacing.xl,
  },
  applyButton: {
    minHeight: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyText: {
    fontSize: 15,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.8,
  },
});
