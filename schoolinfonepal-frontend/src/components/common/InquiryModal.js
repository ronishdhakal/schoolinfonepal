// components/inquiry/InquiryModal.js
import { useState, useEffect, useRef } from "react";
import { createInquiry } from "@/utils/api";
import { Mail, XCircle } from "lucide-react";

export default function InquiryModal({ open, onClose, school, course, onSuccess }) {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const modalRef = useRef();

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      modalRef.current?.focus();
    } else {
      document.body.style.overflow = "";
    }
    return () => (document.body.style.overflow = "");
  }, [open]);

  if (!open) return null;

  function handleClose() {
    setForm({ full_name: "", email: "", phone: "", address: "", message: "" });
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
        school_id: school?.id || null,
        course_id: course?.id || null,
      };
      await createInquiry(payload);
      setSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-sm px-2">
      <div
        ref={modalRef}
        tabIndex={-1}
        className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-auto outline-none overflow-y-auto max-h-[98vh] flex flex-col"
        style={{ scrollbarWidth: "thin" }}
      >
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl focus:outline-none"
          onClick={handleClose}
          aria-label="Close"
        >
          <XCircle className="w-7 h-7" />
        </button>

        <div className="p-7 flex flex-col gap-2">
          <div className="flex items-center gap-3 mb-2">
            <Mail className="w-8 h-8 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Inquiry Message</h2>
          </div>
          {(school?.name || course?.name) && (
            <div className="mb-3">
              <div className="text-gray-600 text-sm mb-1">Hello</div>
              <div className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold text-base">
                {course?.name ? `${course.name} at ${school?.name || ""}` : school?.name}
              </div>
            </div>
          )}
          {success ? (
            <div className="flex flex-col items-center text-center py-10">
              <div className="text-green-600 text-lg font-semibold mb-3">
                Thank you! Your inquiry has been submitted.
              </div>
              <div className="text-gray-500 mb-4">We will contact you soon.</div>
              <button
                className="px-5 py-2 rounded bg-blue-600 text-white font-semibold mt-3"
                onClick={handleClose}
              >
                Close
              </button>
            </div>
          ) : (
            <form className="space-y-4 pt-2" onSubmit={handleSubmit} autoComplete="off">
              <div>
                <label className="block text-gray-700 font-medium mb-1">My Name is</label>
                <input
                  type="text"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-200 outline-none"
                  value={form.full_name}
                  onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
                  required
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">I will reply to</label>
                <input
                  type="email"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-200 outline-none"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  required
                  placeholder="you@email.com"
                /> 
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Or Call me on</label>
                <input
                  type="tel"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-200 outline-none"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  required
                  placeholder="98XXXXXXXX"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">I live in</label>
                <input
                  type="text"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-200 outline-none"
                  value={form.address}
                  onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                  placeholder="Your address"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">I want to inquire about</label>
                <textarea
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-200 outline-none resize-none"
                  rows={3}
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  placeholder="I want to inquire about"
                />
              </div>
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 font-semibold disabled:opacity-60"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Inquiry"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
