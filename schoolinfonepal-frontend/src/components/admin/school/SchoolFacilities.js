"use client";
import { useEffect, useState } from "react";
import { fetchFacilitiesDropdown } from "@/utils/api";

const SchoolFacilities = ({ formData, setFormData }) => {
  const [facilityOptions, setFacilityOptions] = useState([]);

  useEffect(() => {
    fetchFacilitiesDropdown().then(setFacilityOptions);
  }, []);

  const handleToggle = (facilityId) => {
    const selected = new Set(formData.facilities || []);
    if (selected.has(facilityId)) {
      selected.delete(facilityId);
    } else {
      selected.add(facilityId);
    }
    setFormData((prev) => ({
      ...prev,
      facilities: Array.from(selected),
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
              checked={(formData.facilities || []).includes(facility.id)}
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
