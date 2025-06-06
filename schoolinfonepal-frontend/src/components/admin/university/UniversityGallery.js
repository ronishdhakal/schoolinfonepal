"use client"

const UniversityGallery = ({ formData, setFormData }) => {
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    const newImages = files.map((file) => ({
      image: file,
      caption: "",
    }))

    setFormData((prev) => ({
      ...prev,
      gallery: [...(prev.gallery || []), ...newImages],
    }))
  }

  const updateCaption = (index, caption) => {
    const gallery = [...(formData.gallery || [])]
    gallery[index] = { ...gallery[index], caption }
    setFormData((prev) => ({ ...prev, gallery }))
  }

  const removeImage = (index) => {
    const gallery = (formData.gallery || []).filter((_, i) => i !== index)
    setFormData((prev) => ({ ...prev, gallery }))
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">University Gallery</h3>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Add Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {formData.gallery && formData.gallery.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {formData.gallery.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="aspect-video bg-gray-100 rounded-lg mb-3 overflow-hidden">
                  <img
                    src={
                      item.image instanceof File
                        ? URL.createObjectURL(item.image)
                        : item.image || "/placeholder.svg?height=200&width=300"
                    }
                    alt={item.caption || "Gallery image"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={item.caption || ""}
                    onChange={(e) => updateCaption(index, e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Image caption"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="w-full text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Remove Image
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default UniversityGallery
