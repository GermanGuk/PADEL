"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { getSettings, updateSettings } from "@/lib/data/settings";
import { saveUploadedFile, deleteUploadedFile } from "@/lib/upload";

export async function saveSettings(formData: FormData) {
  await requireAdmin();
  const current = await getSettings();

  const file = formData.get("favicon");
  let faviconUrl = current.faviconUrl;
  if (file instanceof File && file.size > 0) {
    faviconUrl = await saveUploadedFile(file, "settings");
    if (current.faviconUrl) await deleteUploadedFile(current.faviconUrl);
  }

  await updateSettings({
    seoTitle: String(formData.get("seo_title") ?? "").trim() || current.seoTitle,
    seoDescription: String(formData.get("seo_description") ?? "").trim(),
    faviconUrl,
    telegramUrl: String(formData.get("telegram_url") ?? "").trim() || current.telegramUrl,
    instagramUrl: String(formData.get("instagram_url") ?? "").trim() || current.instagramUrl,
    whatsappUrl: String(formData.get("whatsapp_url") ?? "").trim() || current.whatsappUrl,
  });

  revalidatePath("/admin/seo");
  revalidatePath("/");
}
