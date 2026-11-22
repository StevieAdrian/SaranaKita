import { PermissionsAndroid, Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import {
  registerFcmDeviceToken,
  removeFcmDeviceToken,
} from './notifications.api';

async function requestPermission(): Promise<boolean> {
  if (Platform.OS === 'android') {
    if (Number(Platform.Version) < 33) return true;

    // Ask for this from a user-initiated notification setting, not during
    // application startup. Starting an Android permission flow while React is
    // mounting can prevent the first screen from being committed.
    return PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
  }

  const status = await messaging().requestPermission();
  return (
    status === messaging.AuthorizationStatus.AUTHORIZED ||
    status === messaging.AuthorizationStatus.PROVISIONAL
  );
}

export async function requestPushNotificationsPermission(): Promise<boolean> {
  if (Platform.OS !== 'android' || Number(Platform.Version) < 33) {
    return requestPermission();
  }

  const result = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
  );
  return result === PermissionsAndroid.RESULTS.GRANTED;
}

async function registerCurrentToken(): Promise<void> {
  const token = await messaging().getToken();
  if (token) await registerFcmDeviceToken(token);
}

export async function startPushNotifications(): Promise<() => void> {
  try {
    if (!(await requestPermission())) return () => {};
    await registerCurrentToken();
    return messaging().onTokenRefresh(token => {
      registerFcmDeviceToken(token).catch(() => undefined);
    });
  } catch {
    return () => {};
  }
}

export async function unregisterPushNotifications(): Promise<void> {
  try {
    const token = await messaging().getToken();
    if (token) await removeFcmDeviceToken(token);
  } catch {}
}
