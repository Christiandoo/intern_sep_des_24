import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const BUCKET_NAME = "work-orders";

/**
 * Upload file ke Supabase Storage
 */
export async function uploadFile(file: Blob, folder = "projects/") {
  const fileExt = file.type.split("/")[1];
  const fileName = `${folder}${crypto.randomUUID()}.${fileExt}`;

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(fileName, file, {
      upsert: true,
      contentType: file.type,
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(fileName);

  return data.publicUrl; // 🔥 INI YANG DISIMPAN KE DB
}

/**
 * Hapus file dari Supabase Storage
 */
export async function deleteFile(fileUrl: string) {
  if (!fileUrl) return;

  const filePath = fileUrl.split(`storage/files/buckets/work-orders/${BUCKET_NAME}/`)[1];
  if (!filePath) return;

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([filePath]);

  if (error) {
    throw new Error(`Delete failed: ${error.message}`);
  }
}
