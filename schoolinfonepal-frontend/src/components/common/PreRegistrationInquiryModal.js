"use client";
import { useState } from "react";
import { createPreRegistrationInquiry } from "@/utils/api";

export default function PreRegistrationInquiryForm({ school, course, onSuccess }) {
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

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!school?.id) {
      setError("School information is missing. Please refresh the page.");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...form,
        school_id: school.id, // always required and never undefined/null!
        course_id: course?.id || null,
      };
      await createPreRegistrationInquiry(payload);
      setSuccess(true);
      if (onSuccess) onSuccess();
      // Optionally clear form after submit:
      setForm({
        full_name: "",
        email: "",
        phone: "",
        address: "",
        level: "",
        message: "",
      });
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  // Reset form after successful submission (for repeat entry)
  function handleCloseSuccess() {
    setSuccess(false);
    setForm({
      full_name: "",
      email: "",
      phone: "",
      address: "",
      level: "",
      message: "",
    });
  }

  return (
    <div className="w-full">
      {success ? (
        <div className="text-green-700 text-center py-8">
          Thank you! Your pre-registration has been submitted.<br />
          We will contact you soon.
          <button
            className="block mx-auto mt-4 px-4 py-2 bg-blue-600 text-white rounded"
            onClick={handleCloseSuccess}
          >
            Submit another
          </button>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit} autoComplete="off">
          <div>
            <label className="block font-medium mb-1">Full Name</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={form.full_name}
              onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
              required
              placeholder="Your Full Name"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Email Address</label>
            <input
              type="email"
              className="w-full border rounded px-3 py-2"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              required
              placeholder="Your Email Address"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Contact Number</label>
            <input
              type="tel"
              className="w-full border rounded px-3 py-2"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              required
              placeholder="Your Mobile Number"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Address</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              placeholder="Your Address"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Level</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={form.level}
              onChange={(e) => setForm((f) => ({ ...f, level: e.target.value }))}
              required
              placeholder="Level or Class"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Message/Notes (optional)</label>
            <textarea
              className="w-full border rounded px-3 py-2"
              rows={3}
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              placeholder="Message or notes (optional)"
            />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded py-2 font-medium disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      )}
    </div>
  );
}
