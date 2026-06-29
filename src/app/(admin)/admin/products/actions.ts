"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

/**
 * DELETE PRODUCT
 */
export async function deleteProduct(id: string) {
  const supabase = getSupabaseAdmin();

  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    console.error("DELETE ERROR:", error);
    throw new Error(error.message);
  }

  revalidatePath("/admin/products");
}

/**
 * CREATE PRODUCT
 */
export async function createProduct(formData: FormData) {
  const supabase = getSupabaseAdmin();

  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const price = Number(formData.get("price"));
  const inventory = Number(formData.get("inventory"));

  const id = `prod-${Date.now()}`;

  const data = {
    id,
    name,
    slug,
    description: "",
    status: "active",
    featured: false,
    rating: 0,
    reviewCount: 0,
    tags: [],
    images: [],
    variants: [
      {
        id: `var-${Date.now()}`,
        productId: id,
        name: "Default",
        sku: "",
        price,
        currency: "USD",
        images: [],
        options: [],
        inventory: {
          quantity: inventory,
          allowBackorder: false,
          trackInventory: true,
        },
      },
    ],
  };

  const { error } = await supabase.from("products").insert({
    id,
    slug,
    status: "active",
    sort_order: 0,
    data,
  });

  if (error) {
    console.error("CREATE ERROR:", error);
    throw new Error(error.message);
  }

  revalidatePath("/admin/products");
}

/**
 * UPDATE PRODUCT
 */
export async function updateProduct(id: string, formData: FormData) {
  const supabase = getSupabaseAdmin();

  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const price = Number(formData.get("price"));
  const inventory = Number(formData.get("inventory"));

  // lấy product hiện tại
  const { data: product, error: fetchError } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError) {
    console.error("FETCH ERROR:", fetchError);
    throw new Error(fetchError.message);
  }

  const json = product?.data || {};

  json.name = name;
  json.slug = slug;

  if (json.variants?.[0]) {
    json.variants[0].price = price;

    if (!json.variants[0].inventory) {
      json.variants[0].inventory = { quantity: 0 };
    }

    json.variants[0].inventory.quantity = inventory;
  }

  const { error } = await supabase
    .from("products")
    .update({
      slug,
      data: json,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("UPDATE ERROR:", error);
    throw new Error(error.message);
  }

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}`);
}
