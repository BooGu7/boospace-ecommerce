"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

/**
 * CREATE BRAND
 */
export async function createBrand(formData: FormData) {
  const supabase = getSupabaseAdmin();

  const name = String(formData.get("name"));
  const slug = String(formData.get("slug"));
  const description = String(formData.get("description") || "");

  const id = `brand-${Date.now()}`;

  const { error } = await supabase.from("brands").insert({
    id,
    slug,
    sort_order: 0,
    data: {
      id,
      name,
      slug,
      description,
    },
  });

  if (error) {
    console.error("CREATE BRAND ERROR:", error);
    throw new Error(error.message);
  }

  revalidatePath("/admin/brands");
}

/**
 * DELETE BRAND
 */
export async function deleteBrand(id: string) {
  const supabase = getSupabaseAdmin();

  const { error } = await supabase.from("brands").delete().eq("id", id);

  if (error) {
    console.error("DELETE BRAND ERROR:", error);
    throw new Error(error.message);
  }

  revalidatePath("/admin/brands");
}
