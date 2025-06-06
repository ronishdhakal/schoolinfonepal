"use client"

const CourseMeta = ({ formData, setFormData }) => {
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      handleChange("og_image", file)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">SEO & Meta Information</h3>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Meta Title</label>
            <input
              type="text"
              value={formData.meta_title || ""}
              onChange={(e) => handleChange("meta_title", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="SEO title for search engines"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">OG Title</label>
            <input
              type="text"
              value={formData.og_title || ""}
              onChange={(e) => handleChange("og_title", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Title for social media sharing"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
          <textarea
            value={formData.meta_description || ""}
            onChange={(e) => handleChange("meta_description", e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="SEO description for search engines"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">OG Description</label>
          <textarea
            value={formData.og_description || ""}
            onChange={(e) => handleChange("og_description", e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Description for social media sharing"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">OG Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {formData.og_image && typeof formData.og_image === "string" && (
            <div className="mt-2">
              <img
                src={formData.og_image || "/placeholder.svg"}
                alt="Current OG Image"
                className="h-20 w-32 object-cover rounded border"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CourseMeta
