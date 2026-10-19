import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Select } from '@/shared/components/ui/select';
import { authConstants } from '../constants/auth-constants';
import { CLASS_OPTIONS } from '../utils/constants';

export type ClassSelectFieldProps = {
  value: string | null;
  onChange: (value: string) => void;
  errorText?: string;
  required?: boolean;
};

export function ClassSelectField({
  value,
  onChange,
  errorText,
  required = true,
}: ClassSelectFieldProps): React.JSX.Element {
  const hasError = Boolean(errorText);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Class
        {required ? <Text style={styles.requiredAsterisk}> *</Text> : null}
      </Text>

      <Select
        value={value}
        options={CLASS_OPTIONS}
        onChange={onChange}
        placeholder="Pilih Kelas"
        sheetTitle="Pilih Kelas"
        hasError={hasError}
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
