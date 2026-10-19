import React, { useState } from 'react';
import { Image, Platform, Pressable, StyleSheet, Text, type GestureResponderEvent } from 'react-native';
import googleLogo from '@/assets/images/google-logo.png';
import { authConstants } from '../constants/auth-constants';

export type GoogleButtonProps = {
  onPress: (e: GestureResponderEvent) => void;
  label?: string;
};

export function GoogleButton({
  onPress,
  label = 'Google',
}: GoogleButtonProps): React.JSX.Element {
  const [pressed, setPressed] = useState(false);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      accessibilityRole="button"
      accessibilityLabel={`Continue with ${label}`}
      style={[styles.button, pressed && styles.pressed]}
    >
      <Image
        source={googleLogo}
        style={styles.logo}
        resizeMode="contain"
        accessibilityElementsHidden
      />
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: authConstants.components.button.height,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: authConstants.colors.surface,
    borderRadius: authConstants.components.button.borderRadius,
    borderWidth: 0.5,
    borderColor: authConstants.colors.ui.inputBorder,
  },
  pressed: {
    opacity: 0.8,
  },
  logo: {
    width: 20,
    height: 20,
  },
  text: {
    color: authConstants.colors.text.dark,
    fontFamily: authConstants.typography.buttonText.fontFamily,
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '600' : undefined,
  },
});
