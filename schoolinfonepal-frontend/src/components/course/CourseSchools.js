"use client";
import { useEffect, useState } from "react";
import SchoolCard from "@/components/school/SchoolCard";
import { fetchSchools } from "@/utils/api";

export default function CourseSchools({ courseId, onApply }) {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!courseId) return;
    setLoading(true);
    fetchSchools({ course: courseId })
      .then((res) => {
        if (Array.isArray(res)) setSchools(res);
        else if (res && res.results) setSchools(res.results);
        else setSchools([]);
      })
      .finally(() => setLoading(false));
  }, [courseId]);

  if (!courseId) return null;

  return (
    <section className="my-10">
      <h2 className="text-xl font-bold mb-5 text-gray-800">
        Top Ten Plus Two (+2) Science Colleges in Nepal
      </h2>

      {loading ? (
        <div className="py-10 text-center">Loading colleges...</div>
      ) : schools.length === 0 ? (
        <div className="py-10 text-center text-gray-500">
          No colleges found for this course.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {schools.map((school) => (
            <SchoolCard
              key={school.id}
              school={school}
              onApply={() => onApply && onApply(school)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
