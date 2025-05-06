// @ts-check
import { defineConfig } from 'astro/config'
import { loadEnv } from 'vite'
import tailwind from '@astrojs/tailwind'
import vercel from '@astrojs/vercel/serverless'

// Load environment variables
const env = loadEnv(process.env.NODE_ENV, process.cwd(), '')

// https://astro.build/config
export default defineConfig({
  vite: {
    // Enable environment variables with import.meta.env
    define: {
      'import.meta.env.SUPABASE_URL': JSON.stringify(env.SUPABASE_URL || ''),
      'import.meta.env.SUPABASE_KEY': JSON.stringify(env.SUPABASE_KEY || ''),
      'import.meta.env.PUBLIC_STRIPE_KEY': JSON.stringify(
        env.PUBLIC_STRIPE_KEY || ''
      ),
      'import.meta.env.STRIPE_SECRET_KEY': JSON.stringify(
        env.STRIPE_SECRET_KEY || ''
      ),
    },
    build: {
      // Explicitly exclude test files from the Vite build
      exclude: ['**/*.test.ts', '**/*.spec.ts'],
    },
    css: {
      // Improve CSS processing
      devSourcemap: true,
    },
    // Improve optimization settings
    optimizeDeps: {
      exclude: ['astro:*'],
      // Ensure particles.js is pre-bundled
      include: ['@supabase/supabase-js', 'zustand']
    },
    ssr: {
      // Fix issues with packages in SSR mode
      noExternal: [
        'path-to-regexp',
        'react-icons',
        '@stripe/stripe-js',
        'astro-i18n'
      ],
    },
  },
  // Explicitly link stylesheets instead of potentially inlining them
  inlineStylesheets: 'always',
  integrations: [
    tailwind({
      // Ensure Tailwind config is properly integrated
      config: { applyBaseStyles: false }
    })
  ],
  output: 'server',
  adapter: vercel({
    // Improve Vercel deployment
    analytics: true,
    maxDuration: 60
  }),
})
