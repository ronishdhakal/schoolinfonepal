"use client";
const SchoolSocialMedia = ({ formData, setFormData }) => {
  if (!formData) return null;

  // Defensive: always operate on an array of {platform, url}
  const handlePlatformChange = (index, value) => {
    const updated = [...(formData.social_media || [])];
    updated[index] = { ...updated[index], platform: value };
    setFormData((prev) => ({ ...prev, social_media: updated }));
  };

  const handleUrlChange = (index, value) => {
    const updated = [...(formData.social_media || [])];
    updated[index] = { ...updated[index], url: value };
    setFormData((prev) => ({ ...prev, social_media: updated }));
  };

  const addSocialMedia = () => {
    const updated = [...(formData.social_media || []), { platform: "", url: "" }];
    setFormData((prev) => ({ ...prev, social_media: updated }));
  };

  const removeSocialMedia = (index) => {
    const updated = [...(formData.social_media || [])];
    updated.splice(index, 1);
    setFormData((prev) => ({ ...prev, social_media: updated }));
  };

  return (
    <div className="mb-8">
      <label className="block font-medium mb-2">Social Media Links</label>
      {(formData.social_media || []).map((item, index) => (
        <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            placeholder="Platform (e.g. Facebook)"
            value={item.platform || ""}
            onChange={(e) => handlePlatformChange(index, e.target.value)}
            className="input"
            required
          />
          <input
            type="url"
            placeholder="URL"
            value={item.url || ""}
            onChange={(e) => handleUrlChange(index, e.target.value)}
            className="input"
            required
          />
          <button
            type="button"
            onClick={() => removeSocialMedia(index)}
            className="text-red-500"
          >
            Remove
          </button>
        </div>
      ))}
      <button type="button" onClick={addSocialMedia} className="text-blue-600">
        + Add Social Media
      </button>
    </div>
  );
};

export default SchoolSocialMedia;
