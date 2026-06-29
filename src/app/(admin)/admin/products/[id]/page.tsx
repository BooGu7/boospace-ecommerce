import { notFound } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";

import { updateProduct } from "../actions";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default async function ProductEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = createSupabaseServerClient();

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (!product) {
    notFound();
  }

  const item = product.data;

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold">Edit Product</h1>

      <form
        action={updateProduct.bind(null, product.id)}
        className="mt-6 space-y-6"
      >
        <div>
          <Label>Name</Label>

          <Input name="name" defaultValue={item.name} />
        </div>

        <div>
          <Label>Slug</Label>

          <Input name="slug" defaultValue={item.slug} />
        </div>

        <div>
          <Label>Price</Label>

          <Input
            name="price"
            type="number"
            defaultValue={item?.variants?.[0]?.price}
          />
        </div>

        <div>
          <Label>Inventory</Label>

          <Input
            name="inventory"
            type="number"
            defaultValue={item?.variants?.[0]?.inventory?.quantity}
          />
        </div>

        <Button type="submit">Save Changes</Button>
      </form>
    </div>
  );
}
