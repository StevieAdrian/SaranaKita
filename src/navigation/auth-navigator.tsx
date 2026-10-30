import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SplashScreen, LoadingScreen, NotFoundScreen } from '@/features/auth/screens/transitions';
import { LoginScreen } from '@/features/auth/screens/login-screen';
import { RegisterScreen } from '@/features/auth/screens/register-screen';
import { RegisterProfileScreen } from '@/features/auth/screens/register-profile-screen';
import { OtpScreen } from '@/features/auth/screens/otp-screen';
import { ForgotPasswordScreen } from '@/features/auth/screens/forgot-password-screen';
import { ResetPasswordScreen } from '@/features/auth/screens/reset-password-screen';
import type { AuthStackParamList } from './types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthNavigator(): React.JSX.Element {
  return (
    <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} options={{ animation: 'fade' }} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ animation: 'fade' }} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="SignUp" component={RegisterScreen} />
      <Stack.Screen name="RegisterProfile" component={RegisterProfileScreen} />
      <Stack.Screen name="OtpVerification" component={OtpScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      <Stack.Screen name="Loading" component={LoadingScreen} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} />
    </Stack.Navigator>
  );
}
