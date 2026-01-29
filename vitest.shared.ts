import { availableParallelism } from 'node:os'
import { defineConfig } from 'vitest/config'

const exclude = [
  '**/node_modules/**',
  '**/index.ts',
  '**/dist',
  '**/*.d.ts',
]

export default defineConfig({
  test: {
    exclude,
    watch: true,
    globals: true,
    include: ['./src/**/*.test.ts'],
    reporters: [['default', { summary: false }]],
    setupFiles: new URL('vitest.setup.ts', import.meta.url).pathname,
    testTimeout: 500,
    isolate: true,

    // --- Worker pool configuration.
    pool: 'forks',
    maxConcurrency: availableParallelism(),
    // poolOptions: {
    //   forks: {
    //     maxForks: availableParallelism(),
    //     minForks: availableParallelism(),
    //   },
    // },

    // --- Benchmark configuration.
    benchmark: {
      exclude,
      outputFile: './benchmark/results.json',
      reporters: ['verbose'],
    },

    // --- V8 coverage configuration.
    coverage: {
      clean: true,
      cleanOnRerun: true,
      enabled: false,
      reporter: ['lcovonly', 'html-spa', 'text'],
      reportOnFailure: true,
      reportsDirectory: '.coverage',
    },

    // --- Type-checking configuration.
    typecheck: {
      checker: 'tsc',
      enabled: false,
      exclude,
      ignoreSourceErrors: true,
    },
  },
})
