// components/event/EventHeader.js
import Image from "next/image";

export default function EventHeader({ event }) {
  let organizer = "—";
  if (event.organizer_school_name) organizer = event.organizer_school_name;
  else if (event.organizer_university_name) organizer = event.organizer_university_name;
  else if (event.organizer_custom) organizer = event.organizer_custom;

  return (
    <div className="bg-white rounded-2xl shadow p-0 mb-7 overflow-hidden border border-gray-100">
      <div className="relative w-full h-56 sm:h-80">
        {event.featured_image && (
          <Image
            src={event.featured_image}
            alt={event.title}
            fill
            className="object-cover w-full h-full"
            priority
          />
        )}
        {!event.featured_image && (
          <div className="h-full flex items-center justify-center text-gray-300 bg-gray-100 text-xl">
            No Image
          </div>
        )}
        {event.featured && (
          <span className="absolute top-4 right-4 bg-yellow-400 text-white font-bold px-3 py-1 rounded shadow text-xs">
            FEATURED
          </span>
        )}
      </div>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
        <div className="text-sm text-gray-600 flex gap-1">
          <span className="font-semibold">Organizer:</span>
          <span>{organizer}</span>
        </div>
      </div>
    </div>
  );
}
