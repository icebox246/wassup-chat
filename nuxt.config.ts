// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  nitro: {
    experimental: {
      websocket: true
    }
  },
  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    'nuxt-file-storage',
  ],
  fileStorage: {
    mount: process.env.FILE_STORAGE || (process.cwd() + "/uploads")
  },
})
