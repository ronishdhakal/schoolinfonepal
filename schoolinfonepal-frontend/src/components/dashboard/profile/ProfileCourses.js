"use client"

import { useState, useEffect } from "react"
import { fetchSchoolOwnProfile, updateSchoolOwnProfile, fetchCoursesDropdown } from "../../../utils/api"

export default function ProfileCourses() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [courses, setCourses] = useState([])
  const [schoolCourses, setSchoolCourses] = useState([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [schoolData, coursesData] = await Promise.all([fetchSchoolOwnProfile(), fetchCoursesDropdown()])

      setCourses(coursesData)

      // ✅ FIXED: Process school_courses from school_courses_display field
      console.log("School data received:", schoolData)
      console.log("School courses display:", schoolData.school_courses_display)

      const processedSchoolCourses = (schoolData.school_courses_display || []).map((sc) => ({
        course_id: sc.course?.id || sc.course_id,
        fee: sc.fee || "",
        status: sc.status || "Open",
        admin_open: sc.admin_open !== false,
      }))

      console.log("Processed school courses:", processedSchoolCourses)
      setSchoolCourses(processedSchoolCourses)
    } catch (error) {
      console.error("Error loading courses:", error)
    } finally {
      setLoading(false)
    }
  }

  const addCourse = () => {
    setSchoolCourses([...schoolCourses, { course_id: "", fee: "", status: "Open", admin_open: true }])
  }

  const removeCourse = (index) => {
    setSchoolCourses(schoolCourses.filter((_, i) => i !== index))
  }

  const updateCourse = (index, field, value) => {
    const updated = schoolCourses.map((course, i) => (i === index ? { ...course, [field]: value } : course))
    setSchoolCourses(updated)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const formData = new FormData()

      // ✅ FIXED: Filter out courses without course_id selection and ensure proper format
      const validCourses = schoolCourses
        .filter((sc) => sc.course_id)
        .map((sc) => ({
          course_id: Number.parseInt(sc.course_id),
          fee: sc.fee || "", // ✅ Allow empty fees
          status: sc.status || "Open",
          admin_open: sc.admin_open !== false,
        }))

      console.log("Submitting school courses:", validCourses)
      formData.append("school_courses", JSON.stringify(validCourses))

      await updateSchoolOwnProfile(formData)
      alert("Courses updated successfully!")

      // ✅ FIXED: Reload data to show updated courses
      await loadData()
    } catch (error) {
      console.error("Error updating courses:", error)
      alert("Error updating courses: " + error.message)
    } finally {
      setSaving(false)
    }
  }

  const getCourseName = (courseId) => {
    const course = courses.find((c) => c.id === Number.parseInt(courseId))
    return course ? course.name : ""
  }

  if (loading) {
    return <div className="animate-pulse">Loading courses...</div>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">School Courses</h3>
        <button
          type="button"
          onClick={addCourse}
          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
        >
          Add Course
        </button>
      </div>

      <div className="space-y-4">
        {schoolCourses.map((schoolCourse, index) => (
          <div key={index} className="border rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                <select
                  value={schoolCourse.course_id || ""}
                  onChange={(e) => updateCourse(index, "course_id", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name}
                    </option>
                  ))}
                </select>
                {schoolCourse.course_id && (
                  <p className="text-xs text-gray-500 mt-1">Selected: {getCourseName(schoolCourse.course_id)}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fee (Optional)</label>
                <input
                  type="number"
                  step="0.01"
                  value={schoolCourse.fee || ""}
                  onChange={(e) => updateCourse(index, "fee", e.target.value)}
                  placeholder="Course fee (optional)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={schoolCourse.status || "Open"}
                  onChange={(e) => updateCourse(index, "status", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Open">Open</option>
                  <option value="Closed">Closed</option>
                  <option value="Coming Soon">Coming Soon</option>
                  <option value="Full">Full</option>
                  <option value="Waitlist">Waitlist</option>
                </select>
              </div>

              <div className="flex items-end justify-between">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={schoolCourse.admin_open !== false}
                    onChange={(e) => updateCourse(index, "admin_open", e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Active</span>
                </label>

                {schoolCourses.length > 0 && (
                  <button
                    type="button"
                    onClick={() => removeCourse(index)}
                    className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {schoolCourses.length === 0 && (
        <div className="text-center py-8 text-gray-500">No courses added yet. Click "Add Course" to get started.</div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Courses"}
        </button>
      </div>
    </form>
  )
}
