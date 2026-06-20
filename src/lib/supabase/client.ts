import { createClient } from "@supabase/supabase-js";

const defaultSupabaseUrl = "https://amukhgkamrokbbcjgusf.supabase.co";
const defaultSupabasePublishableKey = "sb_publishable_n7U664J9No0uwIXuUrAgYQ_Q4JEipC6";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? defaultSupabaseUrl,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    defaultSupabasePublishableKey
);
