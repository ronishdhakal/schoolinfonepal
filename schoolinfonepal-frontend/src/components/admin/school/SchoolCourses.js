"use client"
import { useState, useEffect } from "react"
import { fetchCoursesDropdown } from "@/utils/api"

const SchoolCourses = ({ formData, setFormData }) => {
  const [courses, setCourses] = useState([])

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await fetchCoursesDropdown()
        setCourses(data)
      } catch (err) {
        console.error("Failed to load courses:", err)
      }
    }
    loadCourses()
  }, [])

  const handleCourseChange = (index, field, value) => {
    const schoolCourses = [...(formData.school_courses || [])]
    schoolCourses[index] = { ...schoolCourses[index], [field]: value }
    setFormData((prev) => ({ ...prev, school_courses: schoolCourses }))
  }

  const addCourse = () => {
    setFormData((prev) => ({
      ...prev,
      school_courses: [...(prev.school_courses || []), { course: "", fee: "", status: "Open", admin_open: true }],
    }))
  }

  const removeCourse = (index) => {
    const schoolCourses = (formData.school_courses || []).filter((_, i) => i !== index)
    setFormData((prev) => ({ ...prev, school_courses: schoolCourses }))
  }

  const getCourseName = (courseId) => {
    const course = courses.find((c) => c.id === Number.parseInt(courseId))
    return course ? course.name : ""
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">School Courses</h3>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">Add courses offered by the school with fees and status</p>
          <button
            type="button"
            onClick={addCourse}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            + Add Course
          </button>
        </div>

        {formData.school_courses && formData.school_courses.length > 0 && (
          <div className="space-y-4">
            {formData.school_courses.map((schoolCourse, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
                    <select
                      value={schoolCourse.course || ""}
                      onChange={(e) => handleCourseChange(index, "course", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Select Course</option>
                      {courses.map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fee (Optional)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={schoolCourse.fee || ""}
                      onChange={(e) => handleCourseChange(index, "fee", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={schoolCourse.status || "Open"}
                      onChange={(e) => handleCourseChange(index, "status", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="Open">Open</option>
                      <option value="Closed">Closed</option>
                      <option value="Full">Full</option>
                      <option value="Waitlist">Waitlist</option>
                    </select>
                  </div>

                  <div className="flex items-end space-x-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={schoolCourse.admin_open !== false}
                        onChange={(e) => handleCourseChange(index, "admin_open", e.target.checked)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700">Active</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeCourse(index)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {schoolCourse.course && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">Selected: {getCourseName(schoolCourse.course)}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {(!formData.school_courses || formData.school_courses.length === 0) && (
          <p className="text-gray-500 text-sm text-center py-4">No courses added</p>
        )}
      </div>
    </div>
  )
}

export default SchoolCourses
