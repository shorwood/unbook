export default defineNuxtConfig({
  extends: ['docus'],

  css: ['~/assets/css/main.css'],
  modules: ['@nuxt/devtools', 'nuxt-studio'],

  studio: {
    // Studio admin route (default: '/_studio')
    route: '/_studio',

    // Git repository configuration (owner and repo are required)
    repository: {
      provider: 'github', // 'github' or 'gitlab'
      owner: 'shorwood', // your GitHub/GitLab username or organization
      repo: 'unbook', // your repository name
      branch: 'main', // the branch to commit to (default: main)
    },
  },

  site: {
    url: 'https://unbook.dev',
    name: 'Unbook',
    description: 'A unified API for knowledge management platforms',
  },

  fonts: {
    families: [
      {
        name: 'IBM Plex Sans',
        provider: 'google',
        weights: [400, 500, 600, 700],
      },
      {
        name: 'JetBrains Mono',
        provider: 'google',
        weights: [400, 500],
      },
    ],
    defaults: {
      weights: [400, 500, 600, 700],
    },
  },

  routeRules: {
    '/': { prerender: true },
    '/getting-started/**': { prerender: true },
    '/concepts/**': { prerender: true },
    '/guide/**': { prerender: true },
    '/api/**': { prerender: true },
  },

  nitro: {
    prerender: {
      routes: ['/llms.txt', '/llms-full.txt'],
      crawlLinks: true,
    },
  },

  compatibilityDate: '2026-01-28',
})
