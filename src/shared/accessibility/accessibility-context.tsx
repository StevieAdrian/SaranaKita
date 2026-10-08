import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import { AccessibilityInfo } from 'react-native';

export type AccessibilityState = {
  readonly reduceMotion: boolean;
  readonly screenReaderEnabled: boolean;
};

const AccessibilityContext = createContext<AccessibilityState>({
  reduceMotion: false,
  screenReaderEnabled: false,
});

export function AccessibilityProvider({ children }: PropsWithChildren): React.JSX.Element {
  const [reduceMotion, setReduceMotion] = useState(false);
  const [screenReaderEnabled, setScreenReaderEnabled] = useState(false);

  useEffect(() => {
    let mounted = true;

    AccessibilityInfo.isReduceMotionEnabled().then((value) => {
      if (mounted) setReduceMotion(value);
    });
    AccessibilityInfo.isScreenReaderEnabled().then((value) => {
      if (mounted) setScreenReaderEnabled(value);
    });

    const motionSub = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setReduceMotion,
    );
    const readerSub = AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      setScreenReaderEnabled,
    );

    return () => {
      mounted = false;
      motionSub.remove();
      readerSub.remove();
    };
  }, []);

  const value = useMemo<AccessibilityState>(
    () => ({ reduceMotion, screenReaderEnabled }),
    [reduceMotion, screenReaderEnabled],
  );

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility(): AccessibilityState {
  return useContext(AccessibilityContext);
}
