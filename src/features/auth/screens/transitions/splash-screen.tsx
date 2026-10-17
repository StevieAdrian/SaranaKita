import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Animated, Dimensions, Image, Pressable, StyleSheet, View, } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import logoBlue from '@/assets/images/logo-saranakita-blue.png';
import { authConstants } from '../../constants/auth-constants';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const LOGO_WIDTH = 220;
const LOGO_HEIGHT = Math.round((LOGO_WIDTH * 48) / 220);
const SPLASH_DURATION_MS = 2200;
const GRADIENT_STEPS = 28;

function interpolateColor(t: number): string {
  const r = Math.round(255 + (37 - 255) * t);
  const g = Math.round(255 + (99 - 255) * t);
  const b = Math.round(255 + (235 - 255) * t);
  return `rgb(${r}, ${g}, ${b})`;
}

export function SplashScreen(): React.JSX.Element {
  const navigation = useNavigation<any>();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const gradientBands = useMemo(() => {
    return Array.from({ length: GRADIENT_STEPS }, (_, index) => {
      const progress = Math.pow((index + 1) / GRADIENT_STEPS, 1.35);
      return interpolateColor(progress);
    });
  }, []);

  const navigateNext = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    navigation.replace('Login');
  }, [navigation]);

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
      <View style={styles.gradientContainer} pointerEvents="none">
        <View style={styles.topWhiteArea} />
        <View style={styles.gradientArea}>
          {gradientBands.map((color, idx) => (
            <View
              key={idx}
              style={[styles.gradientBand, { backgroundColor: color }]}
            />
          ))}
        </View>
      </View>

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
  gradientContainer: {
    ...StyleSheet.absoluteFill,
  },
  topWhiteArea: {
    flex: 1.1,
    backgroundColor: authConstants.colors.backgroundSplash,
  },
  gradientArea: {
    flex: 1.4,
  },
  gradientBand: {
    flex: 1,
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
