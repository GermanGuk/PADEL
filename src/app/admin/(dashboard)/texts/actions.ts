"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { verifyAdmin } from "@/lib/supabase/dal";
import { siteTexts } from "@/lib/content";

export async function saveTexts(formData: FormData) {
  await verifyAdmin();
  const supabase = await createClient();

  const rows = Object.keys(siteTexts).map((key) => ({
    key,
    value: String(formData.get(key) ?? ""),
  }));

  await supabase.from("site_texts").upsert(rows, { onConflict: "key" });
  revalidatePath("/admin/texts");
  revalidatePath("/");
}
