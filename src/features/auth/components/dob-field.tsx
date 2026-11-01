import React, { useState } from 'react';
import { Image, Keyboard, Platform, StyleSheet, Text, TouchableOpacity, View, type StyleProp, type TextStyle } from 'react-native';
import DateTimePicker, {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import calendarSignupLogo from '@/assets/images/calender-signup-logo.png';
import { BottomSheet } from '@/shared/components/ui/bottom-sheet';
import { Button } from '@/shared/components/ui/button';
import { KEYBOARD_DISMISS_DELAY_MS } from '@/shared/constants';
import { formatDisplayDate, getDefaultDateOfBirth } from '@/shared/utils/date';
import { authConstants } from '../constants/auth-constants';

export type DateOfBirthFieldProps = {
  value: Date;
  onChange: (date: Date) => void;
  errorText?: string;
  required?: boolean;
  label?: string;
  hideLabel?: boolean;
  labelStyle?: StyleProp<TextStyle>;
};

export function DateOfBirthField({
  value,
  onChange,
  errorText,
  required = true,
  label = 'Tanggal Lahir',
  hideLabel = false,
  labelStyle,
}: DateOfBirthFieldProps): React.JSX.Element {
  const [iosOpen, setIosOpen] = useState(false);
  const [draft, setDraft] = useState(value);
  const hasError = Boolean(errorText);
  const display = formatDisplayDate(value);

  const openPicker = () => {
    Keyboard.dismiss();
    setTimeout(() => {
      const safeDate =
        value instanceof Date && !isNaN(value.getTime())
          ? value
          : getDefaultDateOfBirth();

      if (Platform.OS === 'android') {
        try {
          DateTimePickerAndroid.open({
            value: safeDate,
            mode: 'date',
            maximumDate: new Date(),
            positiveButton: { label: 'OK', textColor: authConstants.colors.brand },
            negativeButton: { label: 'Batal', textColor: authConstants.colors.brand },
            onValueChange: (_event, date) => {
              if (date) {
                onChange(date);
              }
            },
            onChange: (_event, date) => {
              if (date) {
                onChange(date);
              }
            },
          });
        } catch (err) {
          console.warn('Gagal membuka component date picker:', err);
        }
        return;
      }
      setDraft(safeDate);
      setIosOpen(true);
    }, KEYBOARD_DISMISS_DELAY_MS);
  };

  const confirmIos = () => {
    onChange(draft);
    setIosOpen(false);
  };

  return (
    <View style={styles.container}>
      {!hideLabel ? (
        <Text style={[styles.label, labelStyle]}>
          {label}
          {required ? <Text style={styles.requiredAsterisk}> *</Text> : null}
        </Text>
      ) : null}

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={openPicker}
        style={[
          styles.inputBox,
          hasError && styles.inputError,
        ]}
        accessibilityRole="button"
        accessibilityLabel="Tanggal Lahir"
        accessibilityValue={{ text: display }}
      >
        <Text style={styles.inputText}>{display}</Text>
        <Image
          source={calendarSignupLogo}
          style={styles.calendarIcon}
          resizeMode="contain"
          accessibilityElementsHidden
        />
      </TouchableOpacity>

      {Platform.OS === 'ios' ? (
        <BottomSheet visible={iosOpen} onClose={() => setIosOpen(false)}>
          <DateTimePicker
            value={draft}
            mode="date"
            display="inline"
            maximumDate={new Date()}
            accentColor={authConstants.colors.brand}
            onChange={(_event, date) => {
              if (date) setDraft(date);
            }}
          />
          <Button title="Pilih" onPress={confirmIos} />
        </BottomSheet>
      ) : null}

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
  inputBox: {
    height: authConstants.components.input.height,
    borderRadius: authConstants.components.input.borderRadius,
    borderWidth: authConstants.components.input.borderWidth,
    borderColor: authConstants.colors.ui.inputBorderLight,
    backgroundColor: authConstants.colors.surface,
    paddingHorizontal: authConstants.components.input.paddingHorizontal,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  inputError: {
    borderColor: authConstants.colors.text.error,
  },
  inputText: {
    fontFamily: authConstants.typography.inputText.fontFamily,
    fontSize: 14,
    color: authConstants.colors.text.dark,
  },
  calendarIcon: {
    width: 14,
    height: 16,
    tintColor: authConstants.colors.text.muted,
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
