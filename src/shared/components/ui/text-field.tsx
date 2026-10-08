import React from 'react';
import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import { useTheme } from '@/shared/hooks/use-theme';
import { MIN_TOUCH_SIZE, radius, spacing } from '@/shared/theme';

export type TextFieldProps = TextInputProps & {
  label: string;
  errorText?: string;
};

export function TextField({
  label,
  errorText,
  style,
  ...rest
}: TextFieldProps): React.JSX.Element {
  const theme = useTheme();
  const hasError = Boolean(errorText);

  return (
    <View style={styles.container}>
      <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>
        {label}
      </Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={theme.colors.textMuted}
        style={[
          styles.input,
          theme.typography.body,
          {
            color: theme.colors.text,
            backgroundColor: theme.colors.surface,
            borderColor: hasError ? theme.colors.danger : theme.colors.border,
          },
          style,
        ]}
        {...rest}
      />
      {hasError ? (
        <Text
          accessibilityLiveRegion="polite"
          style={[theme.typography.caption, { color: theme.colors.danger }]}
        >
          {errorText}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  input: {
    minHeight: MIN_TOUCH_SIZE,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
  },
});
