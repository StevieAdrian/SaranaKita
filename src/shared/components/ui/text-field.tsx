import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputInstance,
  type TextInputProps,
  type TextStyle,
} from 'react-native';
import { useTheme } from '@/shared/hooks/use-theme';
import { MIN_TOUCH_SIZE, radius, spacing } from '@/shared/theme';

export type TextFieldProps = TextInputProps & {
  label: string;
  errorText?: string;
  required?: boolean;
  labelStyle?: StyleProp<TextStyle>;
  ref?: React.Ref<TextInputInstance>;
};

export function TextField({
  label,
  errorText,
  required = false,
  labelStyle,
  style,
  ref,
  ...rest
}: TextFieldProps): React.JSX.Element {
  const theme = useTheme();
  const hasError = Boolean(errorText);

  return (
    <View style={styles.container}>
      <Text
        style={[theme.typography.caption, { color: theme.colors.textMuted }, labelStyle]}
      >
        {label}
        {required ? (
          <Text style={{ color: theme.colors.danger }} accessibilityElementsHidden>
            {' *'}
          </Text>
        ) : null}
      </Text>
      <TextInput
        ref={ref}
        accessibilityLabel={required ? `${label}, wajib` : label}
        accessibilityHint={hasError ? errorText : undefined}
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
          hasError ? { borderColor: theme.colors.danger } : null,
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
