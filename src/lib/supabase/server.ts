import { createClient } from "@supabase/supabase-js";

const defaultSupabaseUrl = "https://amukhgkamrokbbcjgusf.supabase.co";
const defaultSupabasePublishableKey = "sb_publishable_n7U664J9No0uwIXuUrAgYQ_Q4JEipC6";

/**
 * Server client (SSR safe)
 */
export function createSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? defaultSupabaseUrl;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    defaultSupabasePublishableKey;

  if (!url || !key) {
    throw new Error("Missing Supabase public env");
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
    },
  });
}
