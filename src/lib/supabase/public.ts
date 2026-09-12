import "server-only";
import { createClient } from "@supabase/supabase-js";

// Anon-key client for public reads. RLS on every table only grants SELECT
// to this role — safe to use from server components, nothing here can write.
//
// next: { revalidate: 60 } caps how long Next.js's fetch Data Cache may
// serve a stale Supabase response, independent of the page-level cache
// that revalidatePath() busts after every admin/bot write. Without this,
// a fetch response cached at build time (Vercel persists that cache
// across deployments) can keep being served indefinitely even after a
// fresh deploy. cache: "no-store" would be stronger, but supabase-js
// swallows the Next.js "dynamic server usage" signal that requires and
// throws it as a normal fetch error instead, breaking static rendering.
export const supabasePublic = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: { persistSession: false },
    global: {
      fetch: (input, init) => fetch(input, { ...init, next: { revalidate: 60 } }),
    },
  }
);
