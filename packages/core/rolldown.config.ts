import { defineConfig } from 'rolldown'
import { dts } from 'rolldown-plugin-dts'

export default defineConfig([
  {
    input: {
      'index': './src/index.ts',
      'entities/index': './src/entities/index.ts',
      'shorthands/index': './src/shorthands/index.ts',
      'types/index': './src/types/index.ts',
    },
    output: {
      dir: './dist',
      format: 'esm',
      entryFileNames: '[name].js',
    },
    platform: 'browser',
    external: [
      'mdast-util-from-markdown',
      'mdast-util-gfm-strikethrough',
      'micromark-extension-gfm-strikethrough',
    ],
    plugins: [
      dts({ resolver: 'oxc' }),
    ],
  },
  {
    input: {
      'index': './src/index.ts',
      'entities/index': './src/entities/index.ts',
      'shorthands/index': './src/shorthands/index.ts',
      'types/index': './src/types/index.ts',
    },
    platform: 'node',
    external: [
      'mdast-util-from-markdown',
      'mdast-util-gfm-strikethrough',
      'micromark-extension-gfm-strikethrough',
    ],
    output: {
      dir: './dist',
      format: 'cjs',
      entryFileNames: '[name].cjs',
      chunkFileNames: '[name]-[hash].cjs',
    },
  },
])
