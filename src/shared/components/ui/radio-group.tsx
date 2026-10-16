import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useRole } from '@/shared/context/theme-context';
import { spacing } from '@/shared/theme';

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
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            disabled={disabled}
            accessibilityRole="radio"
            accessibilityState={{ selected, disabled }}
            accessibilityLabel={option.label}
            style={({ pressed }) => [
              styles.optionItem,
              isHorizontal && styles.horizontalItem,
              itemStyle,
              pressed && !disabled && styles.pressed,
            ]}
          >
            <View
              style={[
                styles.radioOuter,
                {
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
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  horizontalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  verticalContainer: {
    flexDirection: 'column',
    gap: spacing.md,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 40,
  },
  horizontalItem: {
    marginRight: spacing.sm,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dotBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.xs,
  },
  textContainer: {
    flexShrink: 1,
  },
  label: {
    fontSize: 15,
  },
  selectedLabel: {
    fontWeight: '600',
  },
  unselectedLabel: {
    fontWeight: '400',
  },
  description: {
    fontSize: 12,
    marginTop: 2,
  },
  pressed: {
    opacity: 0.7,
  },
});
