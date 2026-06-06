import { createClient } from "@supabase/supabase-js"

const defaultSupabaseUrl = "https://amukhgkamrokbbcjgusf.supabase.co"
const defaultSupabasePublishableKey = "sb_publishable_n7U664J9No0uwIXuUrAgYQ_Q4JEipC6"

export function hasSupabaseConfig() {
  return Boolean(getSupabaseUrl() && getSupabasePublishableKey())
}

function getSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL ?? defaultSupabaseUrl
}

function getSupabasePublishableKey() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    defaultSupabasePublishableKey
  )
}

export function createSupabaseServerClient() {
  const url = getSupabaseUrl()
  const key = getSupabasePublishableKey()

  if (!url || !key) {
    throw new Error("Supabase environment variables are not configured")
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}
