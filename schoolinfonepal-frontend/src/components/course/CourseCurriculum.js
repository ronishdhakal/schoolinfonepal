export default function CourseCurriculum({ curriculum }) {
  if (!curriculum || curriculum.trim() === "") return null;

  return (
    <section className="my-10">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Course Curriculum</h2>
      <div className="prose prose-blue max-w-none text-gray-700">
        {curriculum.split("\n").map((line, idx) =>
          line.trim() === "" ? <br key={idx} /> : <p key={idx}>{line}</p>
        )}
      </div>
    </section>
  );
}
