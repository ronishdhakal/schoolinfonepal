"use client"

export default function EventRegistration({ formData, onChange, errors = {} }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Registration Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Registration Type *</label>
          <select
            name="registration_type"
            value={formData.registration_type}
            onChange={onChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="free">Free</option>
            <option value="paid">Paid</option>
          </select>
          {errors.registration_type && <p className="mt-1 text-sm text-red-600">{errors.registration_type}</p>}
        </div>

        {formData.registration_type === "paid" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Registration Price *</label>
            <input
              type="number"
              step="0.01"
              name="registration_price"
              value={formData.registration_price}
              onChange={onChange}
              required={formData.registration_type === "paid"}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
            />
            {errors.registration_price && <p className="mt-1 text-sm text-red-600">{errors.registration_price}</p>}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Registration Deadline</label>
          <input
            type="date"
            name="registration_deadline"
            value={formData.registration_deadline}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Registration Link</label>
          <input
            type="url"
            name="registration_link"
            value={formData.registration_link}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://..."
          />
          {errors.registration_link && <p className="mt-1 text-sm text-red-600">{errors.registration_link}</p>}
        </div>
      </div>
    </div>
  )
}
