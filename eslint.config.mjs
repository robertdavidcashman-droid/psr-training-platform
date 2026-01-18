import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';

const config = [
  // Next 16 ships `eslint-config-next` as a flat config (ESLint v9+).
  ...nextCoreWebVitals,
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'backup-Main-PC-files/**',
      'psr-training-academy/**',
      'coverage/**',
      'test-results/**',
    ],
  },
  {
    // This repo contains lots of static copy pages and common UI patterns.
    // Keep lint signal high by disabling noisy rules that would otherwise
    // fail builds for content and benign effect usage.
    rules: {
      'react/no-unescaped-entities': 'off',
      'react-hooks/exhaustive-deps': 'off',
      'react-hooks/set-state-in-effect': 'off',
    },
  },
];

export default config;

