"use client"
import { useState, useEffect } from "react"
import { fetchEvents } from "@/utils/api"
import { Calendar, ArrowRight } from "lucide-react"
import Link from "next/link"
import EventCard from "./EventCard"

export default function EventSidebar({ currentEventId }) {
  const [relatedEvents, setRelatedEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRelatedEvents = async () => {
      setLoading(true)
      try {
        // Fetch recent active events
        const response = await fetchEvents({
          page_size: 6,
          ordering: "-event_date",
        })

        const events = response.results || response || []
        // Filter out the current event and only show active events
        const filtered = events.filter((event) => event.id !== currentEventId && event.is_active)
        setRelatedEvents(filtered.slice(0, 5)) // Show max 5 related events
      } catch (error) {
        console.error("Error fetching related events:", error)
        setRelatedEvents([])
      } finally {
        setLoading(false)
      }
    }

    if (currentEventId) {
      fetchRelatedEvents()
    }
  }, [currentEventId])

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-[#1ca3fd]" />
          <h3 className="text-lg font-semibold text-gray-900">Other Active Events</h3>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!relatedEvents.length) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-[#1ca3fd]" />
          <h3 className="text-lg font-semibold text-gray-900">Other Active Events</h3>
        </div>
        <div className="text-center py-8 text-gray-500">
          <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No other active events found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#1ca3fd]" />
          <h3 className="text-lg font-semibold text-gray-900">Other Active Events</h3>
        </div>
        <Link href="/event" className="text-sm text-[#1ca3fd] hover:text-blue-600 flex items-center gap-1">
          View All
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="space-y-4">
        {relatedEvents.map((event) => (
          <EventCard key={event.id} event={event} compact />
        ))}
      </div>

      {relatedEvents.length >= 5 && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <Link
            href="/event"
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-lg transition-colors"
          >
            <span>View All Events</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  )
}
