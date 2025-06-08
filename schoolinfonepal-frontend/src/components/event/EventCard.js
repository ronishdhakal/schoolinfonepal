"use client";
import Image from "next/image";
import Link from "next/link";

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default function EventCard({ event, small = false }) {
  let organizer = "—";
  if (event.organizer_school_name) organizer = event.organizer_school_name;
  else if (event.organizer_university_name) organizer = event.organizer_university_name;
  else if (event.organizer_custom) organizer = event.organizer_custom;

  return (
    <Link
      href={`/event/${event.slug}`}
      className={
        small
          ? "group bg-white rounded-xl shadow hover:shadow-md transition flex gap-3 border border-gray-100 p-3"
          : "group bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden flex flex-col h-full border border-gray-100"
      }
    >
      <div
        className={
          small
            ? "relative h-20 w-28 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50"
            : "relative h-44 w-full overflow-hidden bg-gray-50"
        }
      >
        {event.featured_image ? (
          <Image
            src={event.featured_image}
            alt={event.title}
            fill
            className="object-cover group-hover:scale-105 transition"
            sizes={small ? "112px" : "(max-width: 640px) 100vw, 33vw"}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            <span>No Image</span>
          </div>
        )}
        <span
          className={
            small
              ? "absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded"
              : "absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-lg shadow"
          }
        >
          {formatDate(event.event_date)}
        </span>
      </div>
      <div className={small ? "flex-1 flex flex-col justify-center ml-2 min-w-0" : "flex-1 flex flex-col p-4"}>
        <h3
          className={
            small
              ? "text-sm font-semibold mb-1 truncate"
              : "text-lg font-semibold mb-1 line-clamp-2"
          }
        >
          {event.title}
        </h3>
        <div
          className={small ? "text-xs text-gray-500" : "flex items-center mt-auto text-sm text-gray-500 gap-2"}
        >
          <span className="font-medium">Organizer:</span>
          <span className="truncate">{organizer}</span>
        </div>
      </div>
    </Link>
  );
}
