"use client";
import Link from "next/link";

// Optionally format duration, level, etc. based on your Course model fields
const UniversityCourses = ({ university }) => {
  // If university.courses is an array, use it; else, show fallback.
  const courses = Array.isArray(university?.courses) ? university.courses : [];

  if (!courses.length) {
    return (
      <section className="bg-white rounded-2xl shadow p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Courses Offered</h2>
        <div className="text-gray-400">No courses listed for this university.</div>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-2xl shadow p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Courses Offered</h2>
      <ul className="space-y-3">
        {courses.map((course) => (
          <li key={course.id} className="flex flex-col sm:flex-row sm:items-center gap-1">
            <Link
              href={`/course/${course.slug || course.id}`}
              className="font-medium text-blue-700 hover:underline"
            >
              {course.name}
            </Link>
            {/* Optional: show course duration, level, etc. */}
            {course.duration && (
              <span className="ml-2 text-sm text-gray-500">({course.duration})</span>
            )}
            {course.level_name && (
              <span className="ml-2 text-xs bg-gray-100 rounded px-2 py-0.5 text-gray-600">
                {course.level_name}
              </span>
            )}
            {course.discipline_name && (
              <span className="ml-2 text-xs bg-gray-100 rounded px-2 py-0.5 text-gray-600">
                {course.discipline_name}
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default UniversityCourses;
