"use client"
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
  foreign_affiliation: "",
}

export default function UniversityFilter({ filters, onChange }) {
  const handleClearFilters = () => {
    onChange(defaultFilters)
  }

  // Check if any filters are active
  const hasActiveFilters = Object.values(filters).some((value) => value !== "")

  return (
    <div className="mb-8">
      {/* Filter Content */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Filter size={18} className="text-[#1ca3fd]" />
              University Filters
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FilterSelect
              label="Foreign Affiliation"
              value={filters.foreign_affiliation || ""}
              onChange={(e) => onChange({ ...filters, foreign_affiliation: e.target.value })}
            >
              <option value="">All Universities</option>
              <option value="true">Foreign Affiliated</option>
              <option value="false">Local Universities</option>
            </FilterSelect>

            {/* Placeholder for future filters */}
            <div className="hidden md:block"></div>
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
