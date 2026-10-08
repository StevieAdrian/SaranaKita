export type AppEnv = {
  readonly apiBaseUrl: string;
  readonly apiTimeoutMs: number;
  readonly enableDevLogging: boolean;
};

const dev: AppEnv = {
  apiBaseUrl: 'https://api.dev.saranakita.example',
  apiTimeoutMs: 15_000,
  enableDevLogging: true,
};

const prod: AppEnv = {
  apiBaseUrl: 'https://api.saranakita.example',
  apiTimeoutMs: 10_000,
  enableDevLogging: false,
};

export const Env: AppEnv = __DEV__ ? dev : prod;
