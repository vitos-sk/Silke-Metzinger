import { notFound } from "next/navigation";
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
    <main className="min-h-screen bg-ivory px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-serif text-2xl text-text-primary">Event bearbeiten</h1>
        <EventForm initialEvent={event} />
      </div>
    </main>
  );
}
