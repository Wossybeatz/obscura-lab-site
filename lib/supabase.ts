import { createClient } from "@supabase/supabase-js";

// Server-only client (used inside app/api routes). These env vars live in
// .env.local locally and in the Vercel project's Environment Variables in
// production — never commit real values to git.
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

export function getSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("SUPABASE_URL / SUPABASE_ANON_KEY are not set");
  }
  return createClient(supabaseUrl, supabaseAnonKey);
}
