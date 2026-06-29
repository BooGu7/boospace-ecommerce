import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";

import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import { deleteBrand } from "./actions";

export const dynamic = "force-dynamic";

export default async function BrandsPage() {
  const supabase = getSupabaseAdmin();

  const { data: brands, error } = await supabase
    .from("brands")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (
    <div>
      <PageHeader title="Brands" description="Manage brands">
        <Link href="/admin/brands/new">
          <Button>Add Brand</Button>
        </Link>
      </PageHeader>

      <div className="mt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>

          <TableBody>
            {brands?.map((brand: any) => (
              <TableRow key={brand.id}>
                <TableCell>{brand.name}</TableCell>

                <TableCell>{brand.slug}</TableCell>

                <TableCell className="text-right">
                  <form
                    action={async () => {
                      "use server";
                      await deleteBrand(brand.id);
                    }}
                  >
                    <Button size="sm" variant="destructive">
                      Delete
                    </Button>
                  </form>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
