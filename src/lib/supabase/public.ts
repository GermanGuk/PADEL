import "server-only";
import { createClient } from "@supabase/supabase-js";

// Anon-key client for public reads. RLS on every table only grants SELECT
// to this role — safe to use from server components, nothing here can write.
export const supabasePublic = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { auth: { persistSession: false } }
);
