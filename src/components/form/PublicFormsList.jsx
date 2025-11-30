// src/components/PublicFormsList.jsx
import { ArrowRight, Calendar, FileText, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PublicFormsList() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPublicForms();
  }, []);

  const fetchPublicForms = async () => {
    try {
      const response = await fetch('https://university-association-backend-1.onrender.com/api/admin/forms');
      const data = await response.json();
      // Filter only active forms for public view
      const activeForms = data.filter(form => form.isActive);
      setForms(activeForms);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching forms:', error);
      setLoading(false);
    }
  };

  const filteredForms = forms.filter(form =>
    form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (form.description && form.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleFormClick = (formId) => {
    navigate(`/forms/${formId}`);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-gray-500">Loading forms...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Available Forms</h1>
          <p className="text-lg text-gray-600">Browse and fill out available forms</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search forms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Forms Grid */}
        {filteredForms.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FileText size={48} className="text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {searchTerm ? 'No forms found' : 'No forms available'}
            </h2>
            <p className="text-gray-600">
              {searchTerm ? 'Try a different search term' : 'Please check back later'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredForms.map((form) => (
              <div
                key={form._id}
                onClick={() => handleFormClick(form._id)}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-200 hover:border-blue-500 group"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                      <FileText className="text-white" size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-white line-clamp-2 flex-1">
                      {form.title}
                    </h3>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  {form.description && (
                    <p className="text-gray-600 mb-4 line-clamp-3 min-h-[60px]">
                      {form.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4 pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <FileText size={16} />
                      <span>{form.questions.length} questions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>{new Date(form.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Fill Form Button */}
                  <button
                    className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 group-hover:bg-blue-600"
                  >
                    Fill Form
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Box */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-3xl mx-auto">
          <h3 className="font-semibold text-blue-900 mb-2">📝 কিভাবে ফর্ম পূরণ করেন:</h3>
          <ol className="list-decimal list-inside space-y-1 text-blue-800">
           <li>ওপরে যেকোনো ফর্ম কার্ডে ক্লিক করুন</li> 
           <li>ফর্মটি বারবার পড়ুন এবং সকল আবশ্যক প্রশ্নের উত্তর দিন</li>
            <li>শেষ হলে সাবমিট বাটনে ক্লিক করুন</li> 
            <li>সাবমিট করার পর আপনি একটি নিশ্চিতকরণ বার্তা দেখতে পাবেন</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
