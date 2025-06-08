// components/event/EventOverview.js
function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default function EventOverview({ event }) {
  return (
    <section className="bg-white rounded-2xl shadow p-6 mb-8 border border-gray-100">
      <h2 className="text-xl font-semibold mb-4">Event Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-2 text-gray-700">
        <div>
          <span className="font-medium">Date:</span>{" "}
          {event.event_date
            ? event.event_end_date && event.event_end_date !== event.event_date
              ? `${formatDate(event.event_date)} - ${formatDate(event.event_end_date)}`
              : formatDate(event.event_date)
            : "—"}
        </div>
        <div>
          <span className="font-medium">Time:</span>{" "}
          {event.time || "—"}
        </div>
        <div>
          <span className="font-medium">Venue:</span>{" "}
          {event.venue || "—"}
        </div>
        <div>
          <span className="font-medium">Event Type:</span>{" "}
          {event.event_type ? event.event_type.charAt(0).toUpperCase() + event.event_type.slice(1) : "—"}
        </div>
        {event.seat_limit && (
          <div>
            <span className="font-medium">Seat Limit:</span> {event.seat_limit}
          </div>
        )}
        <div>
          <span className="font-medium">Registration:</span>{" "}
          {event.registration_type
            ? event.registration_type.charAt(0).toUpperCase() + event.registration_type.slice(1)
            : "—"}
        </div>
        {event.registration_type === "paid" && event.registration_price && (
          <div>
            <span className="font-medium">Price:</span> Rs. {event.registration_price}
          </div>
        )}
        {event.registration_link && (
          <div>
            <span className="font-medium">Registration Link:</span>{" "}
            <a href={event.registration_link} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">
              Register Now
            </a>
          </div>
        )}
        {event.registration_deadline && (
          <div>
            <span className="font-medium">Registration Deadline:</span>{" "}
            {formatDate(event.registration_deadline)}
          </div>
        )}
      </div>
    </section>
  );
}
