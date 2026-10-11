import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: false },
  css: ['@fortawesome/fontawesome-svg-core/styles.css'],
  modules: ['@pinia/nuxt'],
  plugins: ['~/plugins/fontawesome.ts'],
  experimental: { appManifest: false },
  // delegated-copy-task-locator (review only, removed after the user's choice): the second review server
  // builds into its own directory so both variants can run side by side.
  buildDir: process.env.DESIGN_BUILD_DIR || '.nuxt',
  runtimeConfig: {
    public: {
      graphqlBaseUrl: 'prototype://local/graphql',
      restBaseUrl: 'prototype://local/rest',
      defaultNodeBaseUrl: 'prototype://local',
      agentWsEndpoint: 'prototype://local/agent',
      teamWsEndpoint: 'prototype://local/team',
      graphqlWsEndpoint: 'prototype://local/graphql-ws',
      terminalWsEndpoint: 'prototype://local/terminal',
      fileExplorerWsEndpoint: 'prototype://local/files',
      mobileRemoteAccessBuild: false,
      showDebugErrorPanel: false,
      // delegated-copy-task-locator (review only): 'icon' (variant A) or 'summary' (variant B), set per review
      // server with NUXT_PUBLIC_COPY_TASK_VARIANT; there is no in-page switch.
      copyTaskVariant: 'icon',
      audio: {
        targetSampleRate: 16000,
        chunkDuration: 5,
        overlapDuration: 0.2,
        channels: 1,
        transcriptionWsEndpoint: 'prototype://local/transcription',
        constraints: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      },
    },
  },
  vite: {
    assetsInclude: ['**/*.jpeg', '**/*.jpg', '**/*.png', '**/*.svg'],
    worker: { format: 'es' },
    build: { target: 'es2022' },
  },
  postcss: { plugins: { tailwindcss: {}, autoprefixer: {} } },
  compatibilityDate: '2024-07-22',
  typescript: { typeCheck: false },
  ignore: ['**/__tests__/**', '**/*.spec.*', '**/*.test.*', 'evidence/**', '.nuxt-variant-*/**'],
})
