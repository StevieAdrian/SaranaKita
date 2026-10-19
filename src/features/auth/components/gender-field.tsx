import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
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

      <View style={styles.radioRow} accessibilityRole="radiogroup">
        {GENDER_OPTIONS.map((option) => {
          const selected = value === option.value;
          return (
            <Pressable
              key={option.value}
              onPress={() => onChange(option.value)}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              accessibilityLabel={option.label}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <View style={styles.radioOption}>
                <View
                  style={[
                    styles.radioCircle,
                    selected && styles.radioCircleSelected,
                  ]}
                >
                  {selected ? <View style={styles.radioDot} /> : null}
                </View>

                <Text
                  style={[
                    styles.radioLabel,
                    selected && styles.radioLabelSelected,
                  ]}
                >
                  {option.label}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>

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
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 40,
    paddingVertical: 4,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioCircle: {
    width: authConstants.components.radio.size,
    height: authConstants.components.radio.size,
    borderRadius: authConstants.components.radio.radius,
    borderWidth: 1,
    borderColor: authConstants.colors.ui.inputBorder,
    backgroundColor: authConstants.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  radioCircleSelected: {
    borderColor: authConstants.colors.ui.buttonBlack,
  },
  radioDot: {
    width: authConstants.components.radio.dotSize,
    height: authConstants.components.radio.dotSize,
    borderRadius: authConstants.components.radio.dotRadius,
    backgroundColor: authConstants.colors.ui.buttonBlack,
  },
  radioLabel: {
    fontFamily: authConstants.typography.inputText.fontFamily,
    fontSize: 14,
    color: authConstants.colors.text.secondary,
    fontWeight: '500',
  },
  radioLabelSelected: {
    color: authConstants.colors.text.dark,
    fontWeight: '500',
  },
  pressed: {
    opacity: 0.7,
  },
  errorText: {
    color: authConstants.colors.text.error,
    fontSize: 12,
    marginTop: 2,
  },
});
