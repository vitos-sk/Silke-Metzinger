import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { listEvents } from "@/lib/events";
import EventCard from "./EventCard";

function SectionDivider({ position }: { position: "top" | "bottom" }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 ${
        position === "top" ? "top-0" : "bottom-0"
      } flex items-center justify-center`}
    >
      <div className="h-px w-full bg-linear-to-r from-transparent via-gold/35 to-transparent" />
      <span className="absolute h-1.5 w-1.5 rotate-45 bg-gold/50" />
    </div>
  );
}

export default async function NewsEvents() {
  const events = await listEvents();

  return (
    <section id="news-events" className="relative scroll-mt-32 bg-sage/5 px-6 py-16 md:py-20">
      <SectionDivider position="top" />
      <SectionDivider position="bottom" />

      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="text-center font-serif text-3xl text-text-primary md:text-4xl">
            News &amp; Events
          </h2>
        </Reveal>

        {events.length === 0 ? (
          <p className="mt-10 text-center text-text-secondary">
            Aktuell sind keine Events geplant &mdash; schau bald wieder vorbei.
          </p>
        ) : (
          <RevealGroup
            className="mt-10 grid gap-5 sm:grid-cols-2 md:mt-14 md:grid-cols-3 md:gap-6"
            stagger={0.12}
          >
            {events.map((event, index) => (
              <RevealItem key={event.id}>
                <EventCard event={event} index={index} />
              </RevealItem>
            ))}
          </RevealGroup>
        )}
      </div>
    </section>
  );
}
