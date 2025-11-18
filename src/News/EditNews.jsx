// components/EditNews.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';

const EditNews = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAdmin } = useAuth();
    
    const [formData, setFormData] = useState({
        headline: '',
        shortDescription: '',
        fullContent: '',
        image: '',
        date: ''
    });
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);

    // Admin check
    useEffect(() => {
        if (!isAdmin()) {
            navigate('/news');
        }
    }, [isAdmin, navigate]);

    // Fetch news data
    useEffect(() => {
        fetchNewsData();
    }, [id]);

    const fetchNewsData = async () => {
        try {
            const response = await fetch(`https://university-association-backend-1.onrender.com/news/${id}`);
            const result = await response.json();
            
            if (result.success) {
                setFormData({
                    headline: result.data.headline,
                    shortDescription: result.data.shortDescription,
                    fullContent: result.data.fullContent,
                    image: result.data.image,
                    date: result.data.date.split('T')[0] // Format date for input
                });
            }
        } catch (error) {
            console.error('Error fetching news:', error);
            Swal.fire('ত্রুটি!', 'সংবাদ লোড করতে সমস্যা হয়েছে।', 'error');
        } finally {
            setFetchLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`https://university-association-backend-1.onrender.com/news/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                Swal.fire(
                    'সফল!',
                    'সংবাদ সফলভাবে আপডেট করা হয়েছে।',
                    'success'
                ).then(() => {
                    navigate('/news');
                });
            } else {
                throw new Error(data.message || 'Failed to update news');
            }
        } catch (error) {
            console.error('Error updating news:', error);
            Swal.fire('ত্রুটি!', 'সংবাদ আপডেট করতে সমস্যা হয়েছে।', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (fetchLoading) {
        return <div>লোড হচ্ছে...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-2xl">
                <h1 className="text-3xl font-bold text-center mb-8">সংবাদ এডিট করুন</h1>
                
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">শিরোনাম</label>
                            <input
                                type="text"
                                name="headline"
                                value={formData.headline}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium mb-2">সংক্ষিপ্ত বর্ণনা</label>
                            <textarea
                                name="shortDescription"
                                value={formData.shortDescription}
                                onChange={handleChange}
                                required
                                rows="3"
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium mb-2">সম্পূর্ণ কন্টেন্ট</label>
                            <textarea
                                name="fullContent"
                                value={formData.fullContent}
                                onChange={handleChange}
                                required
                                rows="6"
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        
                        {/* <div>
                            <label className="block text-sm font-medium mb-2">ইমেজ URL</label>
                            <input
                                type="url"
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border rounded"
                            />
                        </div> */}
                        
                        <div>
                            <label className="block text-sm font-medium mb-2">তারিখ</label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                        >
                            {loading ? 'আপডেট হচ্ছে...' : 'সংবাদ আপডেট করুন'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditNews;