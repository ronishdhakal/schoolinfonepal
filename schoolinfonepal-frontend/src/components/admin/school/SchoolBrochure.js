"use client";
import { useState } from "react";

const SchoolBrochure = ({ formData, setFormData }) => {
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    const updated = [...(formData.brochures || [])];

    files.forEach((file) => {
      updated.push({ file, description: "" });
    });

    setFormData((prev) => ({ ...prev, brochures: updated }));
  };

  const handleDescriptionChange = (index, value) => {
    const updated = [...formData.brochures];
    updated[index].description = value;
    setFormData((prev) => ({ ...prev, brochures: updated }));
  };

  const removeFile = (index) => {
    const updated = [...formData.brochures];
    updated.splice(index, 1);
    setFormData((prev) => ({ ...prev, brochures: updated }));
  };

  return (
    <div className="mb-8">
      <label className="block font-medium mb-2">Brochures (PDF)</label>
      <input
        type="file"
        accept=".pdf"
        multiple
        onChange={handleFileChange}
        className="mb-4"
      />

      {(formData.brochures || []).map((item, index) => (
        <div
          key={index}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4"
        >
          <div className="flex-1">
            <p className="text-sm font-medium">
              📄{" "}
              {typeof item.file === "string"
                ? item.file.split("/").pop()
                : item.file?.name}
            </p>
            <input
              type="text"
              value={item.description || ""}
              onChange={(e) => handleDescriptionChange(index, e.target.value)}
              placeholder="Optional description"
              className="input mt-2 w-full"
            />
          </div>
          <button
            type="button"
            onClick={() => removeFile(index)}
            className="text-red-500"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
};

export default SchoolBrochure;
