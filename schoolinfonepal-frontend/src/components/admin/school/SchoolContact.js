"use client";
import { useEffect, useState } from "react";
import { fetchDistrictsDropdown } from "@/utils/api";

const SchoolContact = ({ formData, setFormData }) => {
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    fetchDistrictsDropdown().then(setDistricts);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (index, value) => {
    const updated = [...(formData.phones || [])];
    updated[index].phone = value;
    setFormData((prev) => ({ ...prev, phones: updated }));
  };

  const addPhone = () => {
    const updated = [...(formData.phones || []), { phone: "" }];
    setFormData((prev) => ({ ...prev, phones: updated }));
  };

  const removePhone = (index) => {
    const updated = [...formData.phones];
    updated.splice(index, 1);
    setFormData((prev) => ({ ...prev, phones: updated }));
  };

  const handleEmailChange = (index, value) => {
    const updated = [...(formData.emails || [])];
    updated[index].email = value;
    setFormData((prev) => ({ ...prev, emails: updated }));
  };

  const addEmail = () => {
    const updated = [...(formData.emails || []), { email: "" }];
    setFormData((prev) => ({ ...prev, emails: updated }));
  };

  const removeEmail = (index) => {
    const updated = [...formData.emails];
    updated.splice(index, 1);
    setFormData((prev) => ({ ...prev, emails: updated }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div>
        <label className="block font-medium">Address</label>
        <input
          type="text"
          name="address"
          value={formData.address || ""}
          onChange={handleChange}
          className="input"
        />
      </div>

      <div>
        <label className="block font-medium">District</label>
        <select
          name="district"
          value={formData.district || ""}
          onChange={handleChange}
          className="input"
        >
          <option value="">-- Select District --</option>
          {districts.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      <div className="md:col-span-2">
        <label className="block font-medium">Google Map Link</label>
        <input
          type="url"
          name="map_link"
          value={formData.map_link || ""}
          onChange={handleChange}
          className="input"
        />
      </div>

      {/* Phone Numbers */}
      <div className="md:col-span-2">
        <label className="block font-medium mb-2">Phone Numbers</label>
        {(formData.phones || []).map((item, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={item.phone}
              onChange={(e) => handlePhoneChange(index, e.target.value)}
              className="input flex-1"
              placeholder="Enter phone"
            />
            <button
              type="button"
              onClick={() => removePhone(index)}
              className="text-red-500"
            >
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={addPhone} className="text-blue-600">
          + Add Phone
        </button>
      </div>

      {/* Emails */}
      <div className="md:col-span-2">
        <label className="block font-medium mb-2">Emails</label>
        {(formData.emails || []).map((item, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="email"
              value={item.email}
              onChange={(e) => handleEmailChange(index, e.target.value)}
              className="input flex-1"
              placeholder="Enter email"
            />
            <button
              type="button"
              onClick={() => removeEmail(index)}
              className="text-red-500"
            >
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={addEmail} className="text-blue-600">
          + Add Email
        </button>
      </div>
    </div>
  );
};

export default SchoolContact;
