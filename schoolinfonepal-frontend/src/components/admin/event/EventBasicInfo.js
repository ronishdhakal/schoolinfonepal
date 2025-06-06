"use client"

export default function EventBasicInfo({ formData, onChange, errors = {} }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Basic Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Event Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={onChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Auto-generated from title"
          />
          {errors.slug && <p className="mt-1 text-sm text-red-600">{errors.slug}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Event Type *</label>
          <select
            name="event_type"
            value={formData.event_type}
            onChange={onChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="physical">Physical</option>
            <option value="online">Online</option>
            <option value="hybrid">Hybrid</option>
          </select>
          {errors.event_type && <p className="mt-1 text-sm text-red-600">{errors.event_type}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Short Description</label>
          <input
            type="text"
            name="short_description"
            value={formData.short_description}
            onChange={onChange}
            maxLength={500}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Brief description for listings"
          />
          <p className="mt-1 text-sm text-gray-500">{formData.short_description?.length || 0}/500 characters</p>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={onChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Detailed event description"
          />
        </div>

        <div className="md:col-span-2 flex items-center space-x-6">
          <label className="flex items-center">
            <input type="checkbox" name="featured" checked={formData.featured} onChange={onChange} className="mr-2" />
            <span className="text-sm font-medium text-gray-700">Featured Event</span>
          </label>

          <label className="flex items-center">
            <input type="checkbox" name="is_active" checked={formData.is_active} onChange={onChange} className="mr-2" />
            <span className="text-sm font-medium text-gray-700">Active</span>
          </label>
        </div>
      </div>
    </div>
  )
}
