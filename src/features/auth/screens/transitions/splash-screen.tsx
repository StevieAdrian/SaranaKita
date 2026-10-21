import React, { useCallback, useEffect, useRef } from 'react';
import { Animated, Dimensions, Image, Pressable, StatusBar, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import logoBlue from '@/assets/images/logo-saranakita-blue.png';
import splashGradient from '@/assets/images/splash-bg-gradient.png';
import { authConstants } from '../../constants/auth-constants';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('screen');
const LOGO_WIDTH = 206;
const LOGO_HEIGHT = 44;
const SPLASH_DURATION_MS = 2000;

export function SplashScreen(): React.JSX.Element {
  const navigation = useNavigation<any>();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isNavigatingRef = useRef(false);

  const navigateNext = useCallback(() => {
    if (isNavigatingRef.current) return;
    isNavigatingRef.current = true;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.96,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start(() => {
      navigation.replace('Login');
    });
  }, [navigation, fadeAnim, scaleAnim]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 7,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    timerRef.current = setTimeout(navigateNext, SPLASH_DURATION_MS);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [fadeAnim, scaleAnim, navigateNext]);

  return (
    <Pressable
      style={styles.container}
      onPress={navigateNext}
      accessibilityRole="button"
      accessibilityLabel="Lanjut ke halaman masuk"
    >
      <StatusBar barStyle="dark-content" />
      <Image
        source={splashGradient}
        style={styles.backgroundImage}
        resizeMode="cover"
        accessibilityElementsHidden
      />

      {/* Animation */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Image
          source={logoBlue}
          style={styles.logo}
          resizeMode="contain"
          accessibilityRole="image"
          accessibilityLabel="SaranaKita Logo"
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: authConstants.colors.backgroundSplash,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    minWidth: SCREEN_WIDTH,
    minHeight: SCREEN_HEIGHT,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    marginTop: -SCREEN_HEIGHT * 0.05,
  },
  logo: {
    width: LOGO_WIDTH,
    height: LOGO_HEIGHT,
  },
});
