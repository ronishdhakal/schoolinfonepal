"use client"

const UniversityContact = ({ formData, setFormData }) => {
  const handlePhoneChange = (index, value) => {
    const phones = [...(formData.phones || [])]
    phones[index] = { phone: value }
    setFormData((prev) => ({ ...prev, phones }))
  }

  const addPhone = () => {
    setFormData((prev) => ({
      ...prev,
      phones: [...(prev.phones || []), { phone: "" }],
    }))
  }

  const removePhone = (index) => {
    const phones = (formData.phones || []).filter((_, i) => i !== index)
    setFormData((prev) => ({ ...prev, phones }))
  }

  const handleEmailChange = (index, value) => {
    const emails = [...(formData.emails || [])]
    emails[index] = { email: value }
    setFormData((prev) => ({ ...prev, emails }))
  }

  const addEmail = () => {
    setFormData((prev) => ({
      ...prev,
      emails: [...(prev.emails || []), { email: "" }],
    }))
  }

  const removeEmail = (index) => {
    const emails = (formData.emails || []).filter((_, i) => i !== index)
    setFormData((prev) => ({ ...prev, emails }))
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Contact Information</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Phone Numbers */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-700">Phone Numbers</label>
            <button
              type="button"
              onClick={addPhone}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            >
              + Add Phone
            </button>
          </div>
          <div className="space-y-3">
            {(formData.phones || []).map((phone, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="tel"
                  value={phone.phone || ""}
                  onChange={(e) => handlePhoneChange(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Phone number"
                />
                <button
                  type="button"
                  onClick={() => removePhone(index)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Remove
                </button>
              </div>
            ))}
            {(!formData.phones || formData.phones.length === 0) && (
              <p className="text-gray-500 text-sm">No phone numbers added</p>
            )}
          </div>
        </div>

        {/* Email Addresses */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-700">Email Addresses</label>
            <button
              type="button"
              onClick={addEmail}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            >
              + Add Email
            </button>
          </div>
          <div className="space-y-3">
            {(formData.emails || []).map((email, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="email"
                  value={email.email || ""}
                  onChange={(e) => handleEmailChange(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Email address"
                />
                <button
                  type="button"
                  onClick={() => removeEmail(index)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Remove
                </button>
              </div>
            ))}
            {(!formData.emails || formData.emails.length === 0) && (
              <p className="text-gray-500 text-sm">No email addresses added</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UniversityContact
