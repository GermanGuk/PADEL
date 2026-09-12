import "server-only";
import { createClient } from "@supabase/supabase-js";

// Service-role client — bypasses RLS entirely. Only ever imported from
// admin server actions, which are already gated by requireAdmin() (see
// src/lib/auth.ts). Never import this from a client component.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);
