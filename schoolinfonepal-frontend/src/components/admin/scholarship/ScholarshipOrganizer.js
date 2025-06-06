"use client"

import SearchableSelect from "@/components/common/SearchableSelect"

export default function ScholarshipOrganizer({ formData, onChange, schools, universities, errors }) {
  const handleOrganizerChange = (field, value) => {
    // Clear other organizer fields when one is selected
    const updates = {
      organizer_school: field === "organizer_school" ? value : "",
      organizer_university: field === "organizer_university" ? value : "",
      organizer_custom: field === "organizer_custom" ? value : "",
    }

    Object.entries(updates).forEach(([key, val]) => {
      onChange({
        target: {
          name: key,
          value: val,
        },
      })
    })
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Organizer Information</h3>
      <p className="text-sm text-gray-600 mb-4">
        Select one organizer type. You can choose a school, university, or enter a custom organizer name.
      </p>

      <div className="space-y-6">
        {/* School Organizer */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Organizer School</label>
          <SearchableSelect
            options={schools}
            value={formData.organizer_school}
            onChange={(value) => handleOrganizerChange("organizer_school", value)}
            placeholder="Search and select a school..."
            displayKey="name"
            valueKey="id"
          />
        </div>

        {/* University Organizer */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Organizer University</label>
          <SearchableSelect
            options={universities}
            value={formData.organizer_university}
            onChange={(value) => handleOrganizerChange("organizer_university", value)}
            placeholder="Search and select a university..."
            displayKey="name"
            valueKey="id"
          />
        </div>

        {/* Custom Organizer */}
        <div>
          <label htmlFor="organizer_custom" className="block text-sm font-medium text-gray-700 mb-2">
            Custom Organizer
          </label>
          <input
            type="text"
            id="organizer_custom"
            name="organizer_custom"
            value={formData.organizer_custom}
            onChange={(e) => handleOrganizerChange("organizer_custom", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter custom organizer name"
          />
        </div>

        {/* Error Display */}
        {errors.organizer && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{errors.organizer}</p>
          </div>
        )}

        {/* Current Selection Display */}
        {(formData.organizer_school || formData.organizer_university || formData.organizer_custom) && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-800">
              <strong>Selected Organizer:</strong>{" "}
              {formData.organizer_school && schools.find((s) => s.id == formData.organizer_school)?.name}
              {formData.organizer_university && universities.find((u) => u.id == formData.organizer_university)?.name}
              {formData.organizer_custom}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
