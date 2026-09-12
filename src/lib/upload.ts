import "server-only";
import { randomUUID } from "crypto";
import { supabaseAdmin } from "@/lib/supabase/admin";

const BUCKET = "photos";

function extOf(filename: string): string {
  return filename.includes(".") ? `.${filename.split(".").pop()!.toLowerCase()}` : "";
}

// Uploads raw bytes to Supabase Storage under photos/<folder>/ and returns
// the public URL. Shared by the web admin (File from a form) and the
// Telegram bot (Buffer downloaded from Telegram's servers).
export async function saveUploadedBuffer(
  bytes: Buffer | Blob,
  filename: string,
  contentType: string | undefined,
  folder: string
): Promise<string> {
  const path = `${folder}/${Date.now()}-${randomUUID().slice(0, 8)}${extOf(filename)}`;

  const { error } = await supabaseAdmin.storage.from(BUCKET).upload(path, bytes, {
    contentType: contentType || undefined,
  });
  if (error) throw new Error(`Failed to upload file: ${error.message}`);

  const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

// Uploads a File to Supabase Storage under photos/<folder>/ and returns its
// public URL. Folder mirrors the admin section it came from (games, gallery,
// journal, settings).
export async function saveUploadedFile(file: File, folder: string): Promise<string> {
  return saveUploadedBuffer(file, file.name, file.type, folder);
}

// Best-effort delete of a previously uploaded file. Silently ignores URLs
// that don't point into our Storage bucket (e.g. seed images under /images).
export async function deleteUploadedFile(url: string): Promise<void> {
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return;

  const path = url.slice(idx + marker.length);
  await supabaseAdmin.storage.from(BUCKET).remove([path]);
}
