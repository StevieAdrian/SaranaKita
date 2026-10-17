import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import loadingLogo from '@/assets/images/loading-logo.png';
import { authConstants } from '../../constants/auth-constants';

export type LoadingScreenProps = {
  message?: string;
};

export function LoadingScreen({
  message = 'Loading ...',
}: LoadingScreenProps): React.JSX.Element {
  const navigation = useNavigation<any>();
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
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <Pressable
      onPress={handleTap}
      style={styles.container}
      accessibilityRole="progressbar"
      accessibilityLabel={message}
    >
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

        <Text style={styles.messageText}>{message}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: authConstants.colors.backgroundBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  spinner: {
    width: 44,
    height: 44,
  },
  messageText: {
    ...authConstants.typography.subtitle,
    color: authConstants.colors.text.light,
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
  },
});
