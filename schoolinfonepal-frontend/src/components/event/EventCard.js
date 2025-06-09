"use client"
import Image from "next/image"
import Link from "next/link"
import { Calendar, MapPin, ArrowRight, Building2, Clock, Users } from "lucide-react"
import { getFullImageUrl } from "@/utils/imageUrl"

function formatDate(dateStr) {
  if (!dateStr) return ""
  const d = new Date(dateStr)
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
}

export default function EventCard({ event, compact = false }) {
  const eventUrl = `/event/${event.slug}`

  // Determine organizer display
  let organizer = ""
  if (event.organizer_school_name) organizer = event.organizer_school_name
  else if (event.organizer_university_name) organizer = event.organizer_university_name
  else if (event.organizer_custom) organizer = event.organizer_custom

  // Compact version for sidebar or small spaces
  if (compact) {
    return (
      <div className="group bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300">
        <Link href={eventUrl} className="block">
          <div className="flex gap-3 p-4">
            <div className="relative h-16 w-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50">
              {event.featured_image ? (
                <Image
                  src={getFullImageUrl(event.featured_image) || "/placeholder.svg"}
                  alt={event.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="80px"
                  unoptimized
                />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  <Calendar className="w-6 h-6" />
                </div>
              )}
              {event.featured && (
                <span className="absolute top-1 right-1 bg-yellow-400 text-white text-xs font-bold px-1 py-0.5 rounded">
                  ★
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 group-hover:text-[#1ca3fd] transition-colors line-clamp-2 text-sm mb-1">
                {event.title}
              </h3>
              <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                <Calendar className="w-3 h-3 text-[#1ca3fd] flex-shrink-0" />
                <span>{formatDate(event.event_date)}</span>
              </div>
              {organizer && (
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <Building2 className="w-3 h-3 text-gray-400 flex-shrink-0" />
                  <span className="truncate">{organizer}</span>
                </div>
              )}
            </div>
          </div>
        </Link>
      </div>
    )
  }

  // Full version for main listing
  return (
    <div className="relative group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col h-full">
      <Link href={eventUrl} className="block">
        {/* Event Image */}
        <div className="relative w-full h-48 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
          {event.featured_image ? (
            <Image
              src={getFullImageUrl(event.featured_image) || "/placeholder.svg"}
              alt={event.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, 33vw"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center text-gray-400">
                <Calendar className="w-12 h-12 mx-auto mb-2" />
                <span className="text-sm">No Image</span>
              </div>
            </div>
          )}

          {/* Date Badge */}
          <div className="absolute top-3 left-3 bg-[#1ca3fd] text-white text-sm font-bold px-3 py-1 rounded-lg shadow">
            {formatDate(event.event_date)}
          </div>

          {/* Featured Badge */}
          {event.featured && (
            <div className="absolute top-3 right-3 bg-yellow-400 text-white text-xs font-bold px-2 py-1 rounded-lg shadow">
              FEATURED
            </div>
          )}
        </div>
      </Link>

      {/* Card Content */}
      <div className="p-4 flex-grow flex flex-col">
        {/* Event Title */}
        <Link
          href={eventUrl}
          className="text-lg font-semibold text-gray-900 group-hover:text-[#1ca3fd] transition-colors line-clamp-2 mb-3"
        >
          {event.title}
        </Link>

        {/* Event Details */}
        <div className="space-y-2 mb-4 flex-grow">
          {/* Organizer */}
          {organizer && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Building2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="truncate">{organizer}</span>
            </div>
          )}

          {/* Venue */}
          {event.venue && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="truncate">{event.venue}</span>
            </div>
          )}

          {/* Time */}
          {event.time && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span>{event.time}</span>
            </div>
          )}

          {/* Seat Limit */}
          {event.seat_limit && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span>Seats: {event.seat_limit}</span>
            </div>
          )}
        </div>

        {/* Event Type & Registration */}
        <div className="flex items-center justify-between gap-2 mb-4">
          {event.event_type && (
            <span className="inline-block bg-blue-50 text-[#1ca3fd] px-2 py-1 rounded text-xs border border-blue-100">
              {event.event_type.charAt(0).toUpperCase() + event.event_type.slice(1)}
            </span>
          )}

          {event.registration_type && (
            <span
              className={`inline-block px-2 py-1 rounded text-xs border ${
                event.registration_type === "free"
                  ? "bg-green-50 text-green-700 border-green-100"
                  : "bg-orange-50 text-orange-700 border-orange-100"
              }`}
            >
              {event.registration_type === "free" ? "Free" : `Rs. ${event.registration_price || "Paid"}`}
            </span>
          )}
        </div>

        {/* View Details Button */}
        <Link
          href={eventUrl}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1ca3fd] hover:bg-blue-600 text-white font-medium rounded-lg transition-colors shadow-sm"
        >
          <span>View Details</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  )
}
