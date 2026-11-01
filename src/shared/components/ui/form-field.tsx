import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRole } from '@/shared/context/theme-context';

const fontMedium = 'Poppins-Medium';
const fontRegular = 'Poppins-Regular';

export type FormFieldProps = {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
};

export function FormField({
  label,
  required = false,
  error,
  children,
}: FormFieldProps): React.JSX.Element {
  const { theme } = useRole();

  return (
    <View style={styles.container} className="gap-2">
      <Text style={[styles.label, { color: theme.textHeading }]} className="text-base">
        {label}
        {required ? <Text style={[styles.asterisk, { color: theme.danger }]}> *</Text> : null}
      </Text>
      {children}
      {error ? (
        <Text accessibilityLiveRegion="polite" style={[styles.error, { color: theme.danger }]} className="text-sm">
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  label: {
    fontFamily: fontMedium,
    fontSize: 16,
    lineHeight: 22,
  },
  asterisk: {
    fontFamily: fontMedium,
    fontSize: 16,
  },
  error: {
    fontFamily: fontRegular,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2,
  },
});
