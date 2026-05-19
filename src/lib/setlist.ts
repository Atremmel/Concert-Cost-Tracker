import type { SupabaseClient } from "@supabase/supabase-js";

export const SETLIST_BUCKET = "setlists";
export const MAX_SETLIST_FILE_BYTES = 5 * 1024 * 1024;

const ALLOWED_TYPES = new Set([
  "text/plain",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export function setlistStoragePath(
  userId: string,
  concertId: string,
  filename: string,
) {
  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `${userId}/${concertId}/${safeName}`;
}

export function parseSetlistLines(text: string | null | undefined): string[] {
  if (!text?.trim()) return [];
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function isSetlistImagePath(path: string | null | undefined): boolean {
  if (!path) return false;
  return /\.(jpe?g|png|webp)$/i.test(path);
}

export async function uploadSetlistFile(
  supabase: SupabaseClient,
  userId: string,
  concertId: string,
  file: File,
  existingPath?: string | null,
): Promise<{ path: string | null; error: string | null }> {
  if (file.size > MAX_SETLIST_FILE_BYTES) {
    return { path: null, error: "Setlist file must be 5 MB or smaller." };
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return {
      path: null,
      error: "Use a .txt file or a JPEG, PNG, or WebP image.",
    };
  }

  if (existingPath) {
    await supabase.storage.from(SETLIST_BUCKET).remove([existingPath]);
  }

  const path = setlistStoragePath(userId, concertId, file.name);
  const { error } = await supabase.storage
    .from(SETLIST_BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type });

  if (error) {
    return { path: null, error: error.message };
  }
  return { path, error: null };
}

export async function getSetlistSignedUrl(
  supabase: SupabaseClient,
  path: string,
): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from(SETLIST_BUCKET)
    .createSignedUrl(path, 3600);
  if (error || !data?.signedUrl) return null;
  return data.signedUrl;
}

export async function fetchSetlistTextFromStorage(
  supabase: SupabaseClient,
  path: string,
): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from(SETLIST_BUCKET)
    .download(path);
  if (error || !data) return null;
  return data.text();
}
