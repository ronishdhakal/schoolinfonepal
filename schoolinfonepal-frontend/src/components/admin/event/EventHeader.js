"use client"

export default function EventHeader({ event, onEdit, onDelete }) {
  if (!event) return null

  const getOrganizerName = () => {
    if (event.organizer_custom) return event.organizer_custom
    if (event.organizer_school) return event.organizer_school.name || event.organizer_school
    if (event.organizer_university) return event.organizer_university.name || event.organizer_university
    return "Unknown Organizer"
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null
    if (imagePath.startsWith("http")) return imagePath
    return `${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://127.0.0.1:8000"}${imagePath}`
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.title}</h1>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>Slug: {event.slug}</span>
            {event.featured && (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">Featured</span>
            )}
            {!event.is_active && (
              <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">Inactive</span>
            )}
          </div>
          {event.short_description && <p className="mt-2 text-gray-600">{event.short_description}</p>}
        </div>
        <div className="flex space-x-3">
          <button onClick={onEdit} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Edit Event
          </button>
          <button onClick={onDelete} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
            Delete Event
          </button>
        </div>
      </div>

      {/* Media Section */}
      {(event.featured_image || event.banner_image) && (
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {event.featured_image && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Featured Image</h3>
                <img
                  src={getImageUrl(event.featured_image) || "/placeholder.svg"}
                  alt={event.title}
                  className="w-full h-48 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src = "/placeholder.svg?height=192&width=300"
                  }}
                />
              </div>
            )}
            {event.banner_image && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Banner Image</h3>
                <img
                  src={getImageUrl(event.banner_image) || "/placeholder.svg"}
                  alt={event.title}
                  className="w-full h-48 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src = "/placeholder.svg?height=192&width=300"
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Event Details</h2>
          <div className="space-y-3">
            <div>
              <span className="font-medium text-gray-700">Date:</span>
              <span className="ml-2 text-gray-900">
                {formatDate(event.event_date)}
                {event.event_end_date && ` - ${formatDate(event.event_end_date)}`}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Time:</span>
              <span className="ml-2 text-gray-900">{event.time}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Venue:</span>
              <span className="ml-2 text-gray-900">{event.venue}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Type:</span>
              <span className="ml-2">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    event.event_type === "online"
                      ? "bg-green-100 text-green-800"
                      : event.event_type === "hybrid"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {event.event_type.charAt(0).toUpperCase() + event.event_type.slice(1)}
                </span>
              </span>
            </div>
            {event.seat_limit && (
              <div>
                <span className="font-medium text-gray-700">Seat Limit:</span>
                <span className="ml-2 text-gray-900">{event.seat_limit}</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Organizer & Registration</h2>
          <div className="space-y-3">
            <div>
              <span className="font-medium text-gray-700">Organizer:</span>
              <span className="ml-2 text-gray-900">{getOrganizerName()}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Registration:</span>
              <span className="ml-2">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    event.registration_type === "free" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"
                  }`}
                >
                  {event.registration_type === "free" ? "Free" : `Paid - $${event.registration_price}`}
                </span>
              </span>
            </div>
            {event.registration_deadline && (
              <div>
                <span className="font-medium text-gray-700">Registration Deadline:</span>
                <span className="ml-2 text-gray-900">{formatDate(event.registration_deadline)}</span>
              </div>
            )}
            {event.registration_link && (
              <div>
                <span className="font-medium text-gray-700">Registration Link:</span>
                <div className="mt-1">
                  <a
                    href={event.registration_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 break-all"
                  >
                    {event.registration_link}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Section */}
      {event.description && (
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Description</h2>
          <div className="text-gray-900 whitespace-pre-wrap">{event.description}</div>
        </div>
      )}

      {/* SEO Meta Section */}
      {(event.meta_title || event.meta_description || event.meta_keywords) && (
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">SEO Meta Information</h2>
          <div className="space-y-3">
            {event.meta_title && (
              <div>
                <span className="font-medium text-gray-700">Meta Title:</span>
                <span className="ml-2 text-gray-900">{event.meta_title}</span>
              </div>
            )}
            {event.meta_description && (
              <div>
                <span className="font-medium text-gray-700">Meta Description:</span>
                <div className="mt-1 text-gray-900">{event.meta_description}</div>
              </div>
            )}
            {event.meta_keywords && (
              <div>
                <span className="font-medium text-gray-700">Meta Keywords:</span>
                <span className="ml-2 text-gray-900">{event.meta_keywords}</span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Metadata</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Created:</span>
            <span className="ml-2 text-gray-900">{new Date(event.created_at).toLocaleDateString()}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Updated:</span>
            <span className="ml-2 text-gray-900">{new Date(event.updated_at).toLocaleDateString()}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Status:</span>
            <span className="ml-2">
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  event.featured ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"
                }`}
              >
                {event.featured ? "Featured" : "Regular"}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
