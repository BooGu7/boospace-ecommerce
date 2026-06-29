import Link from "next/link";

import { getSupabaseAdmin } from "@/lib/supabase/admin";

import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { deleteProduct } from "./actions";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const supabase = getSupabaseAdmin();

  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (
    <div>
      <PageHeader title="Products" description="Manage store products.">
        <Link href="/admin/products/new">
          <Button>Add Product</Button>
        </Link>
      </PageHeader>

      <div className="mt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Inventory</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>

          <TableBody>
            {products?.map((product: any) => {
              const item = product.data ?? {};

              const variant = item?.variants?.[0];

              return (
                <TableRow key={product.id}>
                  <TableCell>{item?.name ?? "No name"}</TableCell>

                  <TableCell>{product.status}</TableCell>

                  <TableCell>${variant?.price ?? 0}</TableCell>

                  <TableCell>{variant?.inventory?.quantity ?? 0}</TableCell>

                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Link href={`/admin/products/${product.id}`}>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </Link>

                      <form
                        action={async () => {
                          "use server";
                          await deleteProduct(product.id);
                        }}
                      >
                        <Button variant="destructive" size="sm">
                          Delete
                        </Button>
                      </form>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
