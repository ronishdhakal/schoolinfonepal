"use client";
const SchoolAbout = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="grid grid-cols-1 gap-6 mb-8">
      <div>
        <label className="block font-medium">Salient Features</label>
        <textarea
          name="salient_feature"
          value={formData.salient_feature || ""}
          onChange={handleChange}
          rows={4}
          className="input"
        />
      </div>

      <div>
        <label className="block font-medium">Scholarship Info</label>
        <textarea
          name="scholarship"
          value={formData.scholarship || ""}
          onChange={handleChange}
          rows={4}
          className="input"
        />
      </div>

      <div>
        <label className="block font-medium">About College</label>
        <textarea
          name="about_college"
          value={formData.about_college || ""}
          onChange={handleChange}
          rows={6}
          className="input"
        />
      </div>
    </div>
  );
};

export default SchoolAbout;
