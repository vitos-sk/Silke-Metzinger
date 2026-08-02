import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getPost } from "@/lib/posts";
import PostForm from "@/app/admin/PostForm";

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) notFound();

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-sm text-text-secondary transition-colors hover:text-sage"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
          Zurück
        </Link>
        <h1 className="mt-3 font-serif text-2xl text-text-primary">Beitrag bearbeiten</h1>
        <PostForm initialPost={post} />
      </div>
    </main>
  );
}
