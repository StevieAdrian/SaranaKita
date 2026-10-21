import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

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
  return (
    <View className="gap-2">
      <Text style={styles.label} className="text-base text-gray-900">
        {label}
        {required ? <Text style={styles.asterisk}> *</Text> : null}
      </Text>
      {children}
      {error ? (
        <Text accessibilityLiveRegion="polite" style={styles.error} className="text-sm">
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontFamily: fontMedium,
  },
  asterisk: {
    fontFamily: fontMedium,
    color: '#EF4444',
  },
  error: {
    fontFamily: fontRegular,
    color: '#EF4444',
  },
});
