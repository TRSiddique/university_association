import { ArrowLeft, Download, Eye } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function ResponseViewer() {
  const { id: formId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFormAndResponses();
  }, [formId]);

  const fetchFormAndResponses = async () => {
    try {
      const [formRes, responsesRes] = await Promise.all([
        fetch(`https://university-association-backend-1.onrender.com/api/admin/forms/${formId}`),
        fetch(`https://university-association-backend-1.onrender.com/api/admin/forms/${formId}/responses`)
      ]);

      const formData = await formRes.json();
      const responsesData = await responsesRes.json();

      setForm(formData);
      setResponses(responsesData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const getAnswerForQuestion = (response, questionId) => {
    // Safety check for response and answers
    if (!response || !response.answers || !Array.isArray(response.answers)) {
      return 'No answer';
    }
    
    // Safety check for questionId
    if (!questionId) {
      return 'No answer';
    }
    
    const answer = response.answers.find(a => {
      if (!a || !a.questionId) return false;
      return a.questionId.toString() === questionId.toString();
    });
    
    if (!answer || answer.answer === undefined || answer.answer === null) {
      return 'No answer';
    }
    
    if (Array.isArray(answer.answer)) {
      return answer.answer.length > 0 ? answer.answer.join(', ') : 'No answer';
    }
    
    return answer.answer.toString();
  };

  const exportToCSV = () => {
    if (!form || responses.length === 0) return;

    const headers = ['Submitted At', ...form.questions.map(q => q.questionText || 'Untitled')];
    const rows = responses.map(response => {
      return [
        new Date(response.submittedAt).toLocaleString(),
        ...form.questions.map(q => {
          const answer = getAnswerForQuestion(response, q._id);
          // Escape quotes and commas for CSV
          return answer.replace(/"/g, '""');
        })
      ];
    });

    const csvContent = [
      headers.map(h => `"${h}"`).join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${form.title}-responses-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-gray-500">Loading responses...</div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-red-500">Form not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <button
          onClick={() => navigate('/admin/forms')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
        >
          <ArrowLeft size={20} />
          Back to Forms
        </button>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{form.title}</h1>
            <p className="text-gray-600">{responses.length} responses</p>
          </div>
          <button
            onClick={exportToCSV}
            disabled={responses.length === 0}
            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <Download size={18} />
            Export CSV
          </button>
          <button
            onClick={() => console.log('Form:', form, 'Responses:', responses)}
            className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            Debug Data
          </button>
        </div>
      </div>

      {responses.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Eye size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No responses yet</p>
          <p className="text-gray-400 text-sm mt-2">Share your form to start collecting responses</p>
        </div>
      ) : (
        <div className="space-y-6">
          {responses.map((response, idx) => (
            <div key={response._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4 pb-4 border-b">
                <h3 className="font-semibold text-gray-800">Response #{responses.length - idx}</h3>
                <span className="text-sm text-gray-500">
                  {new Date(response.submittedAt).toLocaleString()}
                </span>
              </div>

              <div className="space-y-4">
                {form.questions.map((question, qIdx) => {
                  // Safety check for question
                  if (!question || !question._id) {
                    return null;
                  }
                  
                  return (
                    <div key={question._id} className="border-l-4 border-blue-500 pl-4">
                      <p className="font-medium text-gray-700 mb-1">
                        {qIdx + 1}. {question.questionText || 'Untitled Question'}
                      </p>
                      <p className="text-gray-600">
                        {getAnswerForQuestion(response, question._id)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}