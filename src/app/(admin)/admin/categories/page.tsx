import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";

import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";

import { deleteCategory } from "./actions";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const supabase = getSupabaseAdmin();

  const { data: categories, error } = await supabase
    .from("categories")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (
    <div>
      <PageHeader title="Categories" description="Manage categories">
        <Link href="/admin/categories/new">
          <Button>Add Category</Button>
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
            {categories?.map((cat: any) => (
              <TableRow key={cat.id}>
                <TableCell>{cat.name}</TableCell>

                <TableCell>{cat.slug}</TableCell>

                <TableCell className="text-right">
                  <form
                    action={async () => {
                      "use server";
                      await deleteCategory(cat.id);
                    }}
                  >
                    <Button variant="destructive" size="sm">
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
