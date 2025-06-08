"use client";
export default function ScholarshipOther({ scholarship }) {
  if (!scholarship) return null;

  return (
    <div className="bg-white rounded-xl shadow p-6 mb-6">
      <h2 className="text-lg font-semibold mb-3">Other Details</h2>
      <div className="mb-2">
        <span className="font-medium">Courses:</span>{" "}
        {Array.isArray(scholarship.courses) && scholarship.courses.length > 0
          ? scholarship.courses.map((c) => c.name).join(", ")
          : <span className="text-gray-400">Not specified</span>
        }
      </div>
      <div className="mb-2">
        <span className="font-medium">University:</span>{" "}
        {scholarship.university?.name || <span className="text-gray-400">Not specified</span>}
      </div>
      <div>
        <span className="font-medium">Level:</span>{" "}
        {scholarship.level?.title || <span className="text-gray-400">Not specified</span>}
      </div>
    </div>
  );
}
