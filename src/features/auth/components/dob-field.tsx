import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { DatePicker } from '@/shared/components/ui/date-picker';
import { authConstants } from '../constants/auth-constants';

export type DateOfBirthFieldProps = {
  value: Date;
  onChange: (date: Date) => void;
  errorText?: string;
  required?: boolean;
};

export function DateOfBirthField({
  value,
  onChange,
  errorText,
  required = true,
}: DateOfBirthFieldProps): React.JSX.Element {
  const hasError = Boolean(errorText);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Date of Birth
        {required ? <Text style={styles.requiredAsterisk}> *</Text> : null}
      </Text>

      <DatePicker
        value={value}
        onChange={onChange}
        maximumDate={new Date()}
        hasError={hasError}
        accessibilityLabel="Date of Birth"
      />

      {errorText ? (
        <Text style={styles.errorText} accessibilityLiveRegion="polite">
          {errorText}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: authConstants.spacing.labelToInput,
  },
  label: {
    ...authConstants.typography.label,
  },
  requiredAsterisk: {
    color: authConstants.colors.text.error,
  },
  errorText: {
    color: authConstants.colors.text.error,
    fontSize: 12,
    marginTop: 2,
  },
});
