"use client";
import { useState } from "react";
import Image from "next/image";

const SchoolGallery = ({ formData, setFormData }) => {
  const [newImages, setNewImages] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    const updated = [...(formData.gallery || [])];

    files.forEach((file) => {
      updated.push({ image: file, caption: "" });
    });

    setFormData((prev) => ({ ...prev, gallery: updated }));
    setNewImages([]); // reset file input
  };

  const handleCaptionChange = (index, value) => {
    const updated = [...formData.gallery];
    updated[index].caption = value;
    setFormData((prev) => ({ ...prev, gallery: updated }));
  };

  const removeImage = (index) => {
    const updated = [...formData.gallery];
    updated.splice(index, 1);
    setFormData((prev) => ({ ...prev, gallery: updated }));
  };

  return (
    <div className="mb-8">
      <label className="block font-medium mb-2">Gallery Images</label>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageChange}
        className="mb-4"
      />

      {(formData.gallery || []).map((item, index) => (
        <div key={index} className="flex items-center gap-4 mb-4">
          {item.image && (
            <Image
              src={
                typeof item.image === "string"
                  ? item.image
                  : URL.createObjectURL(item.image)
              }
              alt={`Gallery ${index + 1}`}
              width={120}
              height={80}
              className="rounded border"
            />
          )}
          <input
            type="text"
            value={item.caption || ""}
            placeholder="Caption"
            onChange={(e) => handleCaptionChange(index, e.target.value)}
            className="input flex-1"
          />
          <button
            type="button"
            onClick={() => removeImage(index)}
            className="text-red-500"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
};

export default SchoolGallery;
