"use client"
import { useEffect, useState } from "react"
import {
  fetchInformationCategories,
  fetchUniversitiesDropdown,
  fetchLevelsDropdown,
  fetchCoursesDropdown,
  fetchSchoolsDropdown,
} from "@/utils/api"
import { Filter, X } from "lucide-react"

const FilterSelect = ({ label, value, onChange, children }) => (
  <div className="flex flex-col w-full">
    <label className="mb-1.5 text-sm font-medium text-gray-700">{label}</label>
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#1ca3fd] focus:border-[#1ca3fd] bg-white transition-colors duration-150 text-gray-800 appearance-none shadow-sm"
      >
        {children}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
        <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
          <path
            d="M7 7l3-3 3 3m0 6l-3 3-3-3"
            strokeWidth="1.5"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  </div>
)

const defaultFilters = {
  category: "",
  university: "",
  level: "",
  course: "",
  school: "",
}

export default function InformationFilter({ filters, setFilters }) {
  const [categories, setCategories] = useState([])
  const [universities, setUniversities] = useState([])
  const [levels, setLevels] = useState([])
  const [courses, setCourses] = useState([])
  const [schools, setSchools] = useState([])
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const [categoriesData, universitiesData, levelsData, coursesData, schoolsData] = await Promise.all([
          fetchInformationCategories(),
          fetchUniversitiesDropdown(),
          fetchLevelsDropdown(),
          fetchCoursesDropdown(),
          fetchSchoolsDropdown(),
        ])

        setCategories(Array.isArray(categoriesData) ? categoriesData : categoriesData?.results || [])
        setUniversities(Array.isArray(universitiesData) ? universitiesData : universitiesData?.results || [])
        setLevels(Array.isArray(levelsData) ? levelsData : levelsData?.results || [])
        setCourses(Array.isArray(coursesData) ? coursesData : coursesData?.results || [])
        setSchools(Array.isArray(schoolsData) ? schoolsData : schoolsData?.results || [])
      } catch (error) {
        console.error("Error loading filter data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleClearFilters = () => {
    setFilters(defaultFilters)
  }

  // Check if any filters are active
  const hasActiveFilters = Object.values(filters).some((value) => value !== "")

  return (
    <div className="mb-8">
      {/* Mobile Filter Toggle */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm"
        >
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-[#1ca3fd]" />
            <span className="font-medium text-gray-700">Filter Information</span>
          </div>
          {hasActiveFilters && (
            <span className="bg-[#1ca3fd] text-white text-xs font-medium px-2 py-0.5 rounded-full">
              {Object.values(filters).filter((v) => v !== "").length}
            </span>
          )}
        </button>
      </div>

      {/* Filter Content */}
      <div
        className={`bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300 ${isFilterOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 md:max-h-[500px] md:opacity-100"}`}
      >
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Filter size={18} className="text-[#1ca3fd]" />
              Information Filters
            </h3>
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="text-sm text-[#1ca3fd] hover:text-blue-600 flex items-center gap-1"
              >
                <X size={14} />
                Clear all
              </button>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-10 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <FilterSelect
                label="Category"
                value={filters.category || ""}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </FilterSelect>

              <FilterSelect
                label="University"
                value={filters.university || ""}
                onChange={(e) => setFilters({ ...filters, university: e.target.value })}
              >
                <option value="">All Universities</option>
                {universities.map((university) => (
                  <option key={university.id} value={university.slug}>
                    {university.name}
                  </option>
                ))}
              </FilterSelect>

              <FilterSelect
                label="Level"
                value={filters.level || ""}
                onChange={(e) => setFilters({ ...filters, level: e.target.value })}
              >
                <option value="">All Levels</option>
                {levels.map((level) => (
                  <option key={level.id} value={level.slug}>
                    {level.name}
                  </option>
                ))}
              </FilterSelect>

              <FilterSelect
                label="Course"
                value={filters.course || ""}
                onChange={(e) => setFilters({ ...filters, course: e.target.value })}
              >
                <option value="">All Courses</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.slug}>
                    {course.name}
                  </option>
                ))}
              </FilterSelect>

              <FilterSelect
                label="School"
                value={filters.school || ""}
                onChange={(e) => setFilters({ ...filters, school: e.target.value })}
              >
                <option value="">All Schools</option>
                {schools.map((school) => (
                  <option key={school.id} value={school.slug}>
                    {school.name}
                  </option>
                ))}
              </FilterSelect>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
