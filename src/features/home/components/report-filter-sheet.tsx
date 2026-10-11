import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { StatusBadge } from '@/shared/components/report';
import { BottomSheet } from '@/shared/components/ui';
import { hitSlop } from '@/shared/theme';
import {
  DEFAULT_FILTERS,
  SORT_OPTIONS,
  STATUS_OPTIONS,
  toggleStatus,
  type ReportFilters,
} from '../utils/filters';

export type ReportFilterSheetProps = {
  visible: boolean;
  value: ReportFilters;
  onApply: (filters: ReportFilters) => void;
  onClose: () => void;
};

function Indicator({ selected }: { selected: boolean }): React.JSX.Element {
  return (
    <View
      className={`h-5 w-5 items-center justify-center rounded-full border-2 ${
        selected ? 'border-primary' : 'border-gray-400'
      }`}
    >
      {selected ? (
        <View className="h-2.5 w-2.5 rounded-full bg-primary" />
      ) : null}
    </View>
  );
}

export function ReportFilterSheet({
  visible,
  value,
  onApply,
  onClose,
}: ReportFilterSheetProps): React.JSX.Element {
  const [draft, setDraft] = useState<ReportFilters>(value);

  useEffect(() => {
    if (visible) {
      setDraft(value);
    }
  }, [visible, value]);

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View className="mb-3 flex-row items-center justify-between">
        <Text
          accessibilityRole="header"
          className="text-xl font-bold text-gray-900"
        >
          Filter
        </Text>
        <Pressable
          onPress={() => setDraft(DEFAULT_FILTERS)}
          hitSlop={hitSlop}
          accessibilityRole="button"
          accessibilityLabel="Reset filter"
          className="min-h-[44px] justify-center active:opacity-60"
        >
          <Text className="font-semibold text-primary">Reset</Text>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="mb-4">
        <Text className="mb-2 text-base font-semibold text-gray-900">
          Status Laporan
        </Text>
        <View className="mb-5 gap-2">
          {STATUS_OPTIONS.map(status => {
            const selected = draft.statuses.includes(status);
            return (
              <Pressable
                key={status}
                onPress={() =>
                  setDraft(current => ({
                    ...current,
                    statuses: toggleStatus(current.statuses, status),
                  }))
                }
                accessibilityRole="checkbox"
                accessibilityState={{ checked: selected }}
                className={`min-h-[48px] flex-row items-center justify-between rounded-lg border px-4 active:opacity-70 ${
                  selected ? 'border-primary' : 'border-gray-200'
                }`}
              >
                <StatusBadge status={status} />
                <Indicator selected={selected} />
              </Pressable>
            );
          })}
        </View>

        <Text className="mb-2 text-base font-semibold text-gray-900">
          Urutkan Berdasarkan
        </Text>
        <View accessibilityRole="radiogroup" className="gap-2">
          {SORT_OPTIONS.map(option => {
            const selected = draft.sort === option.value;
            return (
              <Pressable
                key={option.value}
                onPress={() =>
                  setDraft(current => ({ ...current, sort: option.value }))
                }
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                className={`min-h-[48px] flex-row items-center justify-between rounded-lg border px-4 active:opacity-70 ${
                  selected ? 'border-primary' : 'border-gray-200'
                }`}
              >
                <Text className="text-base text-gray-900">{option.label}</Text>
                <Indicator selected={selected} />
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <Pressable
        onPress={() => onApply(draft)}
        accessibilityRole="button"
        className="min-h-[52px] items-center justify-center rounded-xl bg-primary active:opacity-80"
      >
        <Text className="text-base font-semibold text-white">
          Terapkan Filter
        </Text>
      </Pressable>
    </BottomSheet>
  );
}
