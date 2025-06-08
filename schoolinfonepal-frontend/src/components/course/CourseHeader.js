import Image from "next/image";

export default function CourseHeader({ course, onInquire }) {
  // Fallback icon: /assets/course-icon.png
  const iconSrc = "/assets/course-icon.png";

  return (
    <section className="bg-white rounded-xl shadow p-6 flex flex-col sm:flex-row gap-6 items-center mb-8">
      {/* Icon */}
      <div className="flex-shrink-0">
        <Image
          src={iconSrc}
          alt="Course icon"
          width={72}
          height={72}
          className="rounded-lg border bg-gray-50"
        />
      </div>

      {/* Course Main Info */}
      <div className="flex-1 w-full">
        <h1 className="text-2xl font-bold text-gray-800">{course.name}</h1>
        {course.abbreviation && (
          <div className="text-md text-blue-600 font-semibold mt-1">
            {course.abbreviation}
          </div>
        )}
        <div className="flex flex-wrap gap-4 items-center mt-2 text-gray-600">
          <span>
            <b>University:</b>{" "}
            {course.university?.name || <span className="italic text-gray-400">N/A</span>}
          </span>
          {course.duration && (
            <span>
              <b>Duration:</b> {course.duration}
            </span>
          )}
        </div>
        {course.short_description && (
          <div className="mt-2 text-gray-700">{course.short_description}</div>
        )}
      </div>

      {/* Inquire Button */}
      <div className="mt-4 sm:mt-0 flex-shrink-0">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow"
          onClick={onInquire}
        >
          Inquire
        </button>
      </div>
    </section>
  );
}
