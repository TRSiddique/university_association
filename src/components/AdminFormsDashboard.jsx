// src/components/AdminFormsDashboard.jsx
import {
    BarChart3,
    CheckCircle,
    Copy,
    ExternalLink,
    FileText,
    Plus,
    Trash2,
    Users
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminFormsDashboard() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalForms: 0,
    activeForms: 0,
    totalResponses: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchFormsAndStats();
  }, []);

  const fetchFormsAndStats = async () => {
    try {
      const response = await fetch('https://university-association-backend-1.onrender.com/api/admin/forms');
      const data = await response.json();
      setForms(data);
      
      // Calculate stats
      const totalForms = data.length;
      const activeForms = data.filter(f => f.isActive).length;
      
      // Fetch response counts for all forms
      const responseCounts = await Promise.all(
        data.map(form => 
          fetch(`https://university-association-backend-1.onrender.com/api/admin/forms/${form._id}/responses`)
            .then(res => res.json())
            .then(responses => responses.length)
        )
      );
      
      const totalResponses = responseCounts.reduce((sum, count) => sum + count, 0);
      
      setStats({ totalForms, activeForms, totalResponses });
      setForms(data.map((form, idx) => ({ ...form, responseCount: responseCounts[idx] })));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching forms:', error);
      setLoading(false);
    }
  };

  const deleteForm = async (id) => {
    if (!window.confirm('Are you sure you want to delete this form? All responses will be lost.')) return;

    try {
      await fetch(`https://university-association-backend-1.onrender.com/api/admin/forms/${id}`, {
        method: 'DELETE',
      });
      setForms(forms.filter(f => f._id !== id));
      // Recalculate stats
      fetchFormsAndStats();
    } catch (error) {
      alert('Error deleting form');
    }
  };

  const toggleFormStatus = async (id, currentStatus) => {
    try {
      const response = await fetch(`https://university-association-backend-1.onrender.com/api/admin/forms/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus })
      });
      
      if (response.ok) {
        setForms(forms.map(f => 
          f._id === id ? { ...f, isActive: !currentStatus } : f
        ));
        fetchFormsAndStats();
      }
    } catch (error) {
      alert('Error updating form status');
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
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Forms Dashboard</h1>
          <p className="text-gray-600">Manage all your forms and responses in one place</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Forms</p>
                <h3 className="text-3xl font-bold text-gray-800 mt-1">{stats.totalForms}</h3>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <FileText className="text-blue-600" size={28} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Active Forms</p>
                <h3 className="text-3xl font-bold text-gray-800 mt-1">{stats.activeForms}</h3>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="text-green-600" size={28} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Responses</p>
                <h3 className="text-3xl font-bold text-gray-800 mt-1">{stats.totalResponses}</h3>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Users className="text-purple-600" size={28} />
              </div>
            </div>
          </div>
        </div>

        {/* Create Form Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/admin/forms/create')}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md"
          >
            <Plus size={20} />
            Create New Form
          </button>
        </div>

        {/* Forms List */}
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
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block bg-white rounded-lg shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Form Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Questions
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Responses
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {forms.map((form) => (
                    <tr key={form._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{form.title}</div>
                          {form.description && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {form.description}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {form.questions.length}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => navigate(`/admin/forms/${form._id}/responses`)}
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
                        >
                          <BarChart3 size={16} />
                          {form.responseCount || 0}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleFormStatus(form._id, form.isActive)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            form.isActive 
                              ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {form.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(form.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openFormInNewTab(form._id)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Preview Form"
                          >
                            <ExternalLink size={18} />
                          </button>
                          <button
                            onClick={() => copyFormLink(form._id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Copy Link"
                          >
                            <Copy size={18} />
                          </button>
                          <button
                            onClick={() => navigate(`/admin/forms/${form._id}/responses`)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Responses"
                          >
                            <BarChart3 size={18} />
                          </button>
                          <button
                            onClick={() => deleteForm(form._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Form"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4">
              {forms.map((form) => (
                <div key={form._id} className="bg-white rounded-lg shadow-md p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg mb-1">{form.title}</h3>
                      {form.description && (
                        <p className="text-sm text-gray-500 line-clamp-2">{form.description}</p>
                      )}
                    </div>
                    <button
                      onClick={() => toggleFormStatus(form._id, form.isActive)}
                      className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                        form.isActive 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {form.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-4 pb-4 border-b">
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Questions</p>
                      <p className="text-lg font-bold text-gray-800">{form.questions.length}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Responses</p>
                      <p className="text-lg font-bold text-blue-600">{form.responseCount || 0}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Created</p>
                      <p className="text-xs font-medium text-gray-800">
                        {new Date(form.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => navigate(`/admin/forms/${form._id}/responses`)}
                      className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100"
                    >
                      <BarChart3 size={16} />
                      Responses
                    </button>
                    <button
                      onClick={() => openFormInNewTab(form._id)}
                      className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-50 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-100"
                    >
                      <ExternalLink size={16} />
                      Preview
                    </button>
                    <button
                      onClick={() => copyFormLink(form._id)}
                      className="flex items-center justify-center gap-2 px-3 py-2 bg-green-50 text-green-600 rounded-lg text-sm font-medium hover:bg-green-100"
                    >
                      <Copy size={16} />
                      Copy Link
                    </button>
                    <button
                      onClick={() => deleteForm(form._id)}
                      className="flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}