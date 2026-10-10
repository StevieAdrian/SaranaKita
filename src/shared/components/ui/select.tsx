import React, { useState } from 'react';
import { ActivityIndicator, FlatList, Image, Pressable, Text, View } from 'react-native';
import leftArrow from '@/assets/images/left-arrow.png';
import { palette } from '@/shared/theme';
import { BottomSheet } from './bottom-sheet';

export type SelectOption<T extends string = string> = {
  readonly value: T;
  readonly label: string;
};

export type SelectProps<T extends string> = {
  value: T | null;
  options: readonly SelectOption<T>[];
  onChange: (value: T) => void;
  placeholder: string;
  sheetTitle?: string;
  accessibilityLabel?: string;
  hasError?: boolean;
  loading?: boolean;
  loadError?: string | null;
  onRetry?: () => void;
  emptyText?: string;
};

const CHEVRON_STYLE = {
  tintColor: palette.gray700,
  transform: [{ rotate: '-90deg' }],
} as const;

export function Select<T extends string>({
  value,
  options,
  onChange,
  placeholder,
  sheetTitle,
  accessibilityLabel,
  hasError = false,
  loading = false,
  loadError = null,
  onRetry,
  emptyText = 'Belum ada pilihan.',
}: SelectProps<T>): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const selected = options.find(option => option.value === value);

  const handleSelect = (next: T) => {
    onChange(next);
    setOpen(false);
  };

  const renderStatus = () => {
    if (loading) {
      return (
        <View className="items-center py-8">
          <ActivityIndicator color={palette.navy} />
        </View>
      );
    }
    if (loadError) {
      return (
        <View className="items-center gap-3 py-8">
          <Text className="text-center text-sm text-gray-500">{loadError}</Text>
          {onRetry ? (
            <Pressable
              onPress={onRetry}
              accessibilityRole="button"
              className="min-h-[44px] justify-center rounded-lg bg-navy px-5 active:opacity-70"
            >
              <Text className="font-semibold text-white">Coba lagi</Text>
            </Pressable>
          ) : null}
        </View>
      );
    }
    return (
      <Text className="py-8 text-center text-sm text-gray-500">{emptyText}</Text>
    );
  };

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityValue={{ text: selected?.label ?? placeholder }}
        accessibilityState={{ busy: loading }}
        className={`h-12 flex-row items-center rounded-lg border bg-field px-4 active:opacity-70 ${
          hasError ? 'border-red-500' : 'border-field-border'
        }`}
      >
        <Text
          numberOfLines={1}
          className={`flex-1 text-base ${selected ? 'text-gray-900' : 'text-gray-500'}`}
        >
          {selected?.label ?? placeholder}
        </Text>
        {loading ? (
          <ActivityIndicator size="small" color={palette.gray500} />
        ) : (
          <Image
            source={leftArrow}
            resizeMode="contain"
            className="h-5 w-5"
            style={CHEVRON_STYLE}
          />
        )}
      </Pressable>

      <BottomSheet visible={open} onClose={() => setOpen(false)}>
        {sheetTitle ? (
          <Text className="mb-2 text-lg font-semibold text-gray-900">{sheetTitle}</Text>
        ) : null}
        {loading || loadError || options.length === 0 ? (
          renderStatus()
        ) : (
          <FlatList
            data={options}
            keyExtractor={item => item.value}
            renderItem={({ item }) => {
              const isSelected = item.value === value;
              return (
                <Pressable
                  onPress={() => handleSelect(item.value)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected }}
                  className={`min-h-[48px] justify-center rounded-lg px-3 active:bg-gray-100 ${
                    isSelected ? 'bg-page' : ''
                  }`}
                >
                  <Text
                    className={`text-base ${
                      isSelected ? 'font-semibold text-navy' : 'text-gray-900'
                    }`}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              );
            }}
          />
        )}
      </BottomSheet>
    </>
  );
}
