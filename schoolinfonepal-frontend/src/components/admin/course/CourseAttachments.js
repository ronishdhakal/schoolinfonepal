"use client"

const CourseAttachments = ({ formData, setFormData }) => {
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    setFormData((prev) => ({
      ...prev,
      attachment_files: [...(prev.attachment_files || []), ...files],
    }))
  }

  const removeFile = (index) => {
    setFormData((prev) => ({
      ...prev,
      attachment_files: (prev.attachment_files || []).filter((_, i) => i !== index),
    }))
  }

  const removeExistingAttachment = (index) => {
    const attachmentToRemove = formData.attachments[index]

    // Add to removal list and remove from current attachments
    setFormData((prev) => ({
      ...prev,
      attachments: (prev.attachments || []).filter((_, i) => i !== index),
      attachments_to_remove: [...(prev.attachments_to_remove || []), attachmentToRemove.id],
    }))
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Course Attachments</h3>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Add New Attachments</label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
          />
          <p className="text-sm text-gray-500 mt-1">Supported formats: PDF, DOC, DOCX, TXT, JPG, PNG</p>
        </div>

        {/* New files to be uploaded */}
        {formData.attachment_files && formData.attachment_files.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">New Files to Upload:</h4>
            <div className="space-y-2">
              {formData.attachment_files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{file.name}</p>
                      <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Existing attachments */}
        {formData.attachments && formData.attachments.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Current Attachments:</h4>
            <div className="space-y-2">
              {formData.attachments.map((attachment, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                      <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{attachment.description || "Attachment"}</p>
                      <a
                        href={attachment.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-indigo-600 hover:text-indigo-800"
                      >
                        View File
                      </a>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeExistingAttachment(index)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CourseAttachments
