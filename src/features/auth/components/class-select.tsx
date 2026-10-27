import React, { useState } from 'react';
import { FlatList, Image, Keyboard, Platform, StyleProp, StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import leftArrow from '@/assets/images/left-arrow.png';
import { BottomSheet } from '@/shared/components/ui/bottom-sheet';
import { KEYBOARD_DISMISS_DELAY_MS } from '@/shared/constants';
import { authConstants } from '../constants/auth-constants';
import { CLASS_OPTIONS } from '../utils/constants';

export type ClassSelectFieldProps = {
  value: string | null;
  onChange: (value: string) => void;
  errorText?: string;
  required?: boolean;
  label?: string;
  hideLabel?: boolean;
  placeholder?: string;
  sheetTitle?: string;
  primaryColor?: string;
  primarySoftColor?: string;
  highlightBgColor?: string;
  highlightBorderColor?: string;
  inputBoxStyle?: StyleProp<ViewStyle>;
  inputTextStyle?: StyleProp<TextStyle>;
  activeBadgeText?: string;
  labelStyle?: StyleProp<TextStyle>;
};

export function ClassSelectField({
  value,
  onChange,
  errorText,
  required = true,
  label = 'Kelas',
  hideLabel = false,
  placeholder = 'Pilih Kelas',
  sheetTitle = 'Pilih Kelas',
  primaryColor = authConstants.colors.brand,
  primarySoftColor,
  highlightBgColor = '#FEF3C7',
  highlightBorderColor = '#F59E0B',
  inputBoxStyle,
  inputTextStyle,
  activeBadgeText = 'Saat ini',
  labelStyle,
}: ClassSelectFieldProps): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const hasError = Boolean(errorText);

  const activeBg = highlightBgColor ?? primarySoftColor ?? '#FEF3C7';
  const activeBorder = highlightBorderColor ?? '#F59E0B';
  const radioColor = primaryColor ?? authConstants.colors.brand;

  const handleSelect = (next: string) => {
    onChange(next);
    setOpen(false);
  };

  const cleanValue = (value ?? '').trim().replace(/^kelas\s+/i, '');

  const handleOpen = () => {
    Keyboard.dismiss();
    setTimeout(() => {
      setOpen(true);
    }, KEYBOARD_DISMISS_DELAY_MS);
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
        onPress={handleOpen}
        style={[
          styles.inputBox,
          inputBoxStyle,
          hasError && styles.inputError,
        ]}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityValue={{ text: cleanValue || placeholder }}
      >
        <Text
          style={[
            styles.inputText,
            inputTextStyle,
            !cleanValue && styles.placeholderText,
          ]}
        >
          {cleanValue || placeholder}
        </Text>
        <Image
          source={leftArrow}
          style={styles.chevronIcon}
          resizeMode="contain"
          accessibilityElementsHidden
        />
      </TouchableOpacity>

      <BottomSheet
        visible={open}
        onClose={() => setOpen(false)}
        title={sheetTitle}
      >
        <FlatList
          data={CLASS_OPTIONS}
          keyExtractor={(item) => item.value}
          style={styles.listContainer}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const isSelected = item.value === value || item.value === cleanValue;
            return (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleSelect(item.value)}
                accessibilityRole="button"
                accessibilityLabel={item.label}
                accessibilityState={{ selected: isSelected }}
                style={[
                  styles.optionItem,
                  isSelected
                    ? [
                      styles.optionItemSelected,
                      {
                        backgroundColor: activeBg,
                        borderColor: activeBorder,
                      },
                    ]
                    : styles.optionItemNormal,
                ]}
              >
                <Text
                  style={[
                    styles.optionText,
                    isSelected ? styles.optionTextSelected : styles.optionTextNormal,
                  ]}
                >
                  {item.label}
                </Text>

                <View style={styles.optionRightContainer}>
                  {isSelected ? (
                    <View style={styles.currentBadge}>
                      <Text style={styles.currentBadgeText}>
                        {activeBadgeText}
                      </Text>
                    </View>
                  ) : null}

                  <View
                    style={[
                      styles.radioOuter,
                      isSelected
                        ? [styles.radioOuterSelected, { borderColor: radioColor }]
                        : styles.radioOuterNormal,
                    ]}
                  >
                    {isSelected ? (
                      <View
                        style={[
                          styles.radioInner,
                          { backgroundColor: radioColor },
                        ]}
                      />
                    ) : null}
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </BottomSheet>

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
  placeholderText: {
    color: authConstants.typography.inputPlaceholder.color,
  },
  chevronIcon: {
    width: 14,
    height: 14,
    tintColor: authConstants.colors.text.muted,
    transform: [{ rotate: '-90deg' }],
  },
  listContainer: {
    maxHeight: 460,
    width: '100%',
  },
  listContent: {
    paddingBottom: 24,
    gap: 8,
  },
  optionItem: {
    width: '100%',
    height: 48,
    paddingHorizontal: 14,
    borderRadius: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionItemNormal: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderWidth: 1,
  },
  optionItemSelected: {
    borderWidth: 1.5,
  },
  optionText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  optionTextNormal: {
    fontFamily: 'Poppins-Medium',
    fontWeight: Platform.OS === 'ios' ? '500' : undefined,
    color: '#1E2939',
  },
  optionTextSelected: {
    fontFamily: 'Poppins-SemiBold',
    fontWeight: Platform.OS === 'ios' ? '600' : undefined,
    color: '#1E2939',
  },
  optionRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  currentBadge: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 9999,
  },
  currentBadgeText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 10,
    lineHeight: 14,
    fontWeight: Platform.OS === 'ios' ? '500' : undefined,
    color: '#99A1AF',
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterNormal: {
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    backgroundColor: 'transparent',
  },
  radioOuterSelected: {
    borderWidth: 1.5,
    backgroundColor: 'transparent',
  },
  radioInner: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
  },
  errorText: {
    color: authConstants.colors.text.error,
    fontSize: 12,
    marginTop: 2,
  },
});
