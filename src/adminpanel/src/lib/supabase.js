import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
// Publishable (anon) key — browser ke liye safe. Secret key yahan use nahi hoti.
const key =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = url && key ? createClient(url, key) : null;
export const isSupabaseReady = () => !!supabase;
