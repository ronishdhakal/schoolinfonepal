"use client"

const CourseContent = ({ formData, setFormData }) => {
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Course Content</h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Curriculum</label>
        <textarea
          value={formData.curriculum || ""}
          onChange={(e) => handleChange("curriculum", e.target.value)}
          rows={8}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Detailed curriculum, subjects, and course structure"
        />
        <p className="text-sm text-gray-500 mt-2">You can use HTML formatting or markdown for better structure</p>
      </div>
    </div>
  )
}

export default CourseContent
