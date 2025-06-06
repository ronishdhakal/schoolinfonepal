"use client"

export default function EventMedia({ formData, featuredImage, bannerImage, onImageChange, getImageUrl }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Media</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onImageChange(e, "featured")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {(featuredImage || formData.featured_image) && (
            <div className="mt-2">
              <img
                src={featuredImage ? URL.createObjectURL(featuredImage) : getImageUrl(formData.featured_image)}
                alt="Featured preview"
                className="h-32 w-full object-cover rounded"
                onError={(e) => {
                  e.target.src = "/placeholder.svg?height=128&width=200"
                }}
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Banner Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onImageChange(e, "banner")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {(bannerImage || formData.banner_image) && (
            <div className="mt-2">
              <img
                src={bannerImage ? URL.createObjectURL(bannerImage) : getImageUrl(formData.banner_image)}
                alt="Banner preview"
                className="h-32 w-full object-cover rounded"
                onError={(e) => {
                  e.target.src = "/placeholder.svg?height=128&width=200"
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
