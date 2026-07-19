import Link from "next/link";
import { CalendarDays, ImageOff, Pencil, Plus } from "lucide-react";
import { listEvents } from "@/lib/events";
import LogoutButton from "./LogoutButton";
import DeleteEventButton from "./DeleteEventButton";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const events = await listEvents();

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white/70 px-4 py-3.5 shadow-sm ring-1 ring-black/5 backdrop-blur-xl sm:px-5">
          <div>
            <h1 className="font-serif text-xl text-text-primary sm:text-2xl">
              News &amp; Events
            </h1>
            <p className="text-xs text-text-secondary sm:text-sm">
              {events.length} {events.length === 1 ? "Eintrag" : "Einträge"}
            </p>
          </div>
          <LogoutButton />
        </div>

        <Link
          href="/admin/events/new"
          className="group relative mt-6 flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-sage px-5 py-3.5 text-sm font-medium text-ivory shadow-[0_8px_24px_-6px_rgba(143,175,138,0.55)] ring-1 ring-sage/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_-6px_rgba(143,175,138,0.65)] active:translate-y-0 sm:w-auto"
        >
          <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-ivory/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
          <Plus className="h-4 w-4" strokeWidth={2} />
          Neues Event
        </Link>

        <div className="mt-6 space-y-3">
          {events.length === 0 && (
            <div className="flex flex-col items-center gap-2 rounded-2xl bg-white/70 px-6 py-12 text-center shadow-sm ring-1 ring-black/5 backdrop-blur-xl">
              <CalendarDays className="h-8 w-8 text-text-secondary/60" strokeWidth={1.5} />
              <p className="text-sm text-text-secondary">Noch keine Events angelegt.</p>
            </div>
          )}

          {events.map((event) => (
            <div
              key={event.id}
              className="flex items-center gap-4 rounded-2xl bg-white/70 p-3 shadow-sm ring-1 ring-black/5 backdrop-blur-xl transition-shadow hover:shadow-md sm:p-4"
            >
              <div className="relative aspect-square h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-linear-to-br from-gold/20 to-sage/20 sm:h-16 sm:w-16">
                {event.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={event.imageUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <ImageOff className="h-5 w-5 text-text-secondary/50" strokeWidth={1.5} />
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate font-serif text-text-primary">{event.title}</p>
                <p className="flex items-center gap-1 text-xs text-text-secondary sm:text-sm">
                  <CalendarDays className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
                  <span className="truncate">{event.date}</span>
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <Link
                  href={`/admin/events/${event.id}/edit`}
                  aria-label="Event bearbeiten"
                  className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm text-sage transition-colors hover:bg-sage/10"
                >
                  <Pencil className="h-4 w-4" strokeWidth={1.75} />
                  <span className="hidden sm:inline">Bearbeiten</span>
                </Link>
                <DeleteEventButton id={event.id} title={event.title} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
