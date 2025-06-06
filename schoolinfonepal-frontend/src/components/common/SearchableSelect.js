"use client"

import { useState, useRef, useEffect } from "react"

export default function SearchableSelect({
  options = [],
  value,
  onChange,
  placeholder = "Search and select...",
  multiple = false,
  className = "",
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const dropdownRef = useRef(null)

  const filteredOptions = options.filter(
    (option) =>
      option.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      option.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const selectedOptions = multiple
    ? options.filter((option) => value?.includes(option.id))
    : options.find((option) => option.id === value)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelect = (option) => {
    if (multiple) {
      const newValue = value?.includes(option.id)
        ? value.filter((id) => id !== option.id)
        : [...(value || []), option.id]
      onChange(newValue)
    } else {
      onChange(option.id)
      setIsOpen(false)
    }
    setSearchTerm("")
  }

  const handleRemove = (optionId) => {
    if (multiple) {
      onChange(value.filter((id) => id !== optionId))
    } else {
      onChange("")
    }
  }

  const getDisplayText = () => {
    if (multiple) {
      return selectedOptions?.length > 0 ? `${selectedOptions.length} selected` : placeholder
    }
    return selectedOptions?.title || selectedOptions?.name || placeholder
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div
        className={`w-full px-3 py-2 border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white ${
          disabled ? "bg-gray-100 cursor-not-allowed" : ""
        }`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <span
            className={`text-black ${!selectedOptions || (multiple && selectedOptions.length === 0) ? "text-gray-500" : ""}`}
          >
            {getDisplayText()}
          </span>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {multiple && selectedOptions?.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {selectedOptions.map((option) => (
            <span
              key={option.id}
              className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded"
            >
              <span className="text-black">{option.title || option.name}</span>
              <button
                type="button"
                onClick={() => handleRemove(option.id)}
                className="ml-1 text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-hidden">
          <div className="p-2 border-b">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-2 py-1 text-black border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              autoFocus
            />
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.id}
                  className={`px-3 py-2 cursor-pointer hover:bg-gray-100 text-black ${
                    multiple
                      ? value?.includes(option.id)
                        ? "bg-blue-50"
                        : ""
                      : value === option.id
                        ? "bg-blue-50"
                        : ""
                  }`}
                  onClick={() => handleSelect(option)}
                >
                  <div className="flex items-center justify-between">
                    <span>{option.title || option.name}</span>
                    {multiple && value?.includes(option.id) && (
                      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-gray-500">No options found</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
