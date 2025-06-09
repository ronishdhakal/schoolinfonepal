"use client"

export default function SchoolAbout({ school }) {
  const about = school?.about_college?.trim();
  const schoolName = school?.name || "";

  if (!about) return null;

  return (
    <section className="mb-8 bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl md:text-3xl font-bold text-[#1868ae] mb-4 font-sans tracking-tight">
        About {schoolName}
      </h2>
      <div className="text-gray-700 leading-relaxed whitespace-pre-line">{about}</div>
    </section>
  );
}
