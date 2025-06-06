// src/components/admin/event/EventOrganizer.jsx
"use client"

import SearchableSelect from "@/components/common/SearchableSelect"

export default function EventOrganizer({ formData, onChange, schools = [], universities = [], errors = {} }) {
  const handleOrganizerChange = (field, value) => {
    // Clear other organizer fields when one is selected
    const updates = {
      organizer_school: "",
      organizer_university: "",
      organizer_custom: "",
      [field]: value,
    }

    Object.keys(updates).forEach((key) => {
      onChange({ target: { name: key, value: updates[key] } })
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Organizer Information</h2>
      <p className="text-sm text-gray-600 mb-4">Select one organizer type</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Organizer School</label>
          <SearchableSelect
            options={schools}
            value={formData.organizer_school}
            onChange={(value) => handleOrganizerChange("organizer_school", value)}
            placeholder="Search schools..."
            disabled={formData.organizer_university || formData.organizer_custom}
          />
          {errors.organizer_school && <p className="mt-1 text-sm text-red-600">{errors.organizer_school}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Organizer University</label>
          <SearchableSelect
            options={universities}
            value={formData.organizer_university}
            onChange={(value) => handleOrganizerChange("organizer_university", value)}
            placeholder="Search universities..."
            disabled={formData.organizer_school || formData.organizer_custom}
          />
          {errors.organizer_university && <p className="mt-1 text-sm text-red-600">{errors.organizer_university}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Custom Organizer</label>
          <input
            type="text"
            name="organizer_custom"
            value={formData.organizer_custom}
            onChange={(e) => handleOrganizerChange("organizer_custom", e.target.value)}
            placeholder="If not listed above"
            disabled={formData.organizer_school || formData.organizer_university}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
          {errors.organizer_custom && <p className="mt-1 text-sm text-red-600">{errors.organizer_custom}</p>}
        </div>
      </div>
    </div>
  )
}