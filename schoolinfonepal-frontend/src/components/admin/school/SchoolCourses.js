"use client";
import { useEffect, useState } from "react";
import { fetchCoursesDropdown } from "@/utils/api";

const SchoolCourses = ({ formData, setFormData }) => {
  const [coursesList, setCoursesList] = useState([]);

  useEffect(() => {
    fetchCoursesDropdown().then(setCoursesList);
  }, []);

  const handleCourseChange = (index, field, value) => {
    const updated = [...(formData.courses || [])];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, courses: updated }));
  };

  const addCourse = () => {
    const updated = [...(formData.courses || []), { course: "", fee: "", status: "Open" }];
    setFormData((prev) => ({ ...prev, courses: updated }));
  };

  const removeCourse = (index) => {
    const updated = [...formData.courses];
    updated.splice(index, 1);
    setFormData((prev) => ({ ...prev, courses: updated }));
  };

  return (
    <div className="mb-8">
      <label className="block font-medium mb-2">Courses Offered</label>

      {(formData.courses || []).map((item, index) => (
        <div
          key={index}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center mb-4"
        >
          <select
            value={item.course}
            onChange={(e) => handleCourseChange(index, "course", e.target.value)}
            className="input"
          >
            <option value="">-- Select Course --</option>
            {coursesList.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Fee (optional)"
            value={item.fee}
            onChange={(e) => handleCourseChange(index, "fee", e.target.value)}
            className="input"
          />

          <select
            value={item.status}
            onChange={(e) => handleCourseChange(index, "status", e.target.value)}
            className="input"
          >
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
          </select>

          <button
            type="button"
            onClick={() => removeCourse(index)}
            className="text-red-500"
          >
            Remove
          </button>
        </div>
      ))}

      <button type="button" onClick={addCourse} className="text-blue-600">
        + Add Course
      </button>
    </div>
  );
};

export default SchoolCourses;
