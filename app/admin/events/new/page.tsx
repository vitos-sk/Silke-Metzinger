import EventForm from "@/app/admin/EventForm";

export default function NewEventPage() {
  return (
    <main className="min-h-screen bg-ivory px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-serif text-2xl text-text-primary">Neues Event</h1>
        <EventForm />
      </div>
    </main>
  );
}
