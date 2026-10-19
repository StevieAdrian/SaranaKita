import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { authConstants } from '../constants/auth-constants';

export type AuthDividerProps = {
  text?: string;
};

export function AuthDivider({ text = 'Or Continue With' }: AuthDividerProps): React.JSX.Element {
  return (
    <View style={styles.dividerRow} accessibilityElementsHidden>
      <View style={styles.dividerLine} />
      <Text style={styles.dividerText}>{text}</Text>
      <View style={styles.dividerLine} />
    </View>
  );
}

const styles = StyleSheet.create({
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    paddingHorizontal: 8,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: authConstants.colors.ui.divider,
    opacity: 0.6,
  },
  dividerText: {
    color: authConstants.colors.text.light,
    fontFamily: authConstants.typography.label.fontFamily,
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '500' : undefined,
  },
});
