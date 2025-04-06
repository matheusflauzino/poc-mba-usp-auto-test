/* eslint-disable prettier/prettier */
/// <reference types="vitest" />
import { defineConfig } from 'vite';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    globals: true,
    include: ['**/*.spec.ts', '**/*.test.ts'],
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache'],
    coverage: {
      provider: 'v8',
      reportsDirectory: './tests/unit/coverage',
      exclude: [
        '**/infra/db/migrations.ts',
        '**/tasks/*',
        '**/*.dto.ts',
        '**/infra/config/**',
        '**/infra/tools/**',
        '**/index.ts',
        '**/output-port.ts',
        '**/*.gateway.ts',
        '**/infra/db/index.ts',
        '**/infra/db/models/**',
        '**/infra/db/migrations/**',
        '**/infra/db/seeders/**',
        '**/adapters/**/dtos/**',
        '**/shared/errors.ts',
        '**/shared/constants.ts',
        '**/infra/server/router.ts',
        '**/infra/server/routes/**',
        '**/infra/server/@types/**',
        '**/infra/queue/**',
        '**/infra/injections/**',
        '**/entities/shared/**',
        '**/tests/**',
        '**/dist/**',
        '**/docs/**',
        '**/node_modules/**',
        '**/vite.config.ts'
      ],
      reporter: ['html', 'text', 'text-summary', 'json-summary']
    },
    poolOptions: {
      threads: {
        useAtomics: true,
        singleThread: true
      }
    }
  },
  resolve: {
    alias: {
      '@infra': path.resolve(__dirname, './src/infra'),
      '@adapters': path.resolve(__dirname, './src/adapters'),
      '@useCases': path.resolve(__dirname, './src/use-cases'),
      '@entities': path.resolve(__dirname, './src/entities'),
      '@shared': path.resolve(__dirname, './src/shared')
    }
  }
});
