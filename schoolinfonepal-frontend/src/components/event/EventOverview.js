"use client"
import { Calendar, Clock, MapPin, Users, CreditCard, LinkIcon, AlertCircle } from "lucide-react"

function formatDate(dateStr) {
  if (!dateStr) return ""
  const d = new Date(dateStr)
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
}

export default function EventOverview({ event }) {
  return (
    <section className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-8">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-50">
          <Calendar className="w-5 h-5 text-[#1ca3fd]" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Event Overview</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Date */}
        <OverviewItem
          icon={<Calendar className="text-[#1ca3fd]" />}
          label="Event Date"
          value={
            event.event_date
              ? event.event_end_date && event.event_end_date !== event.event_date
                ? `${formatDate(event.event_date)} - ${formatDate(event.event_end_date)}`
                : formatDate(event.event_date)
              : "Not specified"
          }
        />

        {/* Time */}
        <OverviewItem icon={<Clock className="text-[#1ca3fd]" />} label="Time" value={event.time || "Not specified"} />

        {/* Venue */}
        <OverviewItem
          icon={<MapPin className="text-[#1ca3fd]" />}
          label="Venue"
          value={event.venue || "Not specified"}
        />

        {/* Event Type */}
        <OverviewItem
          icon={<AlertCircle className="text-[#1ca3fd]" />}
          label="Event Type"
          value={
            event.event_type ? event.event_type.charAt(0).toUpperCase() + event.event_type.slice(1) : "Not specified"
          }
        />

        {/* Seat Limit */}
        {event.seat_limit && (
          <OverviewItem icon={<Users className="text-[#1ca3fd]" />} label="Seat Limit" value={event.seat_limit} />
        )}

        {/* Registration Type */}
        <OverviewItem
          icon={<CreditCard className="text-[#1ca3fd]" />}
          label="Registration"
          value={
            event.registration_type
              ? event.registration_type.charAt(0).toUpperCase() + event.registration_type.slice(1)
              : "Not specified"
          }
        />

        {/* Registration Price */}
        {event.registration_type === "paid" && event.registration_price && (
          <OverviewItem
            icon={<CreditCard className="text-[#1ca3fd]" />}
            label="Registration Price"
            value={`Rs. ${event.registration_price}`}
          />
        )}

        {/* Registration Deadline */}
        {event.registration_deadline && (
          <OverviewItem
            icon={<AlertCircle className="text-[#1ca3fd]" />}
            label="Registration Deadline"
            value={formatDate(event.registration_deadline)}
          />
        )}
      </div>

      {/* Registration Link */}
      {event.registration_link && (
        <div className="mt-8 pt-6 border-t border-gray-100">
          <a
            href={event.registration_link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1ca3fd] hover:bg-blue-600 text-white font-medium rounded-lg transition-colors shadow-sm"
          >
            <LinkIcon className="w-5 h-5" />
            Register Now
          </a>
        </div>
      )}
    </section>
  )
}

function OverviewItem({ icon, label, value }) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-lg border border-gray-100 bg-white transition-all duration-200 hover:shadow-md hover:border-blue-100">
      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-50 flex-shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-500 mb-1">{label}</div>
        <div className="text-base font-semibold text-gray-900">{value}</div>
      </div>
    </div>
  )
}
