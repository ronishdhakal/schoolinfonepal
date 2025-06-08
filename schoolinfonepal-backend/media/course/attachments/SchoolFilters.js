"use client";
import { useEffect, useState } from "react";
import {
  fetchLevels,
  fetchDistricts,
  fetchUniversities,
  fetchTypes,
  fetchCoursesDropdown,
} from "@/utils/api";

export default function SchoolFilters({ filters, onChange }) {
  const [levels, setLevels] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [types, setTypes] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchLevels().then(setLevels);
    fetchDistricts().then(setDistricts);
    fetchUniversities().then(setUniversities);
    fetchTypes().then(setTypes);
    fetchCoursesDropdown().then(setCourses);
  }, []);

  const handleChange = (key, value) => {
    onChange({ ...filters, [key]: value });
  };

  const handleClearFilters = () => {
    onChange({
      level: "",
      district: "",
      university: "",
      type: "",
      course: "",
    });
  };

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      {/* Level */}
      <select
        value={filters.level || ""}
        onChange={(e) => handleChange("level", e.target.value)}
        className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-full md:w-auto"
      >
        <option value="">All Levels</option>
        {levels.map((level) => (
          <option key={level.id} value={level.slug}>{level.title}</option>
        ))}
      </select>
      {/* District */}
      <select
        value={filters.district || ""}
        onChange={(e) => handleChange("district", e.target.value)}
        className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-full md:w-auto"
      >
        <option value="">All Districts</option>
        {districts.map((d) => (
          <option key={d.id} value={d.slug}>{d.name}</option>
        ))}
      </select>
      {/* University */}
      <select
        value={filters.university || ""}
        onChange={(e) => handleChange("university", e.target.value)}
        className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-full md:w-auto"
      >
        <option value="">All Universities</option>
        {universities.map((u) => (
          <option key={u.id} value={u.slug}>{u.name}</option>
        ))}
      </select>
      {/* Type */}
      <select
        value={filters.type || ""}
        onChange={(e) => handleChange("type", e.target.value)}
        className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-full md:w-auto"
      >
        <option value="">All Types</option>
        {types.map((t) => (
          <option key={t.id} value={t.slug}>{t.title}</option>
        ))}
      </select>
      {/* Course */}
      <select
        value={filters.course || ""}
        onChange={(e) => handleChange("course", e.target.value)}
        className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-full md:w-auto"
      >
        <option value="">All Courses</option>
        {(Array.isArray(courses) ? courses : []).map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
      {/* Clear Filters Button */}
      <button
        onClick={handleClearFilters}
        className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg px-4 py-2 text-sm w-full md:w-auto transition-colors"
      >
        Clear Filters
      </button>
    </div>
  );
}
