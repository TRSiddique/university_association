import { Send } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function PublicForm() {
  const { id: formId } = useParams();
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchForm();
  }, [formId]);

  const fetchForm = async () => {
    try {
      const response = await fetch(`university-association-backend-1.onrender.com/api/public/forms/${formId}`);
      const data = await response.json();
      setForm(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching form:', error);
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value });
    if (errors[questionId]) {
      setErrors({ ...errors, [questionId]: null });
    }
  };

  const handleCheckboxChange = (questionId, option) => {
    const currentAnswers = answers[questionId] || [];
    const newAnswers = currentAnswers.includes(option)
      ? currentAnswers.filter(a => a !== option)
      : [...currentAnswers, option];
    handleAnswerChange(questionId, newAnswers);
  };

  const validateForm = () => {
    const newErrors = {};
    form.questions.forEach(q => {
      if (q.required && !answers[q._id]) {
        newErrors[q._id] = 'This field is required';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
        questionId,
        answer
      }));

      const response = await fetch(`university-association-backend-1.onrender.com/api/public/forms/${formId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: formattedAnswers })
      });

      if (response.ok) {
        setSubmitted(true);
      }
    } catch (error) {
      alert('Error submitting form');
    }
  };

  const renderQuestion = (question) => {
    const commonClasses = "w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500";
    const errorClasses = errors[question._id] ? "border-red-500" : "border-gray-300";

    switch (question.questionType) {
      case 'text':
      case 'email':
      case 'number':
        return (
          <input
            type={question.questionType}
            value={answers[question._id] || ''}
            onChange={(e) => handleAnswerChange(question._id, e.target.value)}
            className={`${commonClasses} ${errorClasses}`}
          />
        );

      case 'textarea':
        return (
          <textarea
            value={answers[question._id] || ''}
            onChange={(e) => handleAnswerChange(question._id, e.target.value)}
            className={`${commonClasses} ${errorClasses} resize-none`}
            rows="4"
          />
        );

      case 'date':
        return (
          <input
            type="date"
            value={answers[question._id] || ''}
            onChange={(e) => handleAnswerChange(question._id, e.target.value)}
            className={`${commonClasses} ${errorClasses}`}
          />
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {question.options.map((option, idx) => (
              <label key={idx} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                <input
                  type="radio"
                  name={question._id}
                  value={option}
                  checked={answers[question._id] === option}
                  onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                  className="w-4 h-4"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className="space-y-2">
            {question.options.map((option, idx) => (
              <label key={idx} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={(answers[question._id] || []).includes(option)}
                  onChange={() => handleCheckboxChange(question._id, option)}
                  className="w-4 h-4"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );

      case 'dropdown':
        return (
          <select
            value={answers[question._id] || ''}
            onChange={(e) => handleAnswerChange(question._id, e.target.value)}
            className={`${commonClasses} ${errorClasses}`}
          >
            <option value="">Select an option</option>
            {question.options.map((option, idx) => (
              <option key={idx} value={option}>{option}</option>
            ))}
          </select>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6 flex justify-center items-center min-h-screen">
        <div className="text-gray-500">Loading form...</div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="max-w-3xl mx-auto p-6 flex justify-center items-center min-h-screen">
        <div className="text-red-500">Form not found</div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto p-6 flex justify-center items-center min-h-screen">
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Thank You!</h2>
          <p className="text-gray-600">Your response has been submitted successfully.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 min-h-screen bg-gray-50">
      <div className="bg-white rounded-lg shadow-md p-8 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{form.title}</h1>
        {form.description && (
          <p className="text-gray-600">{form.description}</p>
        )}
      </div>

      <div className="space-y-6">
        {form.questions.map((question, index) => (
          <div key={question._id} className="bg-white rounded-lg shadow-md p-6">
            <label className="block mb-3">
              <span className="text-lg font-medium text-gray-800">
                {index + 1}. {question.questionText}
                {question.required && <span className="text-red-500 ml-1">*</span>}
              </span>
            </label>
            
            {renderQuestion(question)}
            
            {errors[question._id] && (
              <p className="text-red-500 text-sm mt-2">{errors[question._id]}</p>
            )}
          </div>
        ))}

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-500 text-white py-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
        >
          <Send size={20} />
          Submit
        </button>
      </div>
    </div>
  );
}