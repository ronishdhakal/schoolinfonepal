"use client";
import { useEffect, useState } from "react";
import {
  fetchInformationCategories,
  fetchUniversitiesDropdown,
  fetchLevelsDropdown,
  fetchCoursesDropdown,
  fetchSchoolsDropdown,
} from "@/utils/api";

const InformationFilter = ({ filters, setFilters }) => {
  const [categories, setCategories] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [levels, setLevels] = useState([]);
  const [courses, setCourses] = useState([]);
  const [schools, setSchools] = useState([]);

  useEffect(() => {
    fetchInformationCategories().then(setCategories);
    fetchUniversitiesDropdown().then(setUniversities);
    fetchLevelsDropdown().then(setLevels);
    fetchCoursesDropdown().then(setCourses);
    fetchSchoolsDropdown().then(setSchools);
  }, []);

  const handleChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleClear = () => {
    setFilters({
      category: "",
      university: "",
      level: "",
      course: "",
      school: "",
    });
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow flex flex-wrap gap-4 mb-6 items-end">
      {/* Category */}
      <div>
        <label className="block text-sm font-medium mb-1">Category</label>
        <select
          name="category"
          className="form-select"
          value={filters.category}
          onChange={handleChange}
        >
          <option value="">All</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      {/* University */}
      <div>
        <label className="block text-sm font-medium mb-1">University</label>
        <select
          name="university"
          className="form-select"
          value={filters.university}
          onChange={handleChange}
        >
          <option value="">All</option>
          {universities.map((u) => (
            <option key={u.id} value={u.slug}>
              {u.name}
            </option>
          ))}
        </select>
      </div>
      {/* Level */}
      <div>
        <label className="block text-sm font-medium mb-1">Level</label>
        <select
          name="level"
          className="form-select"
          value={filters.level}
          onChange={handleChange}
        >
          <option value="">All</option>
          {levels.map((l) => (
            <option key={l.id} value={l.slug}>
              {l.name}
            </option>
          ))}
        </select>
      </div>
      {/* Course */}
      <div>
        <label className="block text-sm font-medium mb-1">Course</label>
        <select
          name="course"
          className="form-select"
          value={filters.course}
          onChange={handleChange}
        >
          <option value="">All</option>
          {courses.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      
      {/* Clear Button */}
      <button
        onClick={handleClear}
        className="bg-gray-100 px-3 py-2 rounded-lg border ml-2 hover:bg-gray-200"
        type="button"
      >
        Clear Filters
      </button>
    </div>
  );
};

export default InformationFilter;
