"use client";
import { useState, useEffect } from "react";
import { fetchDisciplinesDropdown } from "@/utils/api";

const CourseInfo = ({ formData, setFormData }) => {
  const [disciplines, setDisciplines] = useState([]);

  useEffect(() => {
    const loadDisciplines = async () => {
      try {
        const data = await fetchDisciplinesDropdown();
        setDisciplines(data);
      } catch (err) {
        console.error("Failed to load disciplines:", err);
      }
    };
    loadDisciplines();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDisciplineChange = (disciplineId) => {
    const currentDisciplines = formData.disciplines || [];
    const updatedDisciplines = currentDisciplines.includes(disciplineId)
      ? currentDisciplines.filter((id) => id !== disciplineId)
      : [...currentDisciplines, disciplineId];

    handleChange("disciplines", updatedDisciplines);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Course Details</h3>

      <div className="space-y-6">
        {/* Short Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Short Description
          </label>
          <textarea
            value={formData.short_description || ""}
            onChange={(e) => handleChange("short_description", e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Brief description of the course"
          />
        </div>

        {/* Long Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Long Description
          </label>
          <textarea
            value={formData.long_description || ""}
            onChange={(e) => handleChange("long_description", e.target.value)}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Detailed course information, syllabus, teaching approach, etc."
          />
        </div>

        {/* Disciplines */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Disciplines
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-4">
            {disciplines.map((discipline) => (
              <label
                key={discipline.id}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={(formData.disciplines || []).includes(discipline.id)}
                  onChange={() => handleDisciplineChange(discipline.id)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-900">
                  {discipline.name}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Outcome */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Outcome
          </label>
          <textarea
            value={formData.outcome || ""}
            onChange={(e) => handleChange("outcome", e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Expected outcomes and career prospects"
          />
        </div>

        {/* Eligibility */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Eligibility
          </label>
          <textarea
            value={formData.eligibility || ""}
            onChange={(e) => handleChange("eligibility", e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Eligibility criteria and requirements"
          />
        </div>
      </div>
    </div>
  );
};

export default CourseInfo;
