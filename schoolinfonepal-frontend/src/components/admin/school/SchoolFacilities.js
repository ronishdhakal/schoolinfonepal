"use client";
import { useEffect, useState } from "react";
import { fetchFacilitiesDropdown } from "@/utils/api";

const SchoolFacilities = ({ formData, setFormData }) => {
  const [facilityOptions, setFacilityOptions] = useState([]);

  useEffect(() => {
    fetchFacilitiesDropdown().then(setFacilityOptions);
  }, []);

  if (!formData) return null;

  // Defensive: Always convert IDs to string for comparison
  const selectedSet = new Set((formData.facilities || []).map(String));

  const handleToggle = (facilityId) => {
    const idStr = String(facilityId);
    let updated;
    if (selectedSet.has(idStr)) {
      updated = (formData.facilities || []).filter(
        (id) => String(id) !== idStr
      );
    } else {
      updated = [...(formData.facilities || []), facilityId];
    }
    setFormData((prev) => ({
      ...prev,
      facilities: updated,
    }));
  };

  return (
    <div className="mb-8">
      <label className="block font-medium mb-2">Facilities</label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {facilityOptions.map((facility) => (
          <label key={facility.id} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedSet.has(String(facility.id))}
              onChange={() => handleToggle(facility.id)}
            />
            <span>{facility.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default SchoolFacilities;
