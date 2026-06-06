"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

/**
 * CREATE PAGE
 */
export async function createPage(formData: FormData) {
  const supabase = getSupabaseAdmin();

  const title = String(formData.get("title"));
  const slug = String(formData.get("slug"));
  const excerpt = String(formData.get("excerpt") || "");
  const body = String(formData.get("body") || "");

  const id = `page-${Date.now()}`;

  const data = {
    id,
    slug,
    title,
    excerpt,
    body,
    publishedAt: new Date().toISOString(),
  };

  const { error } = await supabase.from("ecommerce_pages").insert({
    id,
    slug,
    sort_order: 0,
    data,
    published_at: new Date().toISOString(),
  });

  if (error) {
    console.error("CREATE PAGE ERROR:", error);
    throw new Error(error.message);
  }

  revalidatePath("/admin/pages");
}

/**
 * UPDATE PAGE
 */
export async function updatePage(id: string, formData: FormData) {
  const supabase = getSupabaseAdmin();

  const title = String(formData.get("title"));
  const slug = String(formData.get("slug"));
  const excerpt = String(formData.get("excerpt") || "");
  const body = String(formData.get("body") || "");

  const { data: page, error: fetchError } = await supabase
    .from("ecommerce_pages")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError || !page) {
    throw new Error("Page not found");
  }

  const json = page.data || {};

  json.title = title;
  json.slug = slug;
  json.excerpt = excerpt;
  json.body = body;

  const { error } = await supabase
    .from("ecommerce_pages")
    .update({
      slug,
      data: json,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("UPDATE PAGE ERROR:", error);
    throw new Error(error.message);
  }

  revalidatePath("/admin/pages");
  revalidatePath(`/admin/pages/${id}`);
}

/**
 * DELETE PAGE
 */
export async function deletePage(id: string) {
  const supabase = getSupabaseAdmin();

  const { error } = await supabase
    .from("ecommerce_pages")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("DELETE PAGE ERROR:", error);
    throw new Error(error.message);
  }

  revalidatePath("/admin/pages");
}