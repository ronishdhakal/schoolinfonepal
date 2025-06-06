"use client"

export default function InformationMeta({ formData, onChange, errors = {} }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">SEO Metadata</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Meta Title</label>
          <input
            type="text"
            name="meta_title"
            value={formData.meta_title}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            placeholder="SEO title (defaults to regular title if empty)"
          />
          <p className="text-xs text-gray-500 mt-1">{formData.meta_title?.length || 0}/200 characters</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
          <textarea
            name="meta_description"
            value={formData.meta_description}
            onChange={onChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            placeholder="SEO description (defaults to summary if empty)"
          />
          <p className="text-xs text-gray-500 mt-1">{formData.meta_description?.length || 0}/500 characters</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Meta Keywords</label>
          <input
            type="text"
            name="meta_keywords"
            value={formData.meta_keywords}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            placeholder="Comma-separated keywords"
          />
          <p className="text-xs text-gray-500 mt-1">{formData.meta_keywords?.length || 0}/500 characters</p>
        </div>
      </div>
    </div>
  )
}
