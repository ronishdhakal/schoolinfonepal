export default function CourseOutcomes({ outcome }) {
  if (!outcome || outcome.trim() === "") return null;

  return (
    <section className="my-10">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Course Outcomes</h2>
      <div className="prose prose-blue max-w-none text-gray-700">
        {/* Supports rich text or line breaks */}
        {outcome.split("\n").map((line, idx) =>
          line.trim() === "" ? <br key={idx} /> : <p key={idx}>{line}</p>
        )}
      </div>
    </section>
  );
}
