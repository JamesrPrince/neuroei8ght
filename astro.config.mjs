// @ts-check
import { defineConfig } from 'astro/config'
import { loadEnv } from 'vite'
import tailwind from '@astrojs/tailwind'
import vercel from '@astrojs/vercel/serverless'
// Remove unused imports
// import tailwindcss from "tailwindcss";
// import autoprefixer from "autoprefixer";

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
    css: {
      // Improve CSS processing
      devSourcemap: true,
      // Remove explicit postcss config, let the integration handle it
      // postcss: {
      //   plugins: [tailwindcss, autoprefixer],
      // },
    },
  },
  // Remove build.format as it's not relevant for server output
  // build: {
  //   format: "file",
  // },
  // Explicitly link stylesheets instead of potentially inlining them
  inlineStylesheets: 'always',
  integrations: [
    tailwind({
      // Ensure Tailwind can find all content
      // config: { // Keep applyBaseStyles if needed, otherwise remove this config block too
      //   applyBaseStyles: false,
      // },
    }),
  ],
  output: 'server',
  adapter: vercel(),
})
