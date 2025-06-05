"use client";
import Image from "next/image";

const SchoolMessage = ({ formData, setFormData }) => {
  const message = formData.messages?.[0] || {
    title: "",
    message: "",
    name: "",
    designation: "",
    image: null,
  };

  const updateMessageField = (key, value) => {
    const updated = [{ ...message, [key]: value }];
    setFormData((prev) => ({ ...prev, messages: updated }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    updateMessageField("image", file);
  };

  return (
    <div className="grid grid-cols-1 gap-6 mb-8">
      <label className="text-lg font-semibold">Message from Principal/Head</label>

      <div>
        <label className="block font-medium">Title</label>
        <input
          type="text"
          value={message.title}
          onChange={(e) => updateMessageField("title", e.target.value)}
          className="input"
        />
      </div>

      <div>
        <label className="block font-medium">Message</label>
        <textarea
          value={message.message}
          onChange={(e) => updateMessageField("message", e.target.value)}
          className="input"
          rows={5}
        />
      </div>

      <div>
        <label className="block font-medium">Name</label>
        <input
          type="text"
          value={message.name}
          onChange={(e) => updateMessageField("name", e.target.value)}
          className="input"
        />
      </div>

      <div>
        <label className="block font-medium">Designation</label>
        <input
          type="text"
          value={message.designation}
          onChange={(e) => updateMessageField("designation", e.target.value)}
          className="input"
        />
      </div>

      <div>
        <label className="block font-medium">Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        {message.image && typeof message.image === "string" && (
          <Image
            src={message.image}
            alt="Message Person"
            width={120}
            height={120}
            className="mt-3 rounded border"
          />
        )}
      </div>
    </div>
  );
};

export default SchoolMessage;
