"use client"

export default function EventDateTime({ formData, onChange, errors = {} }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Date & Time Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Event Date *</label>
          <input
            type="date"
            name="event_date"
            value={formData.event_date}
            onChange={onChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.event_date && <p className="mt-1 text-sm text-red-600">{errors.event_date}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Event End Date</label>
          <input
            type="date"
            name="event_end_date"
            value={formData.event_end_date}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="mt-1 text-sm text-gray-500">Leave empty for single-day events</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Time *</label>
          <input
            type="text"
            name="time"
            value={formData.time}
            onChange={onChange}
            required
            placeholder="e.g. 10:00 AM - 5:00 PM"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.time && <p className="mt-1 text-sm text-red-600">{errors.time}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Venue *</label>
          <input
            type="text"
            name="venue"
            value={formData.venue}
            onChange={onChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.venue && <p className="mt-1 text-sm text-red-600">{errors.venue}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Seat Limit</label>
          <input
            type="number"
            name="seat_limit"
            value={formData.seat_limit}
            onChange={onChange}
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Leave empty for unlimited"
          />
        </div>
      </div>
    </div>
  )
}
