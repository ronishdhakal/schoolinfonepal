"use client";
import { useEffect, useState } from "react";
import { fetchLevelsDropdown, fetchUniversitiesDropdown, fetchCoursesDropdown } from "@/utils/api";

export default function AdmissionFilters({ filters, setFilters }) {
  const [levels, setLevels] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchLevelsDropdown().then(setLevels);
    fetchUniversitiesDropdown().then(setUniversities);
    fetchCoursesDropdown().then(setCourses);
  }, []);

  const handleChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
      page: 1, // Reset to page 1 on filter change
    }));
  };

  const handleClear = () => {
    setFilters({ level: "", university: "", course: "", page: 1 });
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow flex flex-wrap gap-4 items-end">
      <div className="flex-1 min-w-[180px]">
        <label className="block text-sm font-medium mb-1">Level</label>
        <select
          name="level"
          value={filters.level || ""}
          onChange={handleChange}
          className="w-full border rounded p-2"
        >
          <option value="">All Levels</option>
          {levels.map((level) => (
            <option value={level.slug} key={level.id}>
              {level.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-1 min-w-[180px]">
        <label className="block text-sm font-medium mb-1">University</label>
        <select
          name="university"
          value={filters.university || ""}
          onChange={handleChange}
          className="w-full border rounded p-2"
        >
          <option value="">All Universities</option>
          {universities.map((uni) => (
            <option value={uni.slug} key={uni.id}>
              {uni.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-1 min-w-[180px]">
        <label className="block text-sm font-medium mb-1">Course</label>
        <select
          name="course"
          value={filters.course || ""}
          onChange={handleChange}
          className="w-full border rounded p-2"
        >
          <option value="">All Courses</option>
          {courses.map((course) => (
            <option value={course.slug} key={course.id}>
              {course.name}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={handleClear}
        className="bg-gray-100 border border-gray-300 px-4 py-2 rounded hover:bg-gray-200"
        type="button"
      >
        Clear Filters
      </button>
    </div>
  );
}
