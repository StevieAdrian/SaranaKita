module.exports = {
  root: true,
  extends: ['@react-native', 'plugin:import/recommended', 'plugin:import/typescript'],
  plugins: ['import'],
  settings: {
    'import/resolver': {
      typescript: {
        project: './tsconfig.json',
      },
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  rules: {
    // Enforce the one-directional dependency graph between layers.
    'import/no-restricted-paths': [
      'error',
      {
        zones: [
          // services: pure data access, no React / app layers
          {
            target: './src/services',
            from: [
              './src/features',
              './src/shared',
              './src/navigation',
              './src/providers',
            ],
          },
          // shared: generic/reusable, must be project-portable
          {
            target: './src/shared',
            from: [
              './src/features',
              './src/services',
              './src/navigation',
              './src/providers',
            ],
          },
          // features: may not reach up into app shell
          {
            target: './src/features',
            from: ['./src/navigation', './src/providers'],
          },
          // per-feature isolation: a feature may not import a sibling feature
          {
            target: './src/features/auth',
            from: './src/features',
            except: ['./auth'],
          },
          {
            target: './src/features/home',
            from: './src/features',
            except: ['./home'],
          },
        ],
      },
    ],
    // Features must be consumed only via their barrel (@/features/<name>).
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['@/features/*/*', '@/features/*/**'],
            message: 'Import a feature only through its barrel: @/features/<name>.',
          },
        ],
      },
    ],
  },
};
