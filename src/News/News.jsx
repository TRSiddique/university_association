import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const News = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch news from database
    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            setLoading(true);
            const response = await fetch('https://university-association-backend-1.onrender.com/news');
            
            if (!response.ok) {
                throw new Error('Failed to fetch news');
            }
            
            const result = await response.json();
            
            if (result.success) {
                setNews(result.data);
            } else {
                throw new Error(result.message || 'Failed to fetch news');
            }
        } catch (error) {
            console.error('Error fetching news:', error);
            setError('Failed to load news. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="text-gray-600 mt-4">Loading news...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <svg className="w-24 h-24 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">Error Loading News</h3>
                        <p className="text-gray-500 mb-4">{error}</p>
                        <button 
                            onClick={fetchNews}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">CUSAP News & Updates</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Stay updated with the latest news, events, and announcements from the Chittagong University Students Association of Pekua
                    </p>
                </div>

                {/* Action Bar - Only Add News Button */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <div className="flex justify-end">
                        <Link
                            to="/addnews"
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span>Add News</span>
                        </Link>
                    </div>
                </div>

                {/* News Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {news.map((item) => (
                        <Link
                            key={item._id}
                            to={`/news/${item._id}`}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                        >
                            <div className="relative">
                                <img
                                    src={item.image}
                                    alt={item.headline}
                                    className="w-full h-48 object-cover"
                                />
                            </div>
                            
                            <div className="p-6">
                                <div className="flex items-center text-sm text-gray-500 mb-2">
                                    <span>{new Date(item.date).toLocaleDateString()}</span>
                                </div>
                                
                                <h3 className="text-xl font-semibold text-gray-800 mb-3 line-clamp-2">
                                    {item.headline}
                                </h3>
                                
                                <p className="text-gray-600 mb-4 line-clamp-3">
                                    {item.shortDescription}
                                </p>
                                
                                <div className="flex justify-end text-sm text-gray-500">
                                    <span className="text-blue-600 font-medium hover:text-blue-700">
                                        Read More →
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Empty State */}
                {news.length === 0 && (
                    <div className="text-center py-12">
                        <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9m0 0v12m0-12a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No news available</h3>
                        <p className="text-gray-500 mb-4">Be the first to add some news!</p>
                        <Link
                            to="/addnews"
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium inline-flex items-center space-x-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span>Add First News</span>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default News;