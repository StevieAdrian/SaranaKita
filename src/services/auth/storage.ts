import * as Keychain from 'react-native-keychain';
import type { AuthTokens, AuthUser } from './types';

const SERVICE = 'com.saranakita.auth';
const ACCESS_KEY = 'access';
const USER_SERVICE = 'com.saranakita.auth.user';
const USER_KEY = 'cached_user';

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

export async function saveCachedUser(user: AuthUser): Promise<void> {
  try {
    await Keychain.setGenericPassword(USER_KEY, JSON.stringify(user), {
      service: USER_SERVICE,
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });
  } catch { }
}

export async function loadCachedUser(): Promise<AuthUser | null> {
  try {
    const credentials = await Keychain.getGenericPassword({ service: USER_SERVICE });
    if (!credentials) {
      return null;
    }
    return JSON.parse(credentials.password) as AuthUser;
  } catch {
    return null;
  }
}

export async function clearTokens(): Promise<void> {
  await Keychain.resetGenericPassword({ service: SERVICE });
  try {
    await Keychain.resetGenericPassword({ service: USER_SERVICE });
  } catch { }
}
