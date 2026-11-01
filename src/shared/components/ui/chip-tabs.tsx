import React from 'react';
import { Pressable, ScrollView, Text, type ViewStyle } from 'react-native';
import { palette } from '@/shared/theme';
import { useRole } from '@/shared/context/theme-context';

export type ChipTabOption<T extends string> = {
  readonly value: T;
  readonly label: string;
};

export type ChipTabsProps<T extends string> = {
  options: readonly ChipTabOption<T>[];
  value: T;
  onChange: (value: T) => void;
  accessibilityLabel?: string;
  tone?: 'primary' | 'teacher' | 'staff' | 'admin';
};

const CONTENT_STYLE = { flexGrow: 1, flexDirection: 'row', gap: 8 } as const;

export function ChipTabs<T extends string>({
  options,
  value,
  onChange,
  accessibilityLabel,
  tone = 'primary',
}: ChipTabsProps<T>): React.JSX.Element {
  const { theme, scheme } = useRole();
  const isDark = scheme === 'dark';

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={CONTENT_STYLE}
      accessibilityRole="tablist"
      accessibilityLabel={accessibilityLabel}
    >
      {options.map(option => {
        const selected = option.value === value;

        const activeColor =
          tone === 'teacher'
            ? palette.teacherPrimary
            : tone === 'staff'
              ? palette.primaryDark
              : tone === 'admin'
                ? palette.brown
                : theme.primary;

        const activeBackground =
          isDark
            ? theme.primarySoft
            : tone === 'teacher'
              ? palette.blueStatus
              : tone === 'staff'
                ? palette.blueStatus
                : tone === 'admin'
                  ? palette.white
                  : palette.blueStatus;

        const activeStyle: ViewStyle | undefined = selected
          ? { borderColor: activeColor, backgroundColor: activeBackground }
          : { backgroundColor: theme.surface, borderColor: theme.borderInput };

        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            style={activeStyle}
            className="min-h-[44px] min-w-[96px] items-center justify-center rounded-md border px-4 active:opacity-70"
          >
            <Text
              className="text-sm font-medium"
              style={{
                color: selected ? activeColor : theme.textSecondary,
                fontWeight: selected ? '600' : '400',
              }}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
