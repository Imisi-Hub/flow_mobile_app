import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

// ─── Supabase Client ──────────────────────────────────────────────────────────
//
// Credentials are read from environment variables only — never hardcoded.
// Populate a `.env` file at the project root (gitignored) with:
//
//   EXPO_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
//   EXPO_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
//
// The EXPO_PUBLIC_ prefix makes these available at runtime via process.env
// in the Expo managed workflow without any extra build config.

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "[Supabase] Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY. " +
      "Create a .env file at the project root. Auth features will not work."
  );
}

export const supabase = createClient(
  supabaseUrl ?? "https://placeholder.supabase.co",
  supabaseAnonKey ?? "placeholder-anon-key",
  {
    auth: {
      // Use AsyncStorage for session persistence across app restarts.
      // This is the recommended adapter for React Native / Expo.
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);

// ─── Auth Helpers ─────────────────────────────────────────────────────────────

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function signUpWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

export async function getSession() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
}
