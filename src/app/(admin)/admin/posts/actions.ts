"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export async function createPost(formData: FormData) {
  const supabase = getSupabaseAdmin();

  const title = String(formData.get("title"));
  const slug = String(formData.get("slug"));
  const content = String(formData.get("content") || "");

  const id = `post-${Date.now()}`;

  const { error } = await supabase.from("ecommerce_posts").insert({
    id,
    slug,
    sort_order: 0,
    data: {
      id,
      title,
      slug,
      content,
      createdAt: new Date().toISOString(),
    },
  });

  if (error) throw new Error(error.message);

  revalidatePath("/admin/posts");
}

export async function updatePost(id: string, formData: FormData) {
  const supabase = getSupabaseAdmin();

  const title = String(formData.get("title"));
  const slug = String(formData.get("slug"));
  const content = String(formData.get("content") || "");

  const { data: post } = await supabase
    .from("ecommerce_posts")
    .select("*")
    .eq("id", id)
    .single();

  if (!post) throw new Error("Post not found");

  const json = post.data || {};

  json.title = title;
  json.slug = slug;
  json.content = content;

  const { error } = await supabase
    .from("ecommerce_posts")
    .update({
      slug,
      data: json,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/posts");
  revalidatePath(`/admin/posts/${id}`);
}

export async function deletePost(id: string) {
  const supabase = getSupabaseAdmin();

  const { error } = await supabase
    .from("ecommerce_posts")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/posts");
}