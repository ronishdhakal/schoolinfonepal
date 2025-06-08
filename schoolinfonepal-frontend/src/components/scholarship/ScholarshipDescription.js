// components/scholarship/ScholarshipDescription.js
"use client";
export default function ScholarshipDescription({ scholarship }) {
  if (!scholarship) return null;

  return (
    <div className="bg-white rounded-xl shadow p-6 mb-6">
      <h2 className="text-lg font-semibold mb-3">Description</h2>
      <div className="mb-4 text-gray-800">
        {scholarship.description ? (
          <div
            dangerouslySetInnerHTML={{ __html: scholarship.description.replace(/\n/g, "<br />") }}
          />
        ) : (
          <span className="text-gray-400">No description provided.</span>
        )}
      </div>
      {scholarship.attachment && (
        <a
          href={scholarship.attachment}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-blue-100 text-blue-700 rounded px-3 py-1 hover:bg-blue-200"
          download
        >
          📎 Download Attachment
        </a>
      )}
    </div>
  );
}
