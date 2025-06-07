// components/common/PreRegistrationInquiryModal.js
import { useState } from "react";
import { createPreRegistrationInquiry } from "@/utils/api"; // Add this to your api.js

export default function PreRegistrationInquiryModal({ open, onClose, school, course, onSuccess }) {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
    level: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  function handleClose() {
    setForm({ full_name: "", email: "", phone: "", address: "", level: "", message: "" });
    setSuccess(false);
    setError("");
    setLoading(false);
    onClose();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = {
        ...form,
        school_id: school?.id,
        course_id: course?.id,
      };
      await createPreRegistrationInquiry(payload);
      setSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
          onClick={handleClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-1 text-blue-700">
          Pre-Registration: {school?.name}
        </h2>
        {course?.name && (
          <div className="mb-2 text-gray-500 text-sm">Course: {course.name}</div>
        )}
        {success ? (
          <div className="text-green-600 py-8 text-center">
            Thank you! Your pre-registration has been submitted.<br />We will contact you soon.
            <button
              className="mt-4 px-4 py-2 rounded bg-blue-600 text-white"
              onClick={handleClose}
            >
              Close
            </button>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block font-medium mb-1">Full Name*</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={form.full_name}
                onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Email*</label>
              <input
                type="email"
                className="w-full border rounded px-3 py-2"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Phone*</label>
              <input
                type="tel"
                className="w-full border rounded px-3 py-2"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Address</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={form.address}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Level*</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={form.level}
                onChange={(e) => setForm((f) => ({ ...f, level: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Message</label>
              <textarea
                className="w-full border rounded px-3 py-2"
                rows={3}
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded py-2 font-medium disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Pre-Registration"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
