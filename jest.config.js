export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/client/setupTests.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/client/$1',
  },
  transform: {
    '^.+\\.tsx?$': ['@swc/jest', {
      jsc: {
        transform: {
          react: {
            runtime: 'automatic',
          },
        },
      },
    }],
  },
  testMatch: ['**/__tests__/**/*.test.{ts,tsx}', '**/?(*.)+(spec|test).{ts,tsx}'],
  collectCoverageFrom: [
    'src/client/**/*.{ts,tsx}',
    '!src/client/**/*.d.ts',
    '!src/client/main.tsx',
    '!src/client/vite-env.d.ts',
  ],
};
