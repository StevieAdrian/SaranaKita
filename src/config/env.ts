import { Platform } from 'react-native';

export type AppEnv = {
  readonly apiBaseUrl: string;
  readonly apiTimeoutMs: number;
  readonly enableDevLogging: boolean;
};

const DEV_HOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

const dev: AppEnv = {
  apiBaseUrl: `http://${DEV_HOST}:3000/api`,
  apiTimeoutMs: 15_000,
  enableDevLogging: true,
};

const prod: AppEnv = {
  apiBaseUrl: 'https://api.saranakita.example/api',
  apiTimeoutMs: 10_000,
  enableDevLogging: false,
};

export const Env: AppEnv = __DEV__ ? dev : prod;
