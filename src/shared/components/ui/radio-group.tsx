import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { useRole } from '@/shared/context/theme-context';
import { fontFamilies, spacing } from '@/shared/theme';

export type RadioOption<T extends string = string> = {
  readonly value: T;
  readonly label: string;
  readonly description?: string;
  readonly dotColor?: string;
};

export type RadioGroupProps<T extends string = string> = {
  options: readonly RadioOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
  direction?: 'horizontal' | 'vertical';
  style?: StyleProp<ViewStyle>;
  itemStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
};

export function RadioGroup<T extends string = string>({
  options,
  value,
  onChange,
  direction = 'vertical',
  style,
  itemStyle,
  disabled = false,
}: RadioGroupProps<T>): React.JSX.Element {
  const { theme } = useRole();
  const isHorizontal = direction === 'horizontal';

  return (
    <View
      accessibilityRole="radiogroup"
      style={[
        isHorizontal ? styles.horizontalContainer : styles.verticalContainer,
        style,
      ]}
    >
      {options.map((option, index) => {
        const selected = option.value === value;
        const isLast = index === options.length - 1;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            disabled={disabled}
            accessibilityRole="radio"
            accessibilityState={{ selected, disabled }}
            accessibilityLabel={option.label}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={({ pressed }) => [
              pressed && !disabled && styles.pressed,
            ]}
          >
            <View
              style={[
                styles.optionRow,
                isHorizontal && !isLast && styles.horizontalItemSpacing,
                itemStyle,
              ]}
            >
              <View
                style={[
                  styles.radioOuter,
                  {
                    backgroundColor: theme.surface,
                    borderColor: selected ? theme.primary : theme.borderControl,
                  },
                ]}
              >
                {selected ? (
                  <View
                    style={[styles.radioInner, { backgroundColor: theme.primary }]}
                  />
                ) : null}
              </View>

              {option.dotColor ? (
                <View
                  style={[styles.dotBadge, { backgroundColor: option.dotColor }]}
                />
              ) : null}

              <View style={styles.textContainer}>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.label,
                    selected ? styles.selectedLabel : styles.unselectedLabel,
                    { color: selected ? theme.textHeading : theme.textBody },
                  ]}
                >
                  {option.label}
                </Text>
                {option.description ? (
                  <Text style={[styles.description, { color: theme.textSecondary }]}>
                    {option.description}
                  </Text>
                ) : null}
              </View>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  verticalContainer: {
    gap: spacing.md,
  },
  horizontalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  horizontalItemSpacing: {
    marginRight: spacing.lg,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 28,
  },
  pressed: {
    opacity: 0.7,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  dotBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.sm,
  },
  textContainer: {
    flexShrink: 1,
  },
  label: {
    fontFamily: fontFamilies.medium,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: Platform.OS === 'ios' ? '500' : undefined,
  },
  selectedLabel: {
    fontFamily: fontFamilies.semiBold,
    fontWeight: Platform.OS === 'ios' ? '600' : undefined,
  },
  unselectedLabel: {},
  description: {
    fontFamily: fontFamilies.regular,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 1,
  },
});
