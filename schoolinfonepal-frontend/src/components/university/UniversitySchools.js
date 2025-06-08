"use client";
import SchoolCard from "@/components/school/SchoolCard";

const UniversitySchools = ({ university, onApply }) => {
  // Use the correct field: schools, colleges, or affiliated_colleges as per your data model.
  const schools = Array.isArray(university?.schools)
    ? university.schools
    : Array.isArray(university?.colleges)
    ? university.colleges
    : [];

  if (!schools.length) {
    return (
      <section className="bg-white rounded-2xl shadow p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Affiliated Schools/Colleges
        </h2>
        <div className="text-gray-400">No affiliated schools or colleges listed.</div>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-2xl shadow p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Affiliated Schools/Colleges
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {schools.map((school) => (
          <SchoolCard
            key={school.id}
            school={school}
            onApply={onApply ? () => onApply(school) : undefined}
          />
        ))}
      </div>
    </section>
  );
};

export default UniversitySchools;
