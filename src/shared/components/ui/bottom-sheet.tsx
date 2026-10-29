import React, { useEffect, useRef } from 'react';
import { Animated, Modal, PanResponder, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fontFamilies } from '@/shared/theme';
import { useRole } from '@/shared/context/theme-context';

export type BottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
};

export function BottomSheet({
  visible,
  onClose,
  title,
  children,
}: BottomSheetProps): React.JSX.Element {
  const { theme } = useRole();
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(0)).current;
  const canDismissRef = useRef(false);

  useEffect(() => {
    if (visible) {
      translateY.setValue(0);
      canDismissRef.current = false;
      const timer = setTimeout(() => {
        canDismissRef.current = true;
      }, 250);
      return () => clearTimeout(timer);
    } else {
      canDismissRef.current = false;
    }
  }, [visible, translateY]);

  const handleBackdropPress = () => {
    if (canDismissRef.current) {
      onClose();
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_evt, gestureState) => {
        return gestureState.dy > 5;
      },
      onPanResponderMove: (_evt, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_evt, gestureState) => {
        if (gestureState.dy > 50 || gestureState.vy > 0.3) {
          Animated.timing(translateY, {
            toValue: 500,
            duration: 180,
            useNativeDriver: true,
          }).start(() => {
            onClose();
          });
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            bounciness: 4,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable
          style={styles.backdrop}
          onPress={handleBackdropPress}
          accessibilityRole="button"
          accessibilityLabel="Tutup"
        />
        <Animated.View
          style={[
            styles.sheet,
            {
              backgroundColor: theme.surface,
              shadowColor: theme.shadowColor,
              paddingBottom: Math.max(insets.bottom, 16) + 12,
              transform: [{ translateY }],
            },
          ]}
        >
          <View {...panResponder.panHandlers} style={styles.header}>
            <View style={styles.handleContainer}>
              <View style={[styles.handleBar, { backgroundColor: theme.borderControl }]} />
            </View>
            {title ? (
              <View style={styles.titleContainer}>
                <Text style={[styles.titleText, { color: theme.textHeading }]}>
                  {title}
                </Text>
              </View>
            ) : null}
          </View>
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  sheet: {
    maxHeight: '85%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
    zIndex: 10,
  },
  header: {
    width: '100%',
    alignItems: 'center',
  },
  handleContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 12,
    paddingBottom: 4,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 99,
  },
  titleContainer: {
    width: '100%',
    alignItems: 'flex-start',
    paddingTop: 12,
    paddingHorizontal: 8,
    paddingBottom: 14,
  },
  titleText: {
    fontFamily: fontFamilies.bold,
    fontSize: 18,
    lineHeight: 27,
    fontWeight: Platform.OS === 'ios' ? '700' : undefined,
    textAlign: 'left',
  },
});
