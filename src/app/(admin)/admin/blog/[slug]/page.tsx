import { notFound } from "next/navigation";
import { supabasePublic } from "@/lib/supabase/public-client";

export const dynamic = "force-dynamic";

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: post, error } = await supabasePublic
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !post) {
    notFound();
  }

  return (
    <article className="prose lg:prose-xl mx-auto py-12">
      <h1>{post.title}</h1>

      {post.featured_image && (
        <img src={post.featured_image} alt={post.title} />
      )}

      <div
        dangerouslySetInnerHTML={{
          __html: post.content || "",
        }}
      />
    </article>
  );
}