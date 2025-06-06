"use client"

import SearchableSelect from "@/components/common/SearchableSelect"

export default function ScholarshipRelations({ formData, onChange, courses, levels, universities, errors }) {
  const handleMultiSelectChange = (field, selectedIds) => {
    onChange({
      target: {
        name: field,
        value: selectedIds,
      },
    })
  }

  const handleSingleSelectChange = (field, value) => {
    onChange({
      target: {
        name: field,
        value: value,
      },
    })
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Information</h3>

      <div className="space-y-6">
        {/* Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Education Level</label>
          <SearchableSelect
            options={levels}
            value={formData.level}
            onChange={(value) => handleSingleSelectChange("level", value)}
            placeholder="Select education level..."
            displayKey="name"
            valueKey="id"
          />
          {errors.level && <p className="mt-1 text-sm text-red-600">{errors.level}</p>}
        </div>

        {/* Courses */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Applicable Courses</label>
          <SearchableSelect
            options={courses}
            value={formData.courses}
            onChange={(value) => handleMultiSelectChange("courses", value)}
            placeholder="Search and select courses..."
            displayKey="name"
            valueKey="id"
            multiple={true}
          />
          {errors.courses && <p className="mt-1 text-sm text-red-600">{errors.courses}</p>}
        </div>

        {/* University Link */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Associated University</label>
          <SearchableSelect
            options={universities}
            value={formData.university}
            onChange={(value) => handleSingleSelectChange("university", value)}
            placeholder="Link to a university (optional)..."
            displayKey="name"
            valueKey="id"
          />
          <p className="mt-1 text-sm text-gray-500">Optional: Link this scholarship to a specific university</p>
        </div>
      </div>

      {/* Summary */}
      {(formData.level || formData.courses?.length > 0 || formData.university) && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Selection Summary:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            {formData.level && <li>• Level: {levels.find((l) => l.id == formData.level)?.name}</li>}
            {formData.courses?.length > 0 && <li>• Courses: {formData.courses.length} selected</li>}
            {formData.university && (
              <li>• University: {universities.find((u) => u.id == formData.university)?.name}</li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
