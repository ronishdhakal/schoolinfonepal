import React, { useEffect, useState } from "react";
import {
  fetchUniversitiesDropdown,
  fetchLevelsDropdown,
  fetchDisciplinesDropdown,
} from "@/utils/api";

const FilterSelect = ({ label, value, onChange, children }) => (
  <div className="flex flex-col min-w-[160px] flex-1">
    <label className="mb-1 text-xs font-medium text-gray-600">{label}</label>
    <select
      value={value}
      onChange={onChange}
      className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-300 bg-white transition-colors duration-150 text-black"
      style={{ color: "#111" }}
    >
      {children}
    </select>
  </div>
);

const defaultFilters = {
  university: "",
  level: "",
  discipline: "",
};

const CourseFilters = ({ filters, setFilters }) => {
  const [universities, setUniversities] = useState([]);
  const [levels, setLevels] = useState([]);
  const [disciplines, setDisciplines] = useState([]);

  useEffect(() => {
    fetchUniversitiesDropdown().then(setUniversities);
    fetchLevelsDropdown().then(setLevels);
    fetchDisciplinesDropdown().then(setDisciplines);
  }, []);

  const handleClearFilters = () => setFilters(defaultFilters);

  return (
    <div className="flex flex-wrap gap-4 mb-8 items-end w-full">
      <FilterSelect
        label="University"
        value={filters.university || ""}
        onChange={e =>
          setFilters(prev => ({ ...prev, university: e.target.value }))
        }
      >
        <option value="">All Universities</option>
        {universities.map(u => (
          <option value={u.slug} key={u.id}>{u.name}</option>
        ))}
      </FilterSelect>

      <FilterSelect
        label="Level"
        value={filters.level || ""}
        onChange={e =>
          setFilters(prev => ({ ...prev, level: e.target.value }))
        }
      >
        <option value="">All Levels</option>
        {levels.map(l => (
          <option value={l.slug} key={l.id}>{l.title}</option>
        ))}
      </FilterSelect>

      <FilterSelect
        label="Discipline"
        value={filters.discipline || ""}
        onChange={e =>
          setFilters(prev => ({ ...prev, discipline: e.target.value }))
        }
      >
        <option value="">All Disciplines</option>
        {disciplines.map(d => (
          <option value={d.slug} key={d.id}>{d.title}</option>
        ))}
      </FilterSelect>

      <button
        onClick={handleClearFilters}
        className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg px-4 py-2 text-sm transition-colors duration-150 border border-gray-200 shadow-sm mt-6 md:mt-0"
        type="button"
      >
        Clear Filters
      </button>
    </div>
  );
};

export default CourseFilters;
