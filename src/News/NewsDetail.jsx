import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Phone, 
  Calendar, 
  GraduationCap, 
  MapPin, 
  IdCard, 
  Droplet, 
  User,
  Mail,
  Share2
} from 'lucide-react';
const NewsDetail = () => {
    const { id } = useParams();
    const [copied, setCopied] = useState(false);
    const [newsItem, setNewsItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch real data from API
    useEffect(() => {
        const fetchNewsDetail = async () => {
            try {
                setLoading(true);
                // FIXED: Removed double slash from API URL
                const response = await fetch(`university-association-backend-1.onrender.com/news/${id}`);
                
                if (!response.ok) {
                    throw new Error('Failed to fetch news details');
                }
                
                const result = await response.json();
                
                if (result.success) {
                    setNewsItem(result.data);
                } else {
                    throw new Error(result.message || 'Failed to fetch news details');
                }
            } catch (error) {
                console.error('Error fetching news details:', error);
                setError('Failed to load news. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchNewsDetail();
        }
    }, [id]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
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

    if (error || !newsItem) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <svg className="w-24 h-24 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">Error Loading News</h3>
                        <p className="text-gray-500 mb-4">{error || 'News article not found'}</p>
                        <Link
                            to="/news"
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Back to News
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
    const handleShare = async () => {
        if (navigator.share) {
          try {
            await navigator.share({
              url: window.location.href,
            });
          } catch (error) {
            console.log('Error sharing:', error);
          }
        } else {
          // Fallback: copy to clipboard
          navigator.clipboard.writeText(window.location.href);
          alert('Profile link copied to clipboard!');
        }
      };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                {/* Breadcrumb */}
                <nav className="flex mb-8" aria-label="Breadcrumb">
                    <ol className="flex items-center space-x-2 text-sm text-gray-600">
                        <li>
                            <Link to="/" className="hover:text-blue-600">Home</Link>
                        </li>
                        <li>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </li>
                        <li>
                            <Link to="/news" className="hover:text-blue-600">News</Link>
                        </li>
                        <li>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </li>
                        <li className="text-gray-400">
                            {newsItem.headline}
                        </li>
                    </ol>
                </nav>

                <div className="max-w-4xl mx-auto">
                    {/* Main Content */}
                    <article className="bg-white rounded-lg shadow-md overflow-hidden">
                        {/* News Image */}
                        <div className="relative">
                            <img
                                src={newsItem.image}
                                alt={newsItem.headline}
                                className="w-full h-96 object-cover"
                                onError={(e) => {
                                    // Fallback if image fails to load
                                    e.target.src = 'https://via.placeholder.com/800x400?text=News+Image';
                                }}
                            />
                        </div>

                        {/* News Content */}
                        <div className="p-8">
                            {/* Meta Information - Only Date */}
                            <div className="flex items-center justify-between mb-6 text-sm text-gray-500">
                                <div className="flex items-center space-x-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>
                                        {newsItem.date ? 
                                            new Date(newsItem.date).toLocaleDateString('en-US', { 
                                                year: 'numeric', 
                                                month: 'long', 
                                                day: 'numeric' 
                                            }) : 
                                            'Recent'
                                        }
                                    </span>
                                </div>
                            </div>

                            {/* Headline */}
                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-6">
                                {newsItem.headline}
                            </h1>

                            {/* Full Description */}
                            <div className="prose prose-lg max-w-none mb-8 text-gray-700 leading-relaxed">
                                {newsItem.fullDescription && newsItem.fullDescription.split('\n').map((paragraph, index) => (
                                    paragraph.trim() && (
                                        <p key={index} className="mb-4">
                                            {paragraph}
                                        </p>
                                    )
                                ))}
                            </div>

                            {/* Share Section - Only Copy Link */}
                            <div className="border-t border-gray-200 pt-6">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 sm:mb-0">
                                        Share this news:
                                    </h3>
                                    <div className="flex items-center space-x-3">
                                        {/* Copy Link Button */}
                                        <button
                                            onClick={copyToClipboard}
                                            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                            <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                                        </button>
                                        <button
                                                        onClick={handleShare}
                                                        className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                                      >
                                                        <Share2 size={20} />
                                                        শেয়ার করুন
                                                      </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </article>

                    {/* Related News Section */}
                    {/* <section className="mt-12">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">More News</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-lg shadow-md overflow-hidden p-6 text-center">
                                <p className="text-gray-500">More news articles will appear here</p>
                            </div>
                            <div className="bg-white rounded-lg shadow-md overflow-hidden p-6 text-center">
                                <p className="text-gray-500">More news articles will appear here</p>
                            </div>
                        </div>
                    </section> */}

                    {/* Back to News Button */}
                    <div className="mt-8 text-center">
                        <Link
                            to="/news"
                            className="inline-flex items-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span>Back to All News</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewsDetail;