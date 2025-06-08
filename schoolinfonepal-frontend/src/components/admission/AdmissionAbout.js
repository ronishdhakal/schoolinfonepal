"use client";
export default function AdmissionAbout({ admission }) {
  if (!admission?.description) return null;

  return (
    <section className="bg-white rounded-2xl shadow mb-8 px-6 py-7">
      <h2 className="text-xl font-bold mb-4 text-gray-900">About this Admission</h2>
      <div
        className="prose prose-blue max-w-none text-gray-800"
        // If your description contains HTML (from CKEditor), use dangerouslySetInnerHTML:
        dangerouslySetInnerHTML={{ __html: admission.description }}
      />
    </section>
  );
}
