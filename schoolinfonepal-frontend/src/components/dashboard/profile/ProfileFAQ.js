"use client"

import { useState, useEffect } from "react"
import { fetchSchoolOwnProfile, updateSchoolOwnProfile } from "../../../utils/api"

export default function ProfileFAQ() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [faqs, setFaqs] = useState([{ question: "", answer: "" }])

  useEffect(() => {
    loadFAQData()
  }, [])

  const loadFAQData = async () => {
    try {
      const schoolData = await fetchSchoolOwnProfile()
      setFaqs(schoolData.faqs?.length > 0 ? schoolData.faqs : [{ question: "", answer: "" }])
    } catch (error) {
      console.error("Error loading FAQ:", error)
    } finally {
      setLoading(false)
    }
  }

  const addFAQ = () => {
    setFaqs([...faqs, { question: "", answer: "" }])
  }

  const removeFAQ = (index) => {
    setFaqs(faqs.filter((_, i) => i !== index))
  }

  const updateFAQ = (index, field, value) => {
    const updated = faqs.map((faq, i) => (i === index ? { ...faq, [field]: value } : faq))
    setFaqs(updated)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const formData = new FormData()

      // Filter out empty FAQs
      const validFaqs = faqs.filter((faq) => faq.question.trim() && faq.answer.trim())

      formData.append("faqs", JSON.stringify(validFaqs))

      await updateSchoolOwnProfile(formData)
      alert("FAQ updated successfully!")
    } catch (error) {
      console.error("Error updating FAQ:", error)
      alert("Error updating FAQ: " + error.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="animate-pulse">Loading FAQ...</div>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Frequently Asked Questions</h3>
        <button
          type="button"
          onClick={addFAQ}
          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
        >
          Add FAQ
        </button>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border rounded-lg p-4">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                <input
                  type="text"
                  value={faq.question}
                  onChange={(e) => updateFAQ(index, "question", e.target.value)}
                  placeholder="Enter question"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Answer</label>
                <textarea
                  value={faq.answer}
                  onChange={(e) => updateFAQ(index, "answer", e.target.value)}
                  placeholder="Enter answer"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {faqs.length > 1 && (
              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => removeFAQ(index)}
                  className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save FAQ"}
        </button>
      </div>
    </form>
  )
}
