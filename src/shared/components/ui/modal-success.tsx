import React from 'react';
import {
  Image,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import checkIcon from '@/assets/images/check.png';
import { palette } from '@/shared/theme';

export type ModalSuccessProps = {
  visible: boolean;
  title: string;
  message: string;
  buttonLabel?: string;
  buttonColor?: string;
  onConfirm: () => void;
};

export function ModalSuccess({
  visible,
  title,
  message,
  buttonLabel = 'OK',
  buttonColor = palette.primary,
  onConfirm,
}: ModalSuccessProps): React.JSX.Element {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onConfirm}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.successIcon}>
            <Image
              source={checkIcon}
              resizeMode="contain"
              accessibilityElementsHidden
              style={styles.checkmark}
            />
          </View>
          <Text accessibilityRole="header" style={styles.title}>
            {title}
          </Text>
          <Text style={styles.message}>{message}</Text>
          <Pressable
            onPress={onConfirm}
            accessibilityRole="button"
            accessibilityLabel={buttonLabel}
            style={[styles.button, { backgroundColor: buttonColor }]}
          >
            <Text style={styles.buttonText}>{buttonLabel}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  card: {
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: palette.white,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
  },
  successIcon: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 28,
    backgroundColor: palette.success,
    marginBottom: 16,
  },
  checkmark: {
    width: 28,
    height: 28,
    tintColor: palette.white,
  },
  title: {
    marginBottom: 8,
    color: '#0F172A',
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    fontWeight: Platform.OS === 'ios' ? '700' : undefined,
    textAlign: 'center',
  },
  message: {
    marginBottom: 22,
    color: '#64748B',
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    fontWeight: Platform.OS === 'ios' ? '400' : undefined,
    lineHeight: 20,
    textAlign: 'center',
  },
  button: {
    minHeight: 48,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    paddingHorizontal: 16,
  },
  buttonText: {
    color: palette.white,
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '600' : undefined,
  },
});
