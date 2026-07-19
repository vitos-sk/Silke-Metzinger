import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import EventForm from "@/app/admin/EventForm";

export default function NewEventPage() {
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
        <h1 className="mt-3 font-serif text-2xl text-text-primary">Neues Event</h1>
        <EventForm />
      </div>
    </main>
  );
}
