import { notFound } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import PostEditForm from "@/components/admin/post-edit-form";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditPostPage({
  params,
}: PageProps) {
  const { id } = await params;

  const supabase = getSupabaseAdmin();

  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !post) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Edit Post</h1>

        <p className="text-gray-500 mt-2">
          Update post content
        </p>
      </div>

      <PostEditForm post={post} />
    </div>
  );
}