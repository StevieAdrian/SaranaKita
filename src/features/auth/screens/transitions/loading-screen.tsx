import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Image, Platform, Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';
import loadingLogo from '@/assets/images/loading-logo.png';
import { authConstants } from '../../constants/auth-constants';

export type LoadingScreenProps = {
  navigation?: any;
  route?: any;
  message?: string;
};

export function LoadingScreen({
  navigation,
  route,
  message = 'Loading....',
}: LoadingScreenProps): React.JSX.Element {
  const displayMessage = route?.params?.message ?? message;
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();

    return () => loop.stop();
  }, [spinAnim]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const handleTap = () => {
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
    }
  };

  return (
    <Pressable
      onPress={handleTap}
      style={styles.container}
      accessibilityRole="progressbar"
      accessibilityLabel={displayMessage}
    >
      <StatusBar barStyle="light-content" />
      <View style={styles.centerContent} pointerEvents="none">
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <Image
            source={loadingLogo}
            style={styles.spinner}
            resizeMode="contain"
            accessibilityRole="image"
            accessibilityLabel="Loading indicator"
          />
        </Animated.View>

        <Text style={styles.messageText}>{displayMessage}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: authConstants.colors.brand,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 21,
  },
  spinner: {
    width: 62,
    height: 62,
  },
  messageText: {
    fontFamily: authConstants.typography.buttonText.fontFamily,
    fontSize: 16,
    fontWeight: Platform.OS === 'ios' ? '600' : undefined,
    lineHeight: 20,
    color: authConstants.colors.text.light,
    textAlign: 'center',
  },
});
