"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

/**
 * CREATE CATEGORY
 */
export async function createCategory(formData: FormData) {
  const supabase = getSupabaseAdmin();

  const name = String(formData.get("name"));
  const slug = String(formData.get("slug"));

  const id = `cat-${Date.now()}`;

  const { error } = await supabase.from("categories").insert({
    id,
    slug,
    sort_order: 0,
    data: {
      id,
      name,
      slug,
    },
  });

  if (error) {
    console.error("CREATE CATEGORY ERROR:", error);
    throw new Error(error.message);
  }

  revalidatePath("/admin/categories");
}

/**
 * DELETE CATEGORY
 */
export async function deleteCategory(id: string) {
  const supabase = getSupabaseAdmin();

  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) {
    console.error("DELETE CATEGORY ERROR:", error);
    throw new Error(error.message);
  }

  revalidatePath("/admin/categories");
}
