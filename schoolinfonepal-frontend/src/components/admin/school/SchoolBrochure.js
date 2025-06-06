"use client"

const SchoolBrochure = ({ formData, setFormData }) => {
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    const newBrochures = files.map((file) => ({
      file: file,
      description: "",
    }))

    setFormData((prev) => ({
      ...prev,
      brochures: [...(prev.brochures || []), ...newBrochures],
    }))
  }

  const updateDescription = (index, description) => {
    const brochures = [...(formData.brochures || [])]
    brochures[index] = { ...brochures[index], description }
    setFormData((prev) => ({ ...prev, brochures }))
  }

  const removeBrochure = (index) => {
    const brochures = (formData.brochures || []).filter((_, i) => i !== index)
    setFormData((prev) => ({ ...prev, brochures }))
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">School Brochures & Documents</h3>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Add Brochures/Documents</label>
          <input
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <p className="text-sm text-gray-500 mt-1">Supported formats: PDF, DOC, DOCX, TXT, JPG, PNG</p>
        </div>

        {formData.brochures && formData.brochures.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-700">Uploaded Brochures:</h4>
            {formData.brochures.map((brochure, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {brochure.file instanceof File ? brochure.file.name : "Existing Document"}
                      </p>
                      {brochure.file instanceof File && (
                        <p className="text-xs text-gray-500">{(brochure.file.size / 1024 / 1024).toFixed(2)} MB</p>
                      )}
                      {typeof brochure.file === "string" && (
                        <a
                          href={brochure.file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-indigo-600 hover:text-indigo-800"
                        >
                          View Document
                        </a>
                      )}
                    </div>
                    <input
                      type="text"
                      value={brochure.description || ""}
                      onChange={(e) => updateDescription(index, e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Document description"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeBrochure(index)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Remove
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

export default SchoolBrochure
