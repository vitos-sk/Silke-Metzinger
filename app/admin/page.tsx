import Link from "next/link";
import { listEvents } from "@/lib/events";
import LogoutButton from "./LogoutButton";
import DeleteEventButton from "./DeleteEventButton";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const events = await listEvents();

  return (
    <main className="min-h-screen bg-ivory px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-2xl text-text-primary">News &amp; Events verwalten</h1>
          <LogoutButton />
        </div>

        <Link
          href="/admin/events/new"
          className="mt-6 inline-block rounded-full bg-sage px-4 py-2.5 text-sm text-ivory transition-opacity hover:opacity-90"
        >
          + Neues Event
        </Link>

        <div className="mt-8 space-y-3">
          {events.length === 0 && (
            <p className="text-sm text-text-secondary">Noch keine Events angelegt.</p>
          )}

          {events.map((event) => (
            <div
              key={event.id}
              className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm"
            >
              <div>
                <p className="font-serif text-text-primary">{event.title}</p>
                <p className="text-sm text-text-secondary">{event.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href={`/admin/events/${event.id}/edit`}
                  className="text-sm text-sage hover:opacity-80"
                >
                  Bearbeiten
                </Link>
                <DeleteEventButton id={event.id} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
