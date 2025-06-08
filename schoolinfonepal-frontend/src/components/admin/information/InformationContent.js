"use client"

export default function InformationContent({ formData, onChange, errors = {} }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Content</h2>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Top Description</label>
          <textarea
            name="top_description"
            value={formData.top_description || ""}
            onChange={onChange}
            rows={4}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${
              errors.top_description ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Content that appears above the main content"
          />
          {errors.top_description && <p className="mt-1 text-sm text-red-600">{errors.top_description}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Main Content *</label>
          <textarea
            name="content"
            value={formData.content || ""}
            onChange={onChange}
            rows={8}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${
              errors.content ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Main content of the information"
          />
          {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Below Description</label>
          <textarea
            name="below_description"
            value={formData.below_description || ""}
            onChange={onChange}
            rows={4}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${
              errors.below_description ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Content that appears below the main content"
          />
          {errors.below_description && <p className="mt-1 text-sm text-red-600">{errors.below_description}</p>}
        </div>
      </div>
    </div>
  )
}
