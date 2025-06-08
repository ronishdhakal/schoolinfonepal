"use client";
import React from "react";

const UniversityFilter = ({ filters, setFilters }) => {
  // Ensure value is always "", "true", or "false"
  const handleChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      foreign_affiliation: e.target.value,
    }));
  };

  return (
    <div className="flex items-center gap-4 mb-6">
      <label htmlFor="foreignAffiliation" className="font-semibold text-gray-700">
        Foreign Affiliated:
      </label>
      <select
        id="foreignAffiliation"
        className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={filters.foreign_affiliation ?? ""}
        onChange={handleChange}
      >
        <option value="">All</option>
        <option value="true">Yes</option>
        <option value="false">No</option>
      </select>
      <button
        type="button"
        className="ml-4 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 border"
        onClick={() =>
          setFilters((prev) => ({
            ...prev,
            foreign_affiliation: "",
          }))
        }
      >
        Clear Filter
      </button>
    </div>
  );
};

export default UniversityFilter;
