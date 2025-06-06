"use client"

const UniversityAbout = ({ formData, setFormData }) => {
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">About University</h3>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Salient Features</label>
          <textarea
            value={formData.salient_features || ""}
            onChange={(e) => handleChange("salient_features", e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Key features and highlights of the university"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">About University</label>
          <textarea
            value={formData.about || ""}
            onChange={(e) => handleChange("about", e.target.value)}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Detailed description about the university"
          />
        </div>
      </div>
    </div>
  )
}

export default UniversityAbout
