import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getEvent } from "@/lib/events";
import EventForm from "@/app/admin/EventForm";

interface EditEventPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  const { id } = await params;
  const event = await getEvent(id);

  if (!event) notFound();

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
        <h1 className="mt-3 font-serif text-2xl text-text-primary">Event bearbeiten</h1>
        <EventForm initialEvent={event} />
      </div>
    </main>
  );
}
