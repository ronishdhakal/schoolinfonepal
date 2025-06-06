"use client"

const SchoolFAQ = ({ formData, setFormData }) => {
  const handleFAQChange = (index, field, value) => {
    const faqs = [...(formData.faqs || [])]
    faqs[index] = { ...faqs[index], [field]: value }
    setFormData((prev) => ({ ...prev, faqs }))
  }

  const addFAQ = () => {
    setFormData((prev) => ({
      ...prev,
      faqs: [...(prev.faqs || []), { question: "", answer: "" }],
    }))
  }

  const removeFAQ = (index) => {
    const faqs = (formData.faqs || []).filter((_, i) => i !== index)
    setFormData((prev) => ({ ...prev, faqs }))
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h3>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">Add common questions and answers about the school</p>
          <button type="button" onClick={addFAQ} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
            + Add FAQ
          </button>
        </div>

        {formData.faqs && formData.faqs.length > 0 && (
          <div className="space-y-4">
            {formData.faqs.map((faq, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Question</label>
                    <input
                      type="text"
                      value={faq.question || ""}
                      onChange={(e) => handleFAQChange(index, "question", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter the question"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Answer</label>
                    <textarea
                      value={faq.answer || ""}
                      onChange={(e) => handleFAQChange(index, "answer", e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter the answer"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeFAQ(index)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Remove FAQ
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {(!formData.faqs || formData.faqs.length === 0) && (
          <p className="text-gray-500 text-sm text-center py-4">No FAQs added</p>
        )}
      </div>
    </div>
  )
}

export default SchoolFAQ
