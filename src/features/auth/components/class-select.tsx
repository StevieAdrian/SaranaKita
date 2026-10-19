import React, { useState } from 'react';
import { FlatList, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import checkIcon from '@/assets/images/check.png';
import leftArrow from '@/assets/images/left-arrow.png';
import { BottomSheet } from '@/shared/components/ui/bottom-sheet';
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
  const [open, setOpen] = useState(false);
  const hasError = Boolean(errorText);

  const handleSelect = (next: string) => {
    onChange(next);
    setOpen(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Class
        {required ? <Text style={styles.requiredAsterisk}> *</Text> : null}
      </Text>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setOpen(true)}
        style={[
          styles.inputBox,
          hasError && styles.inputError,
        ]}
        accessibilityRole="button"
        accessibilityLabel="Class"
        accessibilityValue={{ text: value ?? 'Pilih Kelas' }}
      >
        <Text style={[styles.inputText, !value && styles.placeholderText]}>
          {value || 'Pilih Kelas'}
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
        title="Pilih Kelas"
      >
        <FlatList
          data={CLASS_OPTIONS}
          keyExtractor={(item) => item.value}
          style={styles.listContainer}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const isSelected = item.value === value;
            return (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleSelect(item.value)}
                accessibilityRole="button"
                accessibilityLabel={item.label}
                accessibilityState={{ selected: isSelected }}
                style={[
                  styles.optionItem,
                  isSelected ? styles.optionItemSelected : styles.optionItemNormal,
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
                {isSelected ? (
                  <Image
                    source={checkIcon}
                    style={styles.checkIcon}
                    resizeMode="contain"
                    accessibilityElementsHidden
                  />
                ) : null}
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
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
  },
  optionItemNormal: {
    backgroundColor: authConstants.colors.surface,
    borderColor: authConstants.colors.ui.optionBorder,
  },
  optionItemSelected: {
    backgroundColor: authConstants.colors.ui.optionSelectedBg,
    borderColor: authConstants.colors.brand,
    borderWidth: 1.5,
  },
  optionText: {
    fontSize: 14,
    lineHeight: 21,
    fontFamily: authConstants.typography.inputText.fontFamily,
  },
  optionTextNormal: {
    color: authConstants.colors.text.navyText,
    fontWeight: Platform.OS === 'ios' ? '400' : undefined,
  },
  optionTextSelected: {
    color: authConstants.colors.brand,
    fontFamily: authConstants.typography.buttonText.fontFamily,
    fontWeight: Platform.OS === 'ios' ? '600' : undefined,
  },
  checkIcon: {
    width: 18,
    height: 18,
    tintColor: authConstants.colors.brand,
  },
  errorText: {
    color: authConstants.colors.text.error,
    fontSize: 12,
    marginTop: 2,
  },
});
