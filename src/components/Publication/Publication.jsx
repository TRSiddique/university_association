import { useState } from 'react';
import publicationData from '../../data/publicationData.json';

const Publication = () => {
    const [activeTab, setActiveTab] = useState('constitution');
    const [selectedPdf, setSelectedPdf] = useState(null);

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Open PDF in new tab
    const openPdf = (fileUrl) => {
        window.open(fileUrl, '_blank');
    };

    // Download PDF
    const downloadPdf = (fileUrl, fileName) => {
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = fileName || 'document.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                       চুসাপ প্রকাশনা
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                         চুসাপের অফিসিয়াল ডকুমেন্ট, ম্যাগাজিন ও প্রকাশনা এক জায়গায়
                    </p>
                </div>

                {/* Tabs - REMOVED Search */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <div className="flex justify-center">
                        <div className="flex flex-wrap gap-1 bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => setActiveTab('constitution')}
                                className={`px-4 py-2 rounded-md font-medium transition-colors whitespace-nowrap ${
                                    activeTab === 'constitution'
                                        ? 'bg-blue-600 text-white shadow-sm'
                                        : 'text-gray-600 hover:text-blue-600'
                                }`}
                            >
                                📜গঠনতন্ত্র 
                            </button>
                            <button
                                onClick={() => setActiveTab('magazines')}
                                className={`px-4 py-2 rounded-md font-medium transition-colors whitespace-nowrap ${
                                    activeTab === 'magazines'
                                        ? 'bg-blue-600 text-white shadow-sm'
                                        : 'text-gray-600 hover:text-blue-600'
                                }`}
                            >
                                📚 সাময়িকী  ({publicationData.magazines.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('documents')}
                                className={`px-4 py-2 rounded-md font-medium transition-colors whitespace-nowrap ${
                                    activeTab === 'documents'
                                        ? 'bg-blue-600 text-white shadow-sm'
                                        : 'text-gray-600 hover:text-blue-600'
                                }`}
                            >
                                📄ডকুমেন্ট ({publicationData.documents.length})
                            </button>
                        </div>
                    </div>
                </div>

                {/* Constitution Tab */}
                {activeTab === 'constitution' && (
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="p-8">
                                <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-8">
                                    {/* Constitution Info */}
                                    <div className="flex-1">
                                        <div className="flex items-center mb-4">
                                            <div className="bg-blue-100 p-3 rounded-lg">
                                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </div>
                                            <div className="ml-4">
                                                <h2 className="text-2xl font-bold text-gray-800">
                                                    {publicationData.constitution.title}
                                                </h2>
                                                <p className="text-blue-600 font-semibold">
                                                    Version {publicationData.constitution.version}
                                                </p>
                                            </div>
                                        </div>

                                        <p className="text-gray-600 mb-6">
                                            {publicationData.constitution.description}
                                        </p>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                            <div className="flex items-center text-sm text-gray-600">
                                                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                {publicationData.constitution.pages} Pages
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                </svg>
                                                {publicationData.constitution.fileSize}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                Updated {formatDate(publicationData.constitution.lastUpdated)}
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <button
                                                onClick={() => openPdf(publicationData.constitution.fileUrl)}
                                                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
                                            >
                                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                                গঠনতন্ত্র দেখুন 
                                            </button>
                                            <button
                                                onClick={() => downloadPdf(publicationData.constitution.fileUrl, 'CUSAP-Constitution.pdf')}
                                                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center"
                                            >
                                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                </svg>
                                                ডাউনলোড করুন 
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Magazines Tab */}
                {activeTab === 'magazines' && (
                    <div>
                        {publicationData.magazines.length === 0 ? (
                            <div className="text-center py-12">
                                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                                <h3 className="text-lg font-semibold text-gray-600 mb-2">No magazines available</h3>
                                <p className="text-gray-500">Check back later for new publications</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {publicationData.magazines.map((magazine) => (
                                    <div
                                        key={magazine.id}
                                        className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                                    >
                                        {/* Magazine Cover */}
                                        <div className="relative h-48 bg-gradient-to-br from-purple-400 to-pink-600">
                                            <img
                                                src={magazine.coverImage}
                                                alt={magazine.title}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute top-3 right-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                                                {magazine.pages}p
                                            </div>
                                            <div className="absolute top-3 left-3">
                                                <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                                                    {magazine.category}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Magazine Info */}
                                        <div className="p-4">
                                            <h3 className="font-bold text-gray-800 mb-2 line-clamp-2">
                                                {magazine.title}
                                            </h3>
                                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                                {magazine.description}
                                            </p>
                                            
                                            <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center">
                                                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        {formatDate(magazine.publishDate)}
                                                    </div>
                                                    <div className="flex items-center">
                                                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                        </svg>
                                                        {magazine.fileSize}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => openPdf(magazine.fileUrl)}
                                                    className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 transition-colors"
                                                >
                                                    View
                                                </button>
                                                <button
                                                    onClick={() => downloadPdf(magazine.fileUrl, `${magazine.title}.pdf`)}
                                                    className="flex-1 border border-gray-300 text-gray-700 py-2 px-3 rounded text-sm hover:bg-gray-50 transition-colors"
                                                >
                                                    Download
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Documents Tab - UPDATED: Responsive grid layout */}
                {activeTab === 'documents' && (
                    <div>
                        {publicationData.documents.length === 0 ? (
                            <div className="text-center py-12">
                                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <h3 className="text-lg font-semibold text-gray-600 mb-2">No documents available</h3>
                                <p className="text-gray-500">Check back later for new documents</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {publicationData.documents.map((doc) => (
                                    <div
                                        key={doc.id}
                                        className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                                    >
                                        <div className="p-6">
                                            {/* Document Icon and Title */}
                                            <div className="flex items-center mb-4">
                                                <div className="bg-green-100 p-3 rounded-lg">
                                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                </div>
                                                <div className="ml-4">
                                                    <h3 className="font-bold text-gray-800 text-lg">
                                                        {doc.title}
                                                    </h3>
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        {doc.type}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Description */}
                                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                                {doc.description}
                                            </p>

                                            {/* Document Details */}
                                            <div className="space-y-2 text-sm text-gray-500 mb-4">
                                                <div className="flex items-center">
                                                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                    </svg>
                                                    {doc.fileSize}
                                                </div>
                                                <div className="flex items-center">
                                                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    Updated {formatDate(doc.lastUpdated)}
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => openPdf(doc.fileUrl)}
                                                    className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 transition-colors font-medium"
                                                >
                                                    View
                                                </button>
                                                <button
                                                    onClick={() => downloadPdf(doc.fileUrl, `${doc.title}.pdf`)}
                                                    className="flex-1 border border-gray-300 text-gray-700 py-2 px-3 rounded text-sm hover:bg-gray-50 transition-colors font-medium"
                                                >
                                                    Download
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Publication;