/**
 * emailAuth.js
 *
 * Mock email magic-link auth service.
 * All functions match the exact signatures you'll use with Supabase.
 *
 * To go live, install the SDK:
 *   npx expo install @supabase/supabase-js @react-native-async-storage/async-storage
 *
 * Then replace the mock bodies below with:
 *   import { createClient } from '@supabase/supabase-js';
 *   import AsyncStorage from '@react-native-async-storage/async-storage';
 *
 *   export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
 *     auth: {
 *       storage: AsyncStorage,
 *       autoRefreshToken: true,
 *       persistSession: true,
 *       detectSessionInUrl: false,
 *     },
 *   });
 */

// ---------------------------------------------------------------------------
// Simulated network delay — remove when using real Supabase
// ---------------------------------------------------------------------------
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ---------------------------------------------------------------------------
// sendMagicLink
//
// Sends a magic link to the given email address.
//
// Real Supabase implementation:
//   const { error } = await supabase.auth.signInWithOtp({
//     email,
//     options: { emailRedirectTo: 'yourapp://auth/confirm' },
//   });
//   if (error) return { success: false, error: error.message };
//   return { success: true };
//
// @param {string} email
// @returns {Promise<{ success: boolean, error?: string }>}
// ---------------------------------------------------------------------------
export async function sendMagicLink(email) {
  await delay(1400); // simulate network

  // Simulate occasional network error in dev so you can test the error state
  if (__DEV__ && email.toLowerCase().includes('fail')) {
    return { success: false, error: 'Unable to send email. Please try again.' };
  }

  return { success: true };
}

// ---------------------------------------------------------------------------
// resendMagicLink
//
// Identical to sendMagicLink — Supabase re-sends by calling signInWithOtp again.
//
// @param {string} email
// @returns {Promise<{ success: boolean, error?: string }>}
// ---------------------------------------------------------------------------
export async function resendMagicLink(email) {
  return sendMagicLink(email);
}