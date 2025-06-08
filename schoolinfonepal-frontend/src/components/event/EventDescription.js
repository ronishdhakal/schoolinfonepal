// components/event/EventDescription.js
export default function EventDescription({ event }) {
  if (!event.description) return null;
  return (
    <section className="bg-white rounded-2xl shadow p-6 mb-8 border border-gray-100">
      <h2 className="text-xl font-semibold mb-4">About this Event</h2>
      <div className="prose max-w-none text-gray-800" dangerouslySetInnerHTML={{ __html: event.description }} />
    </section>
  );
}
