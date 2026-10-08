import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';

export type OnboardingContextValue = {
  readonly completed: boolean;
  complete: () => void;
};

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: PropsWithChildren): React.JSX.Element {
  const [completed, setCompleted] = useState(false);
  const complete = useCallback(() => setCompleted(true), []);

  const value = useMemo<OnboardingContextValue>(
    () => ({ completed, complete }),
    [completed, complete],
  );

  return (
    <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>
  );
}

export function useOnboarding(): OnboardingContextValue {
  const ctx = useContext(OnboardingContext);
  if (!ctx) {
    throw new Error('useOnboarding must be used within an OnboardingProvider.');
  }
  return ctx;
}
