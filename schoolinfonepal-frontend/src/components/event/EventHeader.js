"use client"
import Image from "next/image"
import { Calendar, Building2, MapPin, Clock, Star } from "lucide-react"
import { getFullImageUrl } from "@/utils/imageUrl"

function formatDate(dateStr) {
  if (!dateStr) return ""
  const d = new Date(dateStr)
  return d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })
}

export default function EventHeader({ event }) {
  // Determine organizer display
  let organizer = ""
  if (event.organizer_school_name) organizer = event.organizer_school_name
  else if (event.organizer_university_name) organizer = event.organizer_university_name
  else if (event.organizer_custom) organizer = event.organizer_custom

  return (
    <section className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
      {/* Featured Image */}
      <div className="relative w-full h-64 md:h-80 bg-gradient-to-br from-gray-50 to-gray-100">
        {event.featured_image ? (
          <Image
            src={getFullImageUrl(event.featured_image) || "/placeholder.svg"}
            alt={event.title}
            fill
            className="object-cover"
            priority
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center text-gray-400">
              <Calendar className="w-16 h-16 mx-auto mb-4" />
              <span className="text-lg">No Image Available</span>
            </div>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

        {/* Featured Badge */}
        {event.featured && (
          <div className="absolute top-4 right-4 bg-yellow-400 text-white font-bold px-3 py-1 rounded-lg shadow flex items-center gap-1">
            <Star className="w-4 h-4" />
            FEATURED
          </div>
        )}
      </div>

      {/* Event Info */}
      <div className="p-6 md:p-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          {/* Left side - Main info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-50">
                <Calendar className="w-5 h-5 text-[#1ca3fd]" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{event.title}</h1>
            </div>

            {/* Organizer Info */}
            {organizer && (
              <div className="flex items-center gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 bg-blue-50 flex-shrink-0 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-[#1ca3fd]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Building2 className="w-4 h-4 text-[#1ca3fd]" />
                    <span className="font-semibold text-gray-900">Organized by</span>
                  </div>
                  <div className="text-lg font-medium text-gray-700">{organizer}</div>
                </div>
              </div>
            )}

            {/* Event Date */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <div className="text-sm font-medium text-gray-700 mb-2">Event Date</div>
              <div className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#1ca3fd]" />
                {event.event_date && event.event_end_date && event.event_end_date !== event.event_date
                  ? `${formatDate(event.event_date)} - ${formatDate(event.event_end_date)}`
                  : formatDate(event.event_date)}
              </div>
            </div>
          </div>

          {/* Right side - Quick info */}
          <div className="flex-shrink-0 space-y-4">
            {/* Venue */}
            {event.venue && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-5 h-5 text-[#1ca3fd]" />
                  <span className="font-medium text-gray-700">Venue</span>
                </div>
                <div className="text-gray-900">{event.venue}</div>
              </div>
            )}

            {/* Time */}
            {event.time && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-[#1ca3fd]" />
                  <span className="font-medium text-gray-700">Time</span>
                </div>
                <div className="text-gray-900">{event.time}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
