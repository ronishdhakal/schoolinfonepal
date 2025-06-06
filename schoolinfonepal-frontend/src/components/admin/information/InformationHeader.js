"use client"

export default function InformationHeader({ information, onEdit, onDelete }) {
  if (!information) return null

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null
    if (imagePath.startsWith("http")) return imagePath
    return `${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://127.0.0.1:8000"}${imagePath}`
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{information.title}</h1>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>Slug: {information.slug}</span>
            {information.featured && (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">Featured</span>
            )}
            {!information.is_active && (
              <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">Inactive</span>
            )}
          </div>
          {information.summary && <p className="mt-2 text-gray-600">{information.summary}</p>}
        </div>
        <div className="flex space-x-3">
          <button onClick={onEdit} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Edit Information
          </button>
          <button onClick={onDelete} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
            Delete Information
          </button>
        </div>
      </div>

      {/* Media Section */}
      {(information.featured_image || information.banner_image) && (
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {information.featured_image && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Featured Image</h3>
                <img
                  src={getImageUrl(information.featured_image) || "/placeholder.svg"}
                  alt={information.title}
                  className="w-full h-48 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src = "/placeholder.svg?height=192&width=300"
                  }}
                />
              </div>
            )}
            {information.banner_image && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Banner Image</h3>
                <img
                  src={getImageUrl(information.banner_image) || "/placeholder.svg"}
                  alt={information.title}
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Content</h2>

            {information.top_description && (
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-2">Top Description</h3>
                <div className="text-gray-900 whitespace-pre-wrap">{information.top_description}</div>
              </div>
            )}

            {information.content && (
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-2">Main Content</h3>
                <div className="text-gray-900 whitespace-pre-wrap">{information.content}</div>
              </div>
            )}

            {information.below_description && (
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Below Description</h3>
                <div className="text-gray-900 whitespace-pre-wrap">{information.below_description}</div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Related Entities</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {information.universities && information.universities.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Universities</h3>
                  <div className="space-y-1">
                    {information.universities.map((university, index) => (
                      <span
                        key={index}
                        className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm mr-2 mb-1"
                      >
                        {university.name || university.title || university}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {information.schools && information.schools.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Schools</h3>
                  <div className="space-y-1">
                    {information.schools.map((school, index) => (
                      <span
                        key={index}
                        className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded text-sm mr-2 mb-1"
                      >
                        {school.name || school.title || school}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {information.courses && information.courses.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Courses</h3>
                  <div className="space-y-1">
                    {information.courses.map((course, index) => (
                      <span
                        key={index}
                        className="inline-block px-2 py-1 bg-purple-100 text-purple-800 rounded text-sm mr-2 mb-1"
                      >
                        {course.title || course.name || course}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {information.levels && information.levels.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Levels</h3>
                  <div className="space-y-1">
                    {information.levels.map((level, index) => (
                      <span
                        key={index}
                        className="inline-block px-2 py-1 bg-orange-100 text-orange-800 rounded text-sm mr-2 mb-1"
                      >
                        {level.title || level.name || level}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Details</h2>
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-700">Published:</span>
                <span className="ml-2 text-gray-900">{formatDate(information.published_date)}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Category:</span>
                <span className="ml-2 text-gray-900">{information.category?.name || information.category}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Status:</span>
                <span className="ml-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      information.featured ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {information.featured ? "Featured" : "Regular"}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* SEO Meta Section */}
          {(information.meta_title || information.meta_description || information.meta_keywords) && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">SEO Meta Information</h2>
              <div className="space-y-3">
                {information.meta_title && (
                  <div>
                    <span className="font-medium text-gray-700">Meta Title:</span>
                    <span className="ml-2 text-gray-900">{information.meta_title}</span>
                  </div>
                )}
                {information.meta_description && (
                  <div>
                    <span className="font-medium text-gray-700">Meta Description:</span>
                    <div className="mt-1 text-gray-900">{information.meta_description}</div>
                  </div>
                )}
                {information.meta_keywords && (
                  <div>
                    <span className="font-medium text-gray-700">Meta Keywords:</span>
                    <span className="ml-2 text-gray-900">{information.meta_keywords}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Metadata</h2>
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium text-gray-700">Created:</span>
                <span className="ml-2 text-gray-900">{new Date(information.created_at).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Updated:</span>
                <span className="ml-2 text-gray-900">{new Date(information.updated_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
