"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { getCommunityContentForAdmin, updateCommunityContent } from "@/lib/data/community";
import { saveUploadedFile, deleteUploadedFile } from "@/lib/upload";

export async function saveCommunity(formData: FormData) {
  await requireAdmin();
  const current = await getCommunityContentForAdmin();

  const file = formData.get("photo");
  let image = current.image;
  if (file instanceof File && file.size > 0) {
    image = await saveUploadedFile(file, "community");
    if (current.image) await deleteUploadedFile(current.image);
  }

  await updateCommunityContent({
    heading: String(formData.get("heading") ?? "").trim() || current.heading,
    headingHighlight: String(formData.get("heading_highlight") ?? "").trim() || current.headingHighlight,
    description: String(formData.get("description") ?? "").trim(),
    buttonLink: String(formData.get("button_link") ?? "").trim() || current.buttonLink,
    image,
  });

  revalidatePath("/admin/community");
  revalidatePath("/");
}
