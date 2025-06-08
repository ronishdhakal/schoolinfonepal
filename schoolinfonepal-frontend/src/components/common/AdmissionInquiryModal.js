import { useState, useEffect } from "react";
import { createInquiry } from "@/utils/api";

export default function AdmissionInquiryModal({
  open,
  onClose,
  school,
  courses = [],
  onSuccess,
}) {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
    message: "",
    course_id: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Reset form when modal opens/closes or new school/courses passed
    if (!open) return;
    setForm({
      full_name: "",
      email: "",
      phone: "",
      address: "",
      message: "",
      course_id: "",
    });
    setSuccess(false);
    setError("");
    setLoading(false);
  }, [open, school, courses]);

  if (!open) return null;

  function handleClose() {
    setForm({
      full_name: "",
      email: "",
      phone: "",
      address: "",
      message: "",
      course_id: "",
    });
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
        // Only send course_id if selected and available
        course_id: form.course_id ? form.course_id : undefined,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-4 sm:p-6 relative animate-fadeIn overflow-y-auto max-h-[90vh]">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl font-light"
          onClick={handleClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-2">
          Admission Inquiry: {school?.name}
        </h2>
        {success ? (
          <div className="text-green-600 py-6 text-center">
            Thank you! Your inquiry has been submitted.<br />We will contact you soon.
            <button
              className="mt-4 px-5 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition-colors"
              onClick={handleClose}
            >
              Close
            </button>
          </div>
        ) : (
          <form className="space-y-3 sm:space-y-4" onSubmit={handleSubmit}>
            {/* Course dropdown, only if courses exist */}
            {courses.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Select Course (Optional)
                </label>
                <select
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-blue-500"
                  value={form.course_id}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, course_id: e.target.value }))
                  }
                >
                  <option value="">Select a course...</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {/* User details */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Full Name
              </label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-blue-500"
                value={form.full_name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, full_name: e.target.value }))
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-blue-500"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Phone
              </label>
              <input
                type="tel"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-blue-500"
                value={form.phone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, phone: e.target.value }))
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Address
              </label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-blue-500"
                value={form.address}
                onChange={(e) =>
                  setForm((f) => ({ ...f, address: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Message
              </label>
              <textarea
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-blue-500"
                rows={2}
                value={form.message}
                onChange={(e) =>
                  setForm((f) => ({ ...f, message: e.target.value }))
                }
              />
            </div>
            {error && (
              <div className="text-sm text-red-600">{error}</div>
            )}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 font-medium transition-colors disabled:opacity-60 focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Inquiry"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
