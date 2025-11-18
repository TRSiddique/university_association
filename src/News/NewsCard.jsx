// components/NewsCard.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NewsCard = ({ item, onDelete, onEdit }) => {
    const { isAdmin } = useAuth();

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="relative">
                <img
                    src={item.image}
                    alt={item.headline}
                    className="w-full h-48 object-cover"
                />
                {isAdmin() && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                        ADMIN mode
                    </div>
                )}
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
                
                <div className="flex justify-between items-center">
                    <Link
                        to={`/news/${item._id}`}
                        className="text-blue-600 font-medium hover:text-blue-700 text-sm"
                    >
                        বিস্তারিত পড়ুন →
                    </Link>

                    {isAdmin() && (
                        <div className="flex space-x-2">
                            <button
                                onClick={() => onEdit(item._id)}
                                className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors text-sm flex items-center gap-1"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                এডিট
                            </button>

                            <button
                                onClick={() => onDelete(item._id, item.headline)}
                                className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-colors text-sm flex items-center gap-1"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                ডিলিট
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NewsCard;