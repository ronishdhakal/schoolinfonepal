// components/event/OtherEvents.js
import EventCard from "./EventCard";

export default function OtherEvents({ events, currentSlug, sidebar = false }) {
  const other = events.filter(ev => ev.slug !== currentSlug && ev.is_active);
  if (!other.length) return null;

  if (sidebar) {
    return (
      <section>
        <h2 className="text-lg font-bold mb-3">Other Active Events</h2>
        <div className="flex flex-col gap-4">
          {other.slice(0, 5).map(ev => (
            <EventCard key={ev.id} event={ev} small />
          ))}
        </div>
      </section>
    );
  }

  // If not sidebar, show grid (for old layout, if you use elsewhere)
  return (
    <section>
      <h2 className="text-xl font-bold mb-4">Other Active Events</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7">
        {other.map(ev => (
          <EventCard key={ev.id} event={ev} />
        ))}
      </div>
    </section>
  );
}
