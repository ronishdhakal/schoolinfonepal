"use client";
import Image from "next/image";

const EMPTY_MSG = {
  title: "",
  message: "",
  name: "",
  designation: "",
  image: null,
};

const MAX_MESSAGES = 5; // You can adjust max allowed messages

const SchoolMessage = ({ formData, setFormData }) => {
  // Always use an array, even if empty
  const messages = formData.messages || [];

  // Update a single message by index
  const updateMessageField = (idx, key, value) => {
    const updated = messages.map((msg, i) =>
      i === idx ? { ...msg, [key]: value } : msg
    );
    setFormData((prev) => ({ ...prev, messages: updated }));
  };

  // Add a new message
  const addMessage = () => {
    if (messages.length >= MAX_MESSAGES) return;
    setFormData((prev) => ({
      ...prev,
      messages: [...messages, { ...EMPTY_MSG }],
    }));
  };

  // Remove a message by index
  const removeMessage = (idx) => {
    setFormData((prev) => ({
      ...prev,
      messages: messages.filter((_, i) => i !== idx),
    }));
  };

  // Handle image change for a specific message
  const handleImageChange = (idx, e) => {
    const file = e.target.files[0];
    if (!file) return;
    updateMessageField(idx, "image", file);
  };

  const handleRemoveImage = (idx) => {
    updateMessageField(idx, "image", null);
  };

  return (
    <div className="grid grid-cols-1 gap-8 mb-8">
      <div className="flex items-center justify-between">
        <label className="text-lg font-semibold">
          Messages from Principal/Head
        </label>
        <button
          type="button"
          onClick={addMessage}
          className={`px-4 py-1 rounded text-white bg-blue-500 hover:bg-blue-700 text-sm ${
            messages.length >= MAX_MESSAGES ? "opacity-40 cursor-not-allowed" : ""
          }`}
          disabled={messages.length >= MAX_MESSAGES}
        >
          + Add Message
        </button>
      </div>

      {messages.length === 0 && (
        <div className="text-gray-500 italic">No messages added yet.</div>
      )}

      {messages.map((msg, idx) => (
        <div
          key={idx}
          className="border rounded-xl p-4 relative bg-gray-50 space-y-4 shadow-sm"
        >
          <button
            type="button"
            onClick={() => removeMessage(idx)}
            className="absolute right-3 top-3 text-red-500 hover:underline text-xs"
            title="Remove this message"
          >
            Remove
          </button>
          <div>
            <label className="block font-medium">Title</label>
            <input
              type="text"
              value={msg.title || ""}
              onChange={(e) => updateMessageField(idx, "title", e.target.value)}
              className="input"
              placeholder="Principal's Message, Head Teacher, etc."
            />
          </div>
          <div>
            <label className="block font-medium">Message</label>
            <textarea
              value={msg.message || ""}
              onChange={(e) =>
                updateMessageField(idx, "message", e.target.value)
              }
              className="input"
              rows={4}
              placeholder="Write a welcome, vision, or leadership message here."
            />
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[160px]">
              <label className="block font-medium">Name</label>
              <input
                type="text"
                value={msg.name || ""}
                onChange={(e) =>
                  updateMessageField(idx, "name", e.target.value)
                }
                className="input"
                placeholder="Full Name"
              />
            </div>
            <div className="flex-1 min-w-[160px]">
              <label className="block font-medium">Designation</label>
              <input
                type="text"
                value={msg.designation || ""}
                onChange={(e) =>
                  updateMessageField(idx, "designation", e.target.value)
                }
                className="input"
                placeholder="Principal, Head, Director, etc."
              />
            </div>
          </div>
          <div>
            <label className="block font-medium">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(idx, e)}
            />
            {msg.image && (
              <div className="mt-3 flex items-center gap-4">
                <Image
                  src={
                    typeof msg.image === "string"
                      ? msg.image
                      : URL.createObjectURL(msg.image)
                  }
                  alt="Message Person"
                  width={120}
                  height={120}
                  className="rounded border"
                />
                <button
                  type="button"
                  className="text-red-500 ml-2"
                  onClick={() => handleRemoveImage(idx)}
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SchoolMessage;
