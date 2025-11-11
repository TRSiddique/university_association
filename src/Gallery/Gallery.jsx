import React, { useState } from 'react';
import { X, Play } from 'lucide-react';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeTab, setActiveTab] = useState('photos');

  // Sample data - replace with your actual image links and video IDs
  const photos = [
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
      title: 'Annual Cultural Program 2024',
      date: 'March 15, 2024'
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800',
      title: 'Sports Day Tournament',
      date: 'February 20, 2024'
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=800',
      title: 'Freshers Welcome',
      date: 'January 10, 2024'
    },
    {
      id: 4,
      url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800',
      title: 'Study Workshop',
      date: 'December 5, 2023'
    },
    {
      id: 5,
      url: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800',
      title: 'Community Service',
      date: 'November 18, 2023'
    },
    {
      id: 6,
      url: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800',
      title: 'Independence Day Celebration',
      date: 'March 26, 2024'
    }
  ];

  // YouTube video IDs - replace with your actual video IDs
  const videos = [
    {
      id: 1,
      videoId: 'fjOeJssZX_Q',
      title: 'CUSAP Annual Program Highlights 2024',
      date: 'March 20, 2024'
    },
    {
      id: 2,
      videoId: 'jNQXAC9IVRw',
      title: 'Sports Day Full Coverage',
      date: 'February 25, 2024'
    },
    {
      id: 3,
      videoId: '3JZ_D3ELwOQ',
      title: 'Freshers Welcome Ceremony',
      date: 'January 15, 2024'
    },
    {
      id: 4,
      videoId: 'kJQP7kiw5Fk',
      title: 'Cultural Night Performance',
      date: 'December 10, 2023'
    }
  ];

  const openImage = (photo) => {
    setSelectedImage(photo);
  };

  const closeImage = () => {
    setSelectedImage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">Gallery</h1>
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
              Photos
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'videos'
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-green-600'
              }`}
            >
              Videos
            </button>
          </div>
        </div>

        {/* Photo Gallery */}
        {activeTab === 'photos' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="group relative overflow-hidden rounded-lg shadow-lg cursor-pointer transform transition-all hover:scale-105 hover:shadow-2xl"
                onClick={() => openImage(photo)}
              >
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-64 object-cover transition-transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="font-bold text-lg mb-1">{photo.title}</h3>
                    <p className="text-sm text-gray-200">{photo.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Video Gallery */}
        {activeTab === 'videos' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {videos.map((video) => (
              <div
                key={video.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all hover:scale-105 hover:shadow-2xl"
              >
                <div className="relative pb-[56.25%] h-0">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${video.videoId}`}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-800 mb-2">
                    {video.title}
                  </h3>
                  <p className="text-sm text-gray-600">{video.date}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Image Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={closeImage}
          >
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
              onClick={closeImage}
            >
              <X size={32} />
            </button>
            <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
              <img
                src={selectedImage.url}
                alt={selectedImage.title}
                className="w-full h-auto rounded-lg shadow-2xl"
              />
              <div className="text-white text-center mt-4">
                <h3 className="text-2xl font-bold mb-2">{selectedImage.title}</h3>
                <p className="text-gray-300">{selectedImage.date}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;