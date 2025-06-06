"use client"

const SchoolSocialMedia = ({ formData, setFormData }) => {
  const platforms = [
    { value: "facebook", label: "Facebook" },
    { value: "instagram", label: "Instagram" },
    { value: "twitter", label: "Twitter" },
    { value: "linkedin", label: "LinkedIn" },
    { value: "youtube", label: "YouTube" },
    { value: "tiktok", label: "TikTok" },
    { value: "other", label: "Other" },
  ]

  const handleSocialMediaChange = (index, field, value) => {
    const socialMedia = [...(formData.social_media || [])]
    socialMedia[index] = { ...socialMedia[index], [field]: value }
    setFormData((prev) => ({ ...prev, social_media: socialMedia }))
  }

  const addSocialMedia = () => {
    setFormData((prev) => ({
      ...prev,
      social_media: [...(prev.social_media || []), { platform: "", url: "" }],
    }))
  }

  const removeSocialMedia = (index) => {
    const socialMedia = (formData.social_media || []).filter((_, i) => i !== index)
    setFormData((prev) => ({ ...prev, social_media: socialMedia }))
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Social Media Links</h3>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">Add social media profiles for the school</p>
          <button
            type="button"
            onClick={addSocialMedia}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            + Add Social Media
          </button>
        </div>

        {formData.social_media && formData.social_media.length > 0 && (
          <div className="space-y-4">
            {formData.social_media.map((social, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-gray-200 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                  <select
                    value={social.platform || ""}
                    onChange={(e) => handleSocialMediaChange(index, "platform", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select Platform</option>
                    {platforms.map((platform) => (
                      <option key={platform.value} value={platform.value}>
                        {platform.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                  <input
                    type="url"
                    value={social.url || ""}
                    onChange={(e) => handleSocialMediaChange(index, "url", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="https://..."
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => removeSocialMedia(index)}
                    className="w-full px-3 py-2 text-red-600 hover:text-red-800 text-sm font-medium border border-red-300 rounded-lg hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {(!formData.social_media || formData.social_media.length === 0) && (
          <p className="text-gray-500 text-sm text-center py-4">No social media links added</p>
        )}
      </div>
    </div>
  )
}

export default SchoolSocialMedia
