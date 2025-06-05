"use client";
import { useEffect, useState } from "react";
import { fetchUniversitiesDropdown } from "@/utils/api";

const SchoolUniversity = ({ formData, setFormData }) => {
  const [universities, setUniversities] = useState([]);

  useEffect(() => {
    fetchUniversitiesDropdown().then(setUniversities);
  }, []);

  const handleToggle = (id) => {
    const selected = new Set(formData.universities || []);
    if (selected.has(id)) {
      selected.delete(id);
    } else {
      selected.add(id);
    }
    setFormData((prev) => ({
      ...prev,
      universities: Array.from(selected),
    }));
  };

  return (
    <div className="mb-8">
      <label className="block font-medium mb-2">Affiliated Universities</label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {universities.map((u) => (
          <label key={u.id} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={(formData.universities || []).includes(u.id)}
              onChange={() => handleToggle(u.id)}
            />
            <span>{u.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default SchoolUniversity;
