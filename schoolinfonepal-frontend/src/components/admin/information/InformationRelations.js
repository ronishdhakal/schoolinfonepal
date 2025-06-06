"use client"

import { useState } from "react"

export default function InformationRelations({
  formData,
  onChange,
  schools = [],
  universities = [],
  courses = [],
  levels = [],
  errors = {},
}) {
  const [searchTerms, setSearchTerms] = useState({
    universities: "",
    schools: "",
    courses: "",
    levels: "",
  })

  const handleMultiSelect = (name, id) => {
    const currentValues = formData[name] || []
    const newValues = currentValues.includes(id) ? currentValues.filter((v) => v !== id) : [...currentValues, id]

    const event = {
      target: {
        name,
        value: newValues,
      },
    }
    onChange(event)
  }

  const handleSearchChange = (field, value) => {
    setSearchTerms((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const filterItems = (items, field) => {
    const searchTerm = searchTerms[field].toLowerCase()
    if (!searchTerm) return items

    return items.filter((item) => (item.name || item.title || "").toLowerCase().includes(searchTerm))
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Related Entities</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Universities</label>
          <div className="border border-gray-300 rounded-md overflow-hidden">
            <div className="p-2 border-b border-gray-300">
              <input
                type="text"
                placeholder="Search universities..."
                value={searchTerms.universities}
                onChange={(e) => handleSearchChange("universities", e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />
            </div>
            <div className="max-h-40 overflow-y-auto p-2">
              {filterItems(universities, "universities").map((university) => (
                <label key={university.id} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={formData.universities?.includes(university.id)}
                    onChange={() => handleMultiSelect("universities", university.id)}
                    className="mr-2"
                  />
                  <span className="text-sm text-black">{university.name || university.title}</span>
                </label>
              ))}
              {filterItems(universities, "universities").length === 0 && (
                <p className="text-sm text-gray-500 p-1">No universities found</p>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Schools</label>
          <div className="border border-gray-300 rounded-md overflow-hidden">
            <div className="p-2 border-b border-gray-300">
              <input
                type="text"
                placeholder="Search schools..."
                value={searchTerms.schools}
                onChange={(e) => handleSearchChange("schools", e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />
            </div>
            <div className="max-h-40 overflow-y-auto p-2">
              {filterItems(schools, "schools").map((school) => (
                <label key={school.id} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={formData.schools?.includes(school.id)}
                    onChange={() => handleMultiSelect("schools", school.id)}
                    className="mr-2"
                  />
                  <span className="text-sm text-black">{school.name || school.title}</span>
                </label>
              ))}
              {filterItems(schools, "schools").length === 0 && (
                <p className="text-sm text-gray-500 p-1">No schools found</p>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Courses</label>
          <div className="border border-gray-300 rounded-md overflow-hidden">
            <div className="p-2 border-b border-gray-300">
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerms.courses}
                onChange={(e) => handleSearchChange("courses", e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />
            </div>
            <div className="max-h-40 overflow-y-auto p-2">
              {filterItems(courses, "courses").map((course) => (
                <label key={course.id} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={formData.courses?.includes(course.id)}
                    onChange={() => handleMultiSelect("courses", course.id)}
                    className="mr-2"
                  />
                  <span className="text-sm text-black">{course.name || course.title}</span>
                </label>
              ))}
              {filterItems(courses, "courses").length === 0 && (
                <p className="text-sm text-gray-500 p-1">No courses found</p>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Levels</label>
          <div className="border border-gray-300 rounded-md overflow-hidden">
            <div className="p-2 border-b border-gray-300">
              <input
                type="text"
                placeholder="Search levels..."
                value={searchTerms.levels}
                onChange={(e) => handleSearchChange("levels", e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />
            </div>
            <div className="max-h-40 overflow-y-auto p-2">
              {filterItems(levels, "levels").map((level) => (
                <label key={level.id} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={formData.levels?.includes(level.id)}
                    onChange={() => handleMultiSelect("levels", level.id)}
                    className="mr-2"
                  />
                  <span className="text-sm text-black">{level.name || level.title}</span>
                </label>
              ))}
              {filterItems(levels, "levels").length === 0 && (
                <p className="text-sm text-gray-500 p-1">No levels found</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Items:</h3>
        <div className="flex flex-wrap gap-2">
          {formData.universities?.map((id) => {
            const university = universities.find((u) => u.id === id)
            return university ? (
              <span key={id} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {university.name || university.title}
              </span>
            ) : null
          })}
          {formData.schools?.map((id) => {
            const school = schools.find((s) => s.id === id)
            return school ? (
              <span key={id} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                {school.name || school.title}
              </span>
            ) : null
          })}
          {formData.courses?.map((id) => {
            const course = courses.find((c) => c.id === id)
            return course ? (
              <span key={id} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                {course.name || course.title}
              </span>
            ) : null
          })}
          {formData.levels?.map((id) => {
            const level = levels.find((l) => l.id === id)
            return level ? (
              <span key={id} className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                {level.name || level.title}
              </span>
            ) : null
          })}
          {!formData.universities?.length &&
            !formData.schools?.length &&
            !formData.courses?.length &&
            !formData.levels?.length && <span className="text-sm text-gray-500">No items selected</span>}
        </div>
      </div>
    </div>
  )
}
