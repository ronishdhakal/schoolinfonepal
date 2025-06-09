"use client"

export default function UniversitySalientFeatures({ university }) {
  if (!university || !university.salient_features) return null

  const features = university.salient_features
    .split(/\r?\n|•/g)
    .map((f) => f.trim())
    .filter((f) => f.length > 0)

  return (
    <section className="mb-8 bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-3">Salient Features</h2>
      <div className="space-y-2">
        {features.length > 0 ? (
          features.map((feature, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="w-2 h-2 bg-[#1ca3fd] rounded-full mt-2 flex-shrink-0"></div>
              <div className="text-gray-700">{feature}</div>
            </div>
          ))
        ) : (
          <div className="text-gray-400">No features listed.</div>
        )}
      </div>
    </section>
  )
}
