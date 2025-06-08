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
            value={formData.meta_title || ""}
            onChange={onChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${
              errors.meta_title ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="SEO title (defaults to regular title if empty)"
            maxLength={200}
          />
          {errors.meta_title && <p className="mt-1 text-sm text-red-600">{errors.meta_title}</p>}
          <p className="text-xs text-gray-500 mt-1">{(formData.meta_title || "").length}/200 characters</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
          <textarea
            name="meta_description"
            value={formData.meta_description || ""}
            onChange={onChange}
            rows={3}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${
              errors.meta_description ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="SEO description (defaults to summary if empty)"
            maxLength={500}
          />
          {errors.meta_description && <p className="mt-1 text-sm text-red-600">{errors.meta_description}</p>}
          <p className="text-xs text-gray-500 mt-1">{(formData.meta_description || "").length}/500 characters</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Meta Keywords</label>
          <input
            type="text"
            name="meta_keywords"
            value={formData.meta_keywords || ""}
            onChange={onChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${
              errors.meta_keywords ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Comma-separated keywords"
            maxLength={500}
          />
          {errors.meta_keywords && <p className="mt-1 text-sm text-red-600">{errors.meta_keywords}</p>}
          <p className="text-xs text-gray-500 mt-1">{(formData.meta_keywords || "").length}/500 characters</p>
        </div>
      </div>
    </div>
  )
}
