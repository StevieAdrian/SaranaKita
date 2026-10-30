import React, { useState } from 'react';
import { ActivityIndicator, FlatList, Image, Pressable, Text, View } from 'react-native';
import leftArrow from '@/assets/images/left-arrow.png';
import { useRole } from '@/shared/context/theme-context';
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
  const { theme } = useRole();
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
          <ActivityIndicator color={theme.primary} />
        </View>
      );
    }
    if (loadError) {
      return (
        <View className="items-center gap-3 py-8">
          <Text style={{ color: theme.textSecondary }} className="text-center text-sm">{loadError}</Text>
          {onRetry ? (
            <Pressable
              onPress={onRetry}
              accessibilityRole="button"
              style={{ backgroundColor: theme.primary }}
              className="min-h-[44px] justify-center rounded-lg px-5 active:opacity-70"
            >
              <Text className="font-semibold text-white">Coba lagi</Text>
            </Pressable>
          ) : null}
        </View>
      );
    }
    return (
      <Text style={{ color: theme.textSecondary }} className="py-8 text-center text-sm">{emptyText}</Text>
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
        className="h-12 flex-row items-center rounded-lg border px-4 active:opacity-70"
        style={{
          backgroundColor: theme.surfaceInput,
          borderColor: hasError ? theme.danger : theme.borderInput,
        }}
      >
        <Text
          numberOfLines={1}
          style={{ color: selected ? theme.textInput : theme.textPlaceholder }}
          className="flex-1 text-base"
        >
          {selected?.label ?? placeholder}
        </Text>
        {loading ? (
          <ActivityIndicator size="small" color={theme.textPlaceholder} />
        ) : (
          <Image
            source={leftArrow}
            resizeMode="contain"
            className="h-5 w-5"
            style={[CHEVRON_STYLE, { tintColor: theme.iconInactive }]}
          />
        )}
      </Pressable>

      <BottomSheet visible={open} onClose={() => setOpen(false)}>
        {sheetTitle ? (
          <Text style={{ color: theme.textHeading }} className="mb-2 text-lg font-semibold">{sheetTitle}</Text>
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
                  style={isSelected ? { backgroundColor: theme.primarySoft } : undefined}
                  className="min-h-[48px] justify-center rounded-lg px-3 active:opacity-70"
                >
                  <Text
                    style={{ color: isSelected ? theme.primary : theme.textHeading }}
                    className={`text-base ${isSelected ? 'font-semibold' : ''}`}
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
