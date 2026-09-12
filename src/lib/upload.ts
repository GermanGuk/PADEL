import "server-only";
import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const UPLOADS_ROOT = path.join(process.cwd(), "public", "uploads");

// Saves an uploaded File to public/uploads/<folder>/ and returns its public URL.
// Local filesystem only — matches this project's current mock-data phase
// (see AGENTS.md: no external storage yet). On a serverless deploy the
// filesystem is read-only outside /tmp, so this only works when running
// `next dev` / `next start` on a machine with a persistent disk.
export async function saveUploadedFile(file: File, folder: string): Promise<string> {
  const bytes = Buffer.from(await file.arrayBuffer());
  const ext = path.extname(file.name).toLowerCase() || "";
  const name = `${Date.now()}-${randomUUID().slice(0, 8)}${ext}`;

  const dir = path.join(UPLOADS_ROOT, folder);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), bytes);

  return `/uploads/${folder}/${name}`;
}

// Best-effort delete of a previously uploaded file. Silently ignores files
// that live outside /uploads (e.g. seed images under /images) or that are
// already gone.
export async function deleteUploadedFile(url: string): Promise<void> {
  if (!url.startsWith("/uploads/")) return;
  try {
    await unlink(path.join(process.cwd(), "public", url));
  } catch {
    // already gone — nothing to do
  }
}
