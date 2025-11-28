import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeTab, setActiveTab] = useState('photos');
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const API_URL = 'university-association-backend-1.onrender.com'; // Your backend URL

  // Fetch photos from backend
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch(`${API_URL}/photos`);
        if (!response.ok) throw new Error('Failed to fetch photos');
        const data = await response.json();
        setPhotos(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching photos:', err);
      }
    };

    const fetchVideos = async () => {
      try {
        const response = await fetch(`${API_URL}/videos`);
        if (!response.ok) throw new Error('Failed to fetch videos');
        const data = await response.json();
        setVideos(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching videos:', err);
      }
    };

    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchPhotos(), fetchVideos()]);
      setLoading(false);
    };

    fetchData();
  }, []);

  // Extract YouTube video ID from various URL formats
  const extractYouTubeId = (url) => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return url;
  };

  const openImage = (photo) => {
    setSelectedImage(photo);
  };

  const closeImage = () => {
    setSelectedImage(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading gallery...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-600">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">চুসাপ স্মৃতিগাথা</h1>
          <p className="text-lg text-gray-600">Memories from CUSAP Events</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-white rounded-lg shadow-md p-1">
            <button
              onClick={() => setActiveTab('photos')}
              className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'photos'
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-green-600'
              }`}
            >
              Photos ({photos.length})
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'videos'
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-green-600'
              }`}
            >
              Videos ({videos.length})
            </button>
          </div>
        </div>

        {/* Photo Gallery */}
        {activeTab === 'photos' && (
          <div>
            {photos.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-xl text-gray-600">No photos available yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {photos.map((photo) => (
                  <div
                    key={photo._id}
                    className="group relative overflow-hidden rounded-lg shadow-lg cursor-pointer transform transition-all hover:scale-105 hover:shadow-2xl"
                    onClick={() => openImage(photo)}
                  >
                    <img
  src={photo.url} // This will be ImageBB URL like: https://i.ibb.co/abc123/image.jpg
  alt={photo.title || 'CUSAP Event'}
  className="w-full h-64 object-cover transition-transform group-hover:scale-110"
/>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <h3 className="font-bold text-lg mb-1">
                          {photo.title || 'Untitled Event'}
                        </h3>
                        {photo.date && (
                          <p className="text-sm text-gray-200">
                            {new Date(photo.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
           
{/* Join With Us Button after About Section */}
<div className="text-center py-8 bg-white">
  <button
    onClick={() => navigate('/addGallery')}
    className="bg-blue-500 text-white px-8 py-3 rounded-full shadow-xl hover:bg-blue-600 hover:scale-110 transition-all font-medium"
  >
    Add Photo/Video
  </button>
</div>
          </div>
        )}

        {/* Video Gallery */}
        {activeTab === 'videos' && (
          <div>
            {videos.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-xl text-gray-600">No videos available yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {videos.map((video) => {
                  const videoId = extractYouTubeId(video.youtubeUrl);
                  return (
                    <div
                      key={video._id}
                      className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all hover:scale-105 hover:shadow-2xl"
                    >
                      <div className="relative pb-[56.25%] h-0">
                        <iframe
                          className="absolute top-0 left-0 w-full h-full"
                          src={`https://www.youtube.com/embed/${videoId}`}
                          title={video.title || 'CUSAP Video'}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-lg text-gray-800 mb-2">
                          {video.title || 'Untitled Video'}
                        </h3>
                        {video.date && (
                          <p className="text-sm text-gray-600">
                            {new Date(video.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        )}
                        {video.description && (
                          <p className="text-sm text-gray-600 mt-2">
                            {video.description}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {/* Join With Us Button after About Section */}
<div className="text-center py-8 bg-white">
  <button
    onClick={() => navigate('/addGallery')}
    className="bg-blue-500 text-white px-8 py-3 rounded-full shadow-xl hover:bg-blue-600 hover:scale-110 transition-all font-medium"
  >
    Add Photo/Video
  </button>
</div>
          </div>
        )}

        {/* Image Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={closeImage}
          >
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
              onClick={closeImage}
            >
              <X size={32} />
            </button>
            <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
              <img
                src={selectedImage.url}
                alt={selectedImage.title || 'CUSAP Event'}
                className="w-full h-auto rounded-lg shadow-2xl"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Found';
                }}
              />
              <div className="text-white text-center mt-4">
                <h3 className="text-2xl font-bold mb-2">
                  {selectedImage.title || 'Untitled Event'}
                </h3>
                {selectedImage.date && (
                  <p className="text-gray-300">
                    {new Date(selectedImage.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                )}
                {selectedImage.description && (
                  <p className="text-gray-300 mt-2">{selectedImage.description}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    
    </div>
  );
};

export default Gallery;