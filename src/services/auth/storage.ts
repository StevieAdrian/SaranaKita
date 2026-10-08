import * as Keychain from 'react-native-keychain';
import type { AuthTokens } from './types';

const SERVICE = 'com.saranakita.auth';
const ACCESS_KEY = 'access';

export async function saveTokens(tokens: AuthTokens): Promise<void> {
  await Keychain.setGenericPassword(ACCESS_KEY, JSON.stringify(tokens), {
    service: SERVICE,
    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
}

export async function loadTokens(): Promise<AuthTokens | null> {
  const credentials = await Keychain.getGenericPassword({ service: SERVICE });
  if (!credentials) {
    return null;
  }
  try {
    return JSON.parse(credentials.password) as AuthTokens;
  } catch {
    return null;
  }
}

export async function clearTokens(): Promise<void> {
  await Keychain.resetGenericPassword({ service: SERVICE });
}
