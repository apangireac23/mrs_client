import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { sentryVitePlugin } from '@sentry/vite-plugin'

// https://vite.dev/config/
// eslint-disable-next-line no-undef
export default defineConfig({
  plugins: [
    react(),
    // eslint-disable-next-line no-undef
    ...(process.env.SENTRY_AUTH_TOKEN
      ? [
          sentryVitePlugin({
            org: 'your-org',
            project: 'your-project',
            // eslint-disable-next-line no-undef
            authToken: process.env.SENTRY_AUTH_TOKEN,
          }),
        ]
      : []),
  ],
  build: {
    sourcemap: true,
  },
})
