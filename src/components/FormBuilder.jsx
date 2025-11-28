import { GripVertical, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function FormBuilder() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    questions: []
  });

  const questionTypes = [
    { value: 'text', label: 'Short Text' },
    { value: 'textarea', label: 'Long Text' },
    { value: 'radio', label: 'Multiple Choice' },
    { value: 'checkbox', label: 'Checkboxes' },
    { value: 'dropdown', label: 'Dropdown' },
    { value: 'email', label: 'Email' },
    { value: 'number', label: 'Number' },
    { value: 'date', label: 'Date' }
  ];

  const addQuestion = () => {
    const newQuestion = {
      _id: Date.now().toString(), // Use string ID for consistency
      questionText: '',
      questionType: 'text',
      options: [],
      required: false,
      order: form.questions.length
    };
    setForm({ ...form, questions: [...form.questions, newQuestion] });
  };

  const updateQuestion = (id, field, value) => {
    setForm({
      ...form,
      questions: form.questions.map(q => 
        q._id === id ? { ...q, [field]: value } : q
      )
    });
  };

  const deleteQuestion = (id) => {
    setForm({
      ...form,
      questions: form.questions.filter(q => q._id !== id)
    });
  };

  const addOption = (questionId) => {
    setForm({
      ...form,
      questions: form.questions.map(q => 
        q._id === questionId 
          ? { ...q, options: [...q.options, ''] }
          : q
      )
    });
  };

  const updateOption = (questionId, optionIndex, value) => {
    setForm({
      ...form,
      questions: form.questions.map(q => 
        q._id === questionId
          ? {
              ...q,
              options: q.options.map((opt, idx) => 
                idx === optionIndex ? value : opt
              )
            }
          : q
      )
    });
  };

  const removeOption = (questionId, optionIndex) => {
    setForm({
      ...form,
      questions: form.questions.map(q => 
        q._id === questionId
          ? { ...q, options: q.options.filter((_, idx) => idx !== optionIndex) }
          : q
      )
    });
  };

  const handleSave = async () => {
    try {
      const response = await fetch('university-association-backend-1.onrender.com/api/admin/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      
      if (response.ok) {
        alert('Form created successfully!');
        navigate('/admin/forms'); // Redirect to forms list
      }
    } catch (error) {
      alert('Error creating form');
    }
  };

  const needsOptions = (type) => ['radio', 'checkbox', 'dropdown'].includes(type);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Create New Form</h1>
        
        <input
          type="text"
          placeholder="Form Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <textarea
          placeholder="Form Description (optional)"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="3"
        />
      </div>

      {form.questions.map((question, index) => (
        <div key={question._id} className="bg-white rounded-lg shadow-md p-6 mb-4">
          <div className="flex items-start gap-3 mb-4">
            <GripVertical className="text-gray-400 mt-3 cursor-move" size={20} />
            
            <div className="flex-1">
              <input
                type="text"
                placeholder="Question"
                value={question.questionText}
                onChange={(e) => updateQuestion(question._id, 'questionText', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <div className="flex gap-4 mb-3">
                <select
                  value={question.questionType}
                  onChange={(e) => updateQuestion(question._id, 'questionType', e.target.value)}
                  className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {questionTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={question.required}
                    onChange={(e) => updateQuestion(question._id, 'required', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-700">Required</span>
                </label>
              </div>

              {needsOptions(question.questionType) && (
                <div className="space-y-2">
                  {question.options.map((option, optIdx) => (
                    <div key={optIdx} className="flex gap-2">
                      <input
                        type="text"
                        placeholder={`Option ${optIdx + 1}`}
                        value={option}
                        onChange={(e) => updateOption(question._id, optIdx, e.target.value)}
                        className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => removeOption(question._id, optIdx)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addOption(question._id)}
                    className="text-blue-500 text-sm hover:text-blue-600"
                  >
                    + Add Option
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => deleteQuestion(question._id)}
              className="p-2 text-red-500 hover:bg-red-50 rounded"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={addQuestion}
        className="w-full bg-white border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center gap-2 text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors mb-6"
      >
        <Plus size={20} />
        Add Question
      </button>

      <div className="flex gap-4">
        <button
          onClick={handleSave}
          className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
        >
          Save Form
        </button>
        <button
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          onClick={() => navigate('/admin/forms')}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}