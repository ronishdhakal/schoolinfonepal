"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { fetchEvents, fetchEventBySlug, deleteEvent } from "@/utils/api"
import EventForm from "@/components/admin/event/EventForm"
import EventHeader from "@/components/admin/event/EventHeader"
import AdminLayout from "@/components/admin/AdminLayout"
import Pagination from "@/components/common/Pagination"

export default function EventsAdmin() {
  const router = useRouter()
  const { action, slug } = router.query

  const [events, setEvents] = useState([])
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({ page: 1, count: 0 })

  const loadEvents = async () => {
    try {
      setLoading(true)
      const data = await fetchEvents({ page: pagination.page })
      setEvents(data.results || [])
      setPagination((prev) => ({ ...prev, count: data.count || 0 }))
      setError(null)
    } catch (err) {
      console.error("Error loading events:", err)
      setError("Failed to load events. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const loadEvent = async (eventSlug) => {
    try {
      const data = await fetchEventBySlug(eventSlug)
      setSelectedEvent(data)
    } catch (err) {
      console.error("Error loading event:", err)
      setError(err.message)
    }
  }

  useEffect(() => {
    loadEvents()
  }, [pagination.page])

  useEffect(() => {
    if (slug && (action === "edit" || action === "view")) {
      loadEvent(slug)
    } else {
      setSelectedEvent(null)
    }
  }, [slug, action])

  const handleCreate = () => {
    router.push("/admin/events?action=create")
  }

  const handleEdit = (event) => {
    router.push(`/admin/events?action=edit&slug=${event.slug}`)
  }

  const handleView = (event) => {
    router.push(`/admin/events?action=view&slug=${event.slug}`)
  }

  const handleDelete = async (event) => {
    if (!confirm("Are you sure you want to delete this event?")) return

    try {
      await deleteEvent(event.slug)
      await loadEvents()
      if (selectedEvent?.slug === event.slug) {
        router.push("/admin/events")
      }
    } catch (err) {
      console.error("Error deleting event:", err)
      alert("Failed to delete event: " + err.message)
    }
  }

  const handleFormSuccess = async () => {
    await loadEvents()
    router.push("/admin/events")
  }

  const handleCancel = () => {
    router.push("/admin/events")
  }

  const getOrganizerName = (event) => {
    if (event.organizer_custom) return event.organizer_custom
    if (event.organizer_school) return event.organizer_school.name || event.organizer_school
    if (event.organizer_university) return event.organizer_university.name || event.organizer_university
    return "Unknown"
  }

  // Show form for create/edit
  if (action === "create" || action === "edit") {
    return (
      <AdminLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <EventForm
            event={action === "edit" ? selectedEvent : null}
            onSuccess={handleFormSuccess}
            onCancel={handleCancel}
          />
        </div>
      </AdminLayout>
    )
  }

  // Show detail view
  if (action === "view" && selectedEvent) {
    return (
      <AdminLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <EventHeader
            event={selectedEvent}
            onEdit={() => handleEdit(selectedEvent)}
            onDelete={() => handleDelete(selectedEvent)}
          />
        </div>
      </AdminLayout>
    )
  }

  // Show list view
  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Events</h1>
          <button onClick={handleCreate} className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
            Create Event
          </button>
        </div>

        {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded">{error}</div>}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-2 text-gray-600">Loading events...</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Event</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Date & Time</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Organizer</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {events.map((event) => (
                    <tr key={event.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{event.title}</div>
                          <div className="text-sm text-gray-500">{event.venue}</div>
                          {event.featured && (
                            <span className="inline-flex px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded mt-1">
                              Featured
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(event.event_date).toLocaleDateString()}
                          {event.event_end_date && ` - ${new Date(event.event_end_date).toLocaleDateString()}`}
                        </div>
                        <div className="text-sm text-gray-500">{event.time}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{getOrganizerName(event)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          event.event_type === "online"
                            ? "bg-green-100 text-green-800"
                            : event.event_type === "hybrid"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-blue-100 text-blue-800"
                        }`}>
                          {event.event_type.charAt(0).toUpperCase() + event.event_type.slice(1)}
                        </span>
                        <div className="text-xs text-gray-500 mt-1">
                          {event.registration_type === "free" ? "Free" : `$${event.registration_price}`}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => handleView(event)} className="text-indigo-600 hover:text-indigo-900 mr-4">View</button>
                        <button onClick={() => handleEdit(event)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                        <button onClick={() => handleDelete(event)} className="text-red-600 hover:text-red-900">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              page={pagination.page}
              total={pagination.count}
              pageSize={12}
              onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
            />
          </>
        )}
      </div>
    </AdminLayout>
  )
}
