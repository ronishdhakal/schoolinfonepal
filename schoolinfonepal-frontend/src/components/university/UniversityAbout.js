"use client"

export default function UniversityAbout({ university }) {
  if (!university || !university.about) return null

  return (
    <section className="mb-8 bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-3">About {university.name}</h2>
      <div className="text-gray-700 leading-relaxed">
        {/<[a-z][\s\S]*>/i.test(university.about) ? (
          <div dangerouslySetInnerHTML={{ __html: university.about }} />
        ) : (
          <div className="whitespace-pre-line">{university.about}</div>
        )}
      </div>
    </section>
  )
}
