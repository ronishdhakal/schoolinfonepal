"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchTypesDropdown } from "@/utils/api";

const SchoolHeader = ({ formData, setFormData }) => {
  const [types, setTypes] = useState([]);

  useEffect(() => {
    fetchTypesDropdown().then(setTypes);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "file") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Auto-generate slug
    if (name === "name") {
      const slug = value.toLowerCase().replace(/\s+/g, "-");
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div>
        <label className="block font-medium">School Name *</label>
        <input
          type="text"
          name="name"
          value={formData.name || ""}
          onChange={handleChange}
          className="input"
        />
      </div>

      <div>
        <label className="block font-medium">Slug</label>
        <input
          type="text"
          name="slug"
          value={formData.slug || ""}
          readOnly
          className="input bg-gray-100 cursor-not-allowed"
        />
      </div>

      <div>
        <label className="block font-medium">Logo</label>
        <input
          type="file"
          name="logo"
          accept="image/*"
          onChange={handleChange}
        />
        {formData.logo && typeof formData.logo === "string" && (
          <Image
            src={formData.logo}
            alt="logo"
            width={100}
            height={100}
            className="mt-2"
          />
        )}
      </div>

      <div>
        <label className="block font-medium">Cover Photo</label>
        <input
          type="file"
          name="cover_photo"
          accept="image/*"
          onChange={handleChange}
        />
        {formData.cover_photo && typeof formData.cover_photo === "string" && (
          <Image
            src={formData.cover_photo}
            alt="cover"
            width={150}
            height={80}
            className="mt-2"
          />
        )}
      </div>

      <div>
        <label className="block font-medium">Established Date</label>
        <input
          type="date"
          name="established_date"
          value={formData.established_date || ""}
          onChange={handleChange}
          className="input"
        />
      </div>

      <div>
        <label className="block font-medium">Type</label>
        <select
          name="type"
          value={formData.type || ""}
          onChange={handleChange}
          className="input"
        >
          <option value="">-- Select Type --</option>
          {types.map((type) => (
            <option key={type.id} value={type.id}>
              {type.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-medium">Website</label>
        <input
          type="url"
          name="website"
          value={formData.website || ""}
          onChange={handleChange}
          className="input"
        />
      </div>

      <div>
        <label className="block font-medium">Priority</label>
        <input
          type="number"
          name="priority"
          value={formData.priority || ""}
          onChange={handleChange}
          className="input"
        />
      </div>

      <div className="flex items-center space-x-4">
        <label className="font-medium">Verified</label>
        <input
          type="checkbox"
          name="verification"
          checked={formData.verification || false}
          onChange={handleChange}
        />
      </div>

      <div className="flex items-center space-x-4">
        <label className="font-medium">Featured</label>
        <input
          type="checkbox"
          name="featured"
          checked={formData.featured || false}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default SchoolHeader;
