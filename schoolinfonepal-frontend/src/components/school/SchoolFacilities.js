"use client"

export default function SchoolFacilities({ school }) {
  const facilities = school?.facilities || []

  if (!facilities.length) return null

  return (
    <section className="mb-8 bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl md:text-3xl font-bold text-[#1868ae] mb-4 font-sans tracking-tight">
        Facilities
      </h2>
      <div className="flex flex-wrap gap-2">
        {facilities.map((f) => (
          <span
            key={f.id}
            className="inline-block bg-blue-50 text-gray-800 px-3 py-1 rounded-full text-sm border border-blue-100"
          >
            {f.name}
          </span>
        ))}
      </div>
    </section>
  )
}
