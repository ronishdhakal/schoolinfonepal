"use client"

export default function ScholarshipDates({ formData, onChange, errors }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Period</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active From */}
        <div>
          <label htmlFor="active_from" className="block text-sm font-medium text-gray-700 mb-2">
            Active From *
          </label>
          <input
            type="date"
            id="active_from"
            name="active_from"
            value={formData.active_from}
            onChange={onChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.active_from ? "border-red-300 focus:border-red-500" : "border-gray-300 focus:border-blue-500"
            }`}
          />
          {errors.active_from && <p className="mt-1 text-sm text-red-600">{errors.active_from}</p>}
        </div>

        {/* Active Until */}
        <div>
          <label htmlFor="active_until" className="block text-sm font-medium text-gray-700 mb-2">
            Active Until *
          </label>
          <input
            type="date"
            id="active_until"
            name="active_until"
            value={formData.active_until}
            onChange={onChange}
            min={formData.active_from}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.active_until ? "border-red-300 focus:border-red-500" : "border-gray-300 focus:border-blue-500"
            }`}
          />
          {errors.active_until && <p className="mt-1 text-sm text-red-600">{errors.active_until}</p>}
        </div>
      </div>

      {formData.active_from && formData.active_until && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800">
            <strong>Duration:</strong> {new Date(formData.active_from).toLocaleDateString()} to{" "}
            {new Date(formData.active_until).toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  )
}
