"use client";
const SchoolFAQ = ({ formData, setFormData }) => {
  // Defensive: always use faqs array
  const handleQuestionChange = (index, value) => {
    const updated = [...(formData.faqs || [])];
    updated[index] = { ...updated[index], question: value };
    setFormData((prev) => ({ ...prev, faqs: updated }));
  };

  const handleAnswerChange = (index, value) => {
    const updated = [...(formData.faqs || [])];
    updated[index] = { ...updated[index], answer: value };
    setFormData((prev) => ({ ...prev, faqs: updated }));
  };

  const addFAQ = () => {
    const updated = [...(formData.faqs || []), { question: "", answer: "" }];
    setFormData((prev) => ({ ...prev, faqs: updated }));
  };

  const removeFAQ = (index) => {
    const updated = [...(formData.faqs || [])];
    updated.splice(index, 1);
    setFormData((prev) => ({ ...prev, faqs: updated }));
  };

  return (
    <div className="mb-8">
      <label className="block font-medium mb-2">Frequently Asked Questions</label>
      {(formData.faqs || []).map((item, index) => (
        <div key={index} className="mb-6 border rounded p-4 space-y-3 bg-gray-50">
          <input
            type="text"
            placeholder="Question"
            value={item.question || ""}
            onChange={(e) => handleQuestionChange(index, e.target.value)}
            className="input w-full"
            required
          />
          <textarea
            placeholder="Answer"
            value={item.answer || ""}
            onChange={(e) => handleAnswerChange(index, e.target.value)}
            className="input w-full"
            rows={3}
            required
          />
          <button
            type="button"
            onClick={() => removeFAQ(index)}
            className="text-red-500"
          >
            Remove FAQ
          </button>
        </div>
      ))}

      <button type="button" onClick={addFAQ} className="text-blue-600">
        + Add FAQ
      </button>
    </div>
  );
};

export default SchoolFAQ;
