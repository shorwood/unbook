import { defineProject, mergeConfig } from 'vitest/config'
import sharedConfig from '../../vitest.shared'

export default mergeConfig(
  sharedConfig,
  defineProject({
    resolve: {
      alias: {
        '@': new URL('src', import.meta.url).pathname,
      },
    },
  }),
)
