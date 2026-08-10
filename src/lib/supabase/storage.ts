import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function uploadImage(file: File, folder = "products") {
  const supabase = createSupabaseServerClient();

  const filename = `${folder}/${Date.now()}-${file.name}`;

  const buffer = new Uint8Array(await file.arrayBuffer());

  const { error } = await supabase.storage.from("media").upload(filename, buffer, {
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    throw error;
  }

  const { data } = supabase.storage.from("media").getPublicUrl(filename);

  return data.publicUrl;
}
