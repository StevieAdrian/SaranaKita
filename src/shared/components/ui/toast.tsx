import React, { useEffect, useRef } from 'react';
import { Animated, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import checkIcon from '@/assets/images/verified-checkmark.png';
import crossIcon from '@/assets/images/unverified-crossmark.png';

export type ToastProps = {
  visible: boolean;
  message: string;
  type?: 'success' | 'error';
  duration?: number;
  onDismiss?: () => void;
};

const fontMedium = 'Poppins-Medium';

export function Toast({
  visible,
  message,
  type = 'success',
  duration = 3000,
  onDismiss,
}: ToastProps): React.JSX.Element | null {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    let hideTimer: ReturnType<typeof setTimeout> | null = null;

    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();

      if (duration > 0 && onDismiss) {
        hideTimer = setTimeout(() => {
          Animated.parallel([
            Animated.timing(opacity, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(translateY, {
              toValue: -20,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start(() => {
            onDismiss();
          });
        }, duration);
      }
    } else {
      opacity.setValue(0);
      translateY.setValue(-20);
    }

    return () => {
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, [visible, duration, onDismiss, opacity, translateY]);

  if (!visible && message === '') {
    return null;
  }

  const isSuccess = type === 'success';
  const bgColor = isSuccess ? '#10B981' : '#EF4444';

  return (
    <Animated.View
      pointerEvents={visible ? 'auto' : 'none'}
      style={[
        styles.container,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onDismiss}
        style={[styles.toastCard, { backgroundColor: bgColor }]}
        accessibilityRole="alert"
        accessibilityLabel={message}
      >
        <View style={styles.iconCircle}>
          <Image
            source={isSuccess ? checkIcon : crossIcon}
            style={styles.iconImage}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.messageText} numberOfLines={2}>
          {message}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 16,
    left: 20,
    right: 20,
    zIndex: 9999,
    alignItems: 'center',
  },
  toastCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
    gap: 12,
  },
  iconCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconImage: {
    width: 12,
    height: 12,
    tintColor: '#FFFFFF',
  },
  messageText: {
    flex: 1,
    fontFamily: fontMedium,
    fontSize: 13.5,
    fontWeight: Platform.OS === 'ios' ? '500' : undefined,
    color: '#FFFFFF',
  },
});
