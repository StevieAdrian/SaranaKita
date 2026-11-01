import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { userFonts } from '../utils/constants';

export type SelectOptionCardProps = {
  label: string;
  description?: string;
  dotColor?: string;
  selectedBg?: string;
  selectedBorder?: string;
  radioColor?: string;
  selectedTitleColor?: string;
  isSelected: boolean;
  onPress: () => void;
  accessibilityLabel?: string;
  size?: 'compact' | 'regular';
};

export function SelectOptionCard({
  label,
  description,
  dotColor,
  selectedBg,
  selectedBorder,
  radioColor = dotColor || '#2563EB',
  selectedTitleColor,
  isSelected,
  onPress,
  accessibilityLabel,
  size = 'compact',
}: SelectOptionCardProps): React.JSX.Element {
  const isRegular = size === 'regular';

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected: isSelected }}
      accessibilityLabel={accessibilityLabel || label}
      style={[
        isRegular ? styles.cardRegular : styles.cardCompact,
        isSelected
          ? [
            styles.cardSelected,
            {
              backgroundColor: selectedBg,
              borderColor: selectedBorder || radioColor,
            },
          ]
          : styles.cardUnselected,
      ]}
    >
      {dotColor ? (
        <View
          style={[
            isRegular ? styles.dotRegular : styles.dotCompact,
            { backgroundColor: dotColor },
          ]}
        />
      ) : null}

      <View style={styles.textCol}>
        <Text
          style={[
            styles.label,
            isSelected && selectedTitleColor
              ? { color: selectedTitleColor }
              : null,
          ]}
        >
          {label}
        </Text>
        {description ? (
          <Text style={styles.desc}>{description}</Text>
        ) : null}
      </View>

      <View
        style={[
          isRegular ? styles.radioOuterRegular : styles.radioOuterCompact,
          isSelected
            ? { borderColor: radioColor }
            : styles.radioOuterUnselected,
        ]}
      >
        {isSelected ? (
          <View
            style={[
              isRegular ? styles.radioInnerRegular : styles.radioInnerCompact,
              { backgroundColor: radioColor },
            ]}
          />
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardCompact: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 9,
    borderWidth: 1,
  },
  cardRegular: {
    width: '100%',
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 0.8,
  },
  cardSelected: {
    borderWidth: 1.5,
  },
  cardUnselected: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
  },
  dotCompact: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dotRegular: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 2,
  },
  textCol: {
    flex: 1,
    marginLeft: 10,
    marginRight: 8,
    justifyContent: 'center',
  },
  label: {
    fontFamily: userFonts.semiBold,
    fontSize: 14,
    lineHeight: 20,
    color: '#111827',
  },
  desc: {
    fontFamily: userFonts.regular,
    fontSize: 11,
    lineHeight: 15,
    color: '#64748B',
    marginTop: 1,
  },
  radioOuterCompact: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterRegular: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginLeft: 12,
  },
  radioOuterUnselected: {
    borderColor: '#D1D5DB',
  },
  radioInnerCompact: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
  },
  radioInnerRegular: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
