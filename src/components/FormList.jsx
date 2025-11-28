// src/components/FormList.jsx
import { BarChart3, Copy, ExternalLink, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function FormList() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const response = await fetch('university-association-backend-1.onrender.com/api/admin/forms');
      const data = await response.json();
      setForms(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching forms:', error);
      setLoading(false);
    }
  };

  const deleteForm = async (id) => {
    if (!window.confirm('Are you sure you want to delete this form?')) return;

    try {
      await fetch(`university-association-backend-1.onrender.com/api/admin/forms/${id}`, {
        method: 'DELETE',
      });
      setForms(forms.filter(f => f._id !== id));
    } catch (error) {
      alert('Error deleting form');
    }
  };

  const copyFormLink = (id) => {
    const link = `${window.location.origin}/forms/${id}`;
    navigator.clipboard.writeText(link);
    alert('Form link copied to clipboard!');
  };

  const openFormInNewTab = (id) => {
    window.open(`/forms/${id}`, '_blank');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-gray-500">Loading forms...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Forms</h1>
          <p className="text-gray-600">Create and manage your forms</p>
        </div>
        <button
          onClick={() => navigate('/admin/forms/create')}
          className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-semibold"
        >
          <Plus size={20} />
          Create New Form
        </button>
      </div>

      {forms.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus size={40} className="text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No forms yet</h2>
          <p className="text-gray-600 mb-6">Create your first form to start collecting responses</p>
          <button
            onClick={() => navigate('/admin/forms/create')}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-semibold"
          >
            Create Your First Form
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map((form) => (
            <div key={form._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{form.title}</h3>
                    {form.description && (
                      <p className="text-gray-600 text-sm line-clamp-2">{form.description}</p>
                    )}
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    form.isActive 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {form.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4 pb-4 border-b">
                  <span>{form.questions.length} questions</span>
                  <span>•</span>
                  <span>{new Date(form.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => navigate(`/admin/forms/${form._id}/responses`)}
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors text-sm font-medium"
                  >
                    <BarChart3 size={16} />
                    Responses
                  </button>
                  <button
                    onClick={() => openFormInNewTab(form._id)}
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-50 text-gray-600 rounded hover:bg-gray-100 transition-colors text-sm font-medium"
                  >
                    <ExternalLink size={16} />
                    Preview
                  </button>
                  <button
                    onClick={() => copyFormLink(form._id)}
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-green-50 text-green-600 rounded hover:bg-green-100 transition-colors text-sm font-medium"
                  >
                    <Copy size={16} />
                    Copy Link
                  </button>
                  <button
                    onClick={() => deleteForm(form._id)}
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors text-sm font-medium"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}