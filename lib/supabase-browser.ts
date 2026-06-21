import { createClient } from "@supabase/supabase-js";

// Browser-side client, used for auth (magic-link sign-in) and syncing the
// cart. Uses the PUBLISHABLE key only — safe to expose to the browser,
// unlike the secret key used in app/api/subscribe/route.ts.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabaseBrowser = createClient(supabaseUrl, supabaseAnonKey);
