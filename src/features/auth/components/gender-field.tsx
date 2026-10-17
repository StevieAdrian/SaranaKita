import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RadioGroup } from '@/shared/components/ui/radio-group';
import { authConstants } from '../constants/auth-constants';
import { GENDER_OPTIONS } from '../utils/constants';
import type { Gender } from '../types';

export type GenderRadioFieldProps = {
  value: Gender | null;
  onChange: (value: Gender) => void;
  errorText?: string;
  required?: boolean;
};

export function GenderRadioField({
  value,
  onChange,
  errorText,
  required = true,
}: GenderRadioFieldProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Gender
        {required ? <Text style={styles.requiredAsterisk}> *</Text> : null}
      </Text>

      <RadioGroup<Gender>
        options={GENDER_OPTIONS}
        value={value}
        onChange={onChange}
        direction="horizontal"
        style={styles.radioGroup}
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
  radioGroup: {
    paddingVertical: 4,
    gap: 32,
  },
  errorText: {
    color: authConstants.colors.text.error,
    fontSize: 12,
    marginTop: 2,
  },
});
