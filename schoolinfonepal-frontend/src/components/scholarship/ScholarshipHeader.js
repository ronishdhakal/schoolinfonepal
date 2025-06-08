// components/scholarship/ScholarshipHeader.js
"use client";
export default function ScholarshipHeader({ scholarship }) {
  if (!scholarship) return null;

  // Determine organizer display
  let organizer = "";
  if (scholarship.organizer_custom) {
    organizer = scholarship.organizer_custom;
  } else if (scholarship.organizer_school?.name) {
    organizer = scholarship.organizer_school.name;
  } else if (scholarship.organizer_university?.name) {
    organizer = scholarship.organizer_university.name;
  } else {
    organizer = "-";
  }

  return (
    <div className="bg-white rounded-xl shadow p-6 mb-6">
      <h1 className="text-2xl font-bold text-blue-700 mb-2">{scholarship.title}</h1>
      <div className="text-gray-600 mb-1">
        <span className="font-medium">Published:</span>{" "}
        {scholarship.published_date}
      </div>
      <div className="text-gray-600 mb-1">
        <span className="font-medium">Deadline:</span>{" "}
        {scholarship.active_from} &mdash; {scholarship.active_until}
      </div>
      <div className="text-gray-600">
        <span className="font-medium">Scholarship by:</span> {organizer}
      </div>
    </div>
  );
}
