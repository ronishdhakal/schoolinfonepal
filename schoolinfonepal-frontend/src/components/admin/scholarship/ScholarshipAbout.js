"use client"

export default function ScholarshipAbout({ formData, setFormData, errors = {} }) {
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setFormData((prev) => ({
      ...prev,
      attachment: file,
    }))
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">About Scholarship</h2>

      <div className="space-y-6">
        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={formData.description || ""}
            onChange={(e) => handleInputChange("description", e.target.value)}
            rows={8}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.description ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter detailed description about the scholarship, eligibility criteria, application process, benefits, etc."
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          <p className="mt-1 text-sm text-gray-500">
            Provide comprehensive information about the scholarship including eligibility, benefits, and application
            details.
          </p>
        </div>

        {/* Attachment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Attachment</label>
          <input
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.attachment ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.attachment && <p className="mt-1 text-sm text-red-600">{errors.attachment}</p>}
          <p className="mt-1 text-sm text-gray-500">
            Upload scholarship brochure, application form, or related documents (PDF, DOC, DOCX, JPG, PNG)
          </p>
          {formData.attachment && (
            <p className="mt-2 text-sm text-green-600">Selected: {formData.attachment.name || formData.attachment}</p>
          )}
        </div>
      </div>
    </div>
  )
}
