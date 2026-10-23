import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BottomSheet } from '@/shared/components/ui';
import { useRole } from '@/shared/context/theme-context';
import { STATUS_FILTER_OPTIONS, userFonts } from '../utils/constants';

export type FilterStatusProps = {
  visible: boolean;
  selectedStatus: string;
  onApply: (status: string) => void;
  onClose: () => void;
};

type StatusTheme = {
  dotColor: string;
  selectedBg: string;
  selectedBorder: string;
  radioColor: string;
  selectedTitleColor: string;
};

const DEFAULT_STATUS_THEME: StatusTheme = {
  dotColor: '#6B7280',
  selectedBg: '#F3F4F6',
  selectedBorder: '#6B7280',
  radioColor: '#6B7280',
  selectedTitleColor: '#475569',
};

const STATUS_THEMES: Record<string, StatusTheme> = {
  all: DEFAULT_STATUS_THEME,
  active: {
    dotColor: '#34C759',
    selectedBg: '#F0FDF4',
    selectedBorder: '#34C759',
    radioColor: '#34C759',
    selectedTitleColor: '#166534',
  },
  inactive: {
    dotColor: '#EF4444',
    selectedBg: '#FEF2F2',
    selectedBorder: '#EF4444',
    radioColor: '#EF4444',
    selectedTitleColor: '#991B1B',
  },
};

export function FilterStatus({
  visible,
  selectedStatus,
  onApply,
  onClose,
}: FilterStatusProps): React.JSX.Element {
  const { theme } = useRole();
  const [localStatus, setLocalStatus] = useState(selectedStatus);

  React.useEffect(() => {
    setLocalStatus(selectedStatus);
  }, [selectedStatus, visible]);

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
        <View style={styles.headerRow}>
          <Text
            accessibilityRole="header"
            style={styles.sheetTitle}
          >
            Filter Status
          </Text>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleReset}
            accessibilityRole="button"
            accessibilityLabel="Reset filter status"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={styles.resetButton}
          >
            <Text style={[styles.resetText, { color: theme.primary }]}>
              Reset
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.optionsList}>
          {STATUS_FILTER_OPTIONS.map((option) => {
            const isSelected = localStatus === option.value;
            const statusTheme = STATUS_THEMES[option.value] ?? DEFAULT_STATUS_THEME;

            return (
              <TouchableOpacity
                key={option.value}
                activeOpacity={0.7}
                onPress={() => setLocalStatus(option.value)}
                accessibilityRole="radio"
                accessibilityState={{ selected: isSelected }}
                accessibilityLabel={option.label}
                style={[
                  styles.optionCard,
                  isSelected
                    ? [
                      styles.optionCardSelected,
                      {
                        backgroundColor: statusTheme.selectedBg,
                        borderColor: statusTheme.selectedBorder,
                      },
                    ]
                    : styles.optionCardUnselected,
                ]}
              >
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: statusTheme.dotColor },
                  ]}
                />

                <View style={styles.textCol}>
                  <Text
                    style={[
                      styles.optionLabel,
                      isSelected && {
                        color: statusTheme.selectedTitleColor,
                      },
                    ]}
                  >
                    {option.label}
                  </Text>
                  {option.description ? (
                    <Text
                      style={[
                        styles.optionDescription,
                        isSelected && {
                          color: option.value === 'all' ? '#9CA3AF' : '#64748B',
                        },
                      ]}
                    >
                      {option.description}
                    </Text>
                  ) : null}
                </View>

                <View
                  style={[
                    styles.radioOuter,
                    {
                      borderColor: isSelected
                        ? statusTheme.radioColor
                        : '#D1D5DB',
                    },
                  ]}
                >
                  {isSelected ? (
                    <View
                      style={[
                        styles.radioInner,
                        { backgroundColor: statusTheme.radioColor },
                      ]}
                    />
                  ) : null}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleApply}
          accessibilityRole="button"
          accessibilityLabel="Terapkan Filter"
          style={[
            styles.applyButton,
            { backgroundColor: theme.primary },
          ]}
        >
          <Text style={styles.applyText}>
            Terapkan Filter
          </Text>
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  sheetContent: {
    width: '100%',
    paddingBottom: 8,
  },
  headerRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingTop: 4,
  },
  sheetTitle: {
    fontFamily: userFonts.bold,
    fontSize: 18,
    lineHeight: 27,
    color: '#0F172A',
  },
  resetButton: {
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  resetText: {
    fontFamily: userFonts.medium,
    fontSize: 13,
    lineHeight: 19.5,
  },
  optionsList: {
    width: '100%',
    flexDirection: 'column',
    gap: 8,
    marginBottom: 16,
  },
  optionCard: {
    width: '100%',
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 0.8,
  },
  optionCardSelected: {},
  optionCardUnselected: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  textCol: {
    flex: 1,
    justifyContent: 'center',
  },
  optionLabel: {
    fontFamily: userFonts.semiBold,
    fontSize: 14,
    lineHeight: 20,
    color: '#1E1E1E',
  },
  optionDescription: {
    fontFamily: userFonts.medium,
    fontSize: 11,
    lineHeight: 16,
    color: '#94A3B8',
    marginTop: 2,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginLeft: 12,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  applyButton: {
    width: '100%',
    height: 48,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  applyText: {
    fontFamily: userFonts.semiBold,
    fontSize: 15,
    lineHeight: 22.5,
    color: '#FFFFFF',
  },
});
