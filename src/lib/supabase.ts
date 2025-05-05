// lib/supabase.js - Centralized Supabase client

import { createClient } from '@supabase/supabase-js'

// Get environment variables with fallbacks for development
const supabaseUrl = import.meta.env.SUPABASE_URL
const supabaseKey = import.meta.env.SUPABASE_KEY

// Validate required configuration and provide helpful error messages
if (!supabaseUrl) {
  console.error(
    'Error: Missing SUPABASE_URL environment variable. Please add your Supabase URL to your .env file.'
  )
}

if (!supabaseKey) {
  console.error(
    'Error: Missing SUPABASE_KEY environment variable. Please add your Supabase anon key to your .env file.'
  )
}

// Create a single supabase client for interacting with your database
// Use empty strings as fallbacks to prevent crashes during development
// This will still show the error in console but won't crash the app entirely
export const supabase = createClient(supabaseUrl || '', supabaseKey || '')

// Helper function to check if Supabase is properly configured
/**
 * Checks if the necessary Supabase environment variables (URL and Key) are configured.
 * @returns {boolean} True if both SUPABASE_URL and SUPABASE_KEY are set, false otherwise.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseKey)
}

// Helper function for authentication state
/**
 * Fetches the currently authenticated Supabase user.
 * Returns null if Supabase is not configured or if there's an error.
 * @returns {Promise<import('@supabase/supabase-js').User | null>} A promise that resolves to the Supabase User object or null.
 */
export async function getCurrentUser(): Promise<
  import('@supabase/supabase-js').User | null
> {
  try {
    // Return null if Supabase isn't configured to avoid unnecessary errors
    if (!isSupabaseConfigured()) return null

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()
    if (error) throw error
    return user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}
