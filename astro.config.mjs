// @ts-check
import { defineConfig } from "astro/config";
import { loadEnv } from "vite";

// Load environment variables
const env = loadEnv(process.env.NODE_ENV, process.cwd(), "");

// https://astro.build/config
export default defineConfig({
  vite: {
    // Enable environment variables with import.meta.env
    define: {
      "import.meta.env.SUPABASE_URL": JSON.stringify(env.SUPABASE_URL),
      "import.meta.env.SUPABASE_KEY": JSON.stringify(env.SUPABASE_KEY),
      "import.meta.env.PUBLIC_STRIPE_KEY": JSON.stringify(
        env.PUBLIC_STRIPE_KEY
      ),
      "import.meta.env.STRIPE_SECRET_KEY": JSON.stringify(
        env.STRIPE_SECRET_KEY
      ),
    },
  },
});
