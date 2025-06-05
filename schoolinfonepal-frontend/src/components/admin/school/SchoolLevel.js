"use client";
import { useEffect, useState } from "react";
import { fetchLevelsDropdown } from "@/utils/api";

const SchoolLevel = ({ formData, setFormData }) => {
  const [levels, setLevels] = useState([]);

  useEffect(() => {
    fetchLevelsDropdown().then(setLevels);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div>
        <label className="block font-medium">Level</label>
        <select
          name="level"
          value={formData.level || ""}
          onChange={handleChange}
          className="input"
        >
          <option value="">-- Select Level --</option>
          {levels.map((level) => (
            <option key={level.id} value={level.id}>
              {level.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-medium">Level Text</label>
        <input
          type="text"
          name="level_text"
          value={formData.level_text || ""}
          onChange={handleChange}
          className="input"
          placeholder="e.g. +2, Bachelor, Master"
        />
      </div>
    </div>
  );
};

export default SchoolLevel;
