import React, { useState } from 'react';
import { Image, Keyboard, Platform, Pressable, Text } from 'react-native';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import calendarSignupLogo from '@/assets/images/calender-signup-logo.png';
import { KEYBOARD_DISMISS_DELAY_MS } from '@/shared/constants';
import { fontFamilies } from '@/shared/theme';
import { formatDisplayDate } from '@/shared/utils/date';
import { useRole } from '@/shared/context/theme-context';
import { BottomSheet } from './bottom-sheet';
import { Button } from './button';

export type DatePickerProps = {
  value: Date;
  onChange: (date: Date) => void;
  minimumDate?: Date;
  maximumDate?: Date;
  accessibilityLabel?: string;
  hasError?: boolean;
};

export function DatePicker({
  value,
  onChange,
  minimumDate,
  maximumDate,
  accessibilityLabel,
  hasError = false,
}: DatePickerProps): React.JSX.Element {
  const { theme, scheme } = useRole();
  const [iosOpen, setIosOpen] = useState(false);
  const [draft, setDraft] = useState(value);
  const display = formatDisplayDate(value);

  const open = () => {
    Keyboard.dismiss();
    setTimeout(() => {
      const safeDate =
        value instanceof Date && !isNaN(value.getTime())
          ? value
          : new Date();

      if (Platform.OS === 'android') {
        try {
          DateTimePickerAndroid.open({
            value: safeDate,
            mode: 'date',
            minimumDate,
            maximumDate,
            positiveButton: { label: 'OK', textColor: theme.primary },
            negativeButton: { label: 'Batal', textColor: theme.textSecondary },
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
          console.warn('DateTimePicker error:', err);
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
    <>
      <Pressable
        onPress={open}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityValue={{ text: display }}
        style={{
          backgroundColor: theme.surfaceInput,
          borderColor: hasError ? theme.danger : theme.borderInput,
        }}
        className="h-12 flex-row items-center rounded-lg border px-4 active:opacity-70"
      >
        <Text
          numberOfLines={1}
          style={{ fontFamily: fontFamilies.regular, fontSize: 14, color: theme.textInput }}
          className="flex-1"
        >
          {display}
        </Text>
        <Image
          source={calendarSignupLogo}
          resizeMode="contain"
          style={{ width: 14, height: 16, tintColor: theme.iconMuted }}
        />
      </Pressable>

      {Platform.OS === 'ios' ? (
        <BottomSheet visible={iosOpen} onClose={() => setIosOpen(false)}>
          <DateTimePicker
            value={draft}
            mode="date"
            display="inline"
            minimumDate={minimumDate}
            maximumDate={maximumDate}
            themeVariant={scheme}
            onChange={(_event, date) => {
              if (date) {
                setDraft(date);
              }
            }}
          />
          <Button
            title="Pilih"
            onPress={confirmIos}
            style={{ backgroundColor: theme.primary }}
          />
        </BottomSheet>
      ) : null}
    </>
  );
}
