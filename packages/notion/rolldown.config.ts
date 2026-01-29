import { defineConfig } from 'rolldown'
import { dts } from 'rolldown-plugin-dts'

export default defineConfig([
  {
    input: {
      index: './src/index.ts',
    },
    output: {
      dir: './dist',
      format: 'esm',
      entryFileNames: '[name].js',
    },
    platform: 'browser',
    external: ['zod'],
    plugins: [
      dts({ resolver: 'oxc' }),
    ],
  },
  {
    input: {
      index: './src/index.ts',
    },
    platform: 'node',
    external: ['zod'],
    output: {
      dir: './dist',
      format: 'cjs',
      entryFileNames: '[name].cjs',
      chunkFileNames: '[name]-[hash].cjs',
    },
  },
])
