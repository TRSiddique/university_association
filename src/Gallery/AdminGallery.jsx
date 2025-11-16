import { Link2, Trash2, Upload } from 'lucide-react';
import { useState } from 'react';

const AdminGallery = () => {
  const [activeTab, setActiveTab] = useState('photo');
  const [photoForm, setPhotoForm] = useState({
    title: '',
    description: '',
    date: '',
    image: null
  });
  const [videoForm, setVideoForm] = useState({
    title: '',
    description: '',
    youtubeUrl: '',
    date: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [imagePreview, setImagePreview] = useState(null);

  const API_URL = 'http://localhost:4000';

  // Handle photo form input
  const handlePhotoChange = (e) => {
    const { name, value } = e.target;
    setPhotoForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'File size must be less than 5MB' });
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        setMessage({ type: 'error', text: 'Only image files are allowed' });
        return;
      }

      setPhotoForm(prev => ({ ...prev, image: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle video form input
  const handleVideoChange = (e) => {
    const { name, value } = e.target;
    setVideoForm(prev => ({ ...prev, [name]: value }));
  };

  // Submit photo
  const handlePhotoSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const formData = new FormData();
      formData.append('title', photoForm.title);
      formData.append('description', photoForm.description);
      formData.append('date', photoForm.date || new Date().toISOString());
      formData.append('image', photoForm.image);

      const response = await fetch(`${API_URL}/photos`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to upload photo');
      }

      setMessage({ type: 'success', text: 'Photo uploaded successfully!' });
      setPhotoForm({ title: '', description: '', date: '', image: null });
      setImagePreview(null);
      
      // Reset file input
      const fileInput = document.getElementById('imageInput');
      if (fileInput) fileInput.value = '';
      
      // Refresh page after 2 seconds to show new photo
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  // Submit video
  const handleVideoSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const videoData = {
        title: videoForm.title,
        description: videoForm.description,
        youtubeUrl: videoForm.youtubeUrl,
        date: videoForm.date || new Date().toISOString()
      };

      const response = await fetch(`${API_URL}/videos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(videoData)
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to add video');
      }

      setMessage({ type: 'success', text: 'Video added successfully!' });
      setVideoForm({ title: '', description: '', youtubeUrl: '', date: '' });
      
      // Refresh page after 2 seconds to show new video
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">Gallery Admin</h1>
          <p className="text-lg text-gray-600">Upload photos and add video links</p>
        </div>

        {/* Message Display */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-100 text-green-700 border border-green-300' 
              : 'bg-red-100 text-red-700 border border-red-300'
          }`}>
            {message.text}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white rounded-lg shadow-md p-1">
            <button
              onClick={() => setActiveTab('photo')}
              className={`px-8 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'photo'
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-green-600'
              }`}
            >
              <Upload size={20} />
              Upload Photo
            </button>
            <button
              onClick={() => setActiveTab('video')}
              className={`px-8 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'video'
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-green-600'
              }`}
            >
              <Link2 size={20} />
              Add Video Link
            </button>
          </div>
        </div>

        {/* Photo Upload Form */}
        {activeTab === 'photo' && (
          <div className="bg-white rounded-lg shadow-xl p-8">
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Event Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={photoForm.title}
                  onChange={handlePhotoChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., Annual Cultural Program 2024"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={photoForm.description}
                  onChange={handlePhotoChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Brief description of the event"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Event Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={photoForm.date}
                  onChange={handlePhotoChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Upload Image *
                </label>
                <input
                  id="imageInput"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Accepted formats: JPG, PNG, GIF, WEBP (Max 5MB)
                </p>
              </div>

              {/* Image Preview */}
              {imagePreview && (
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Preview
                  </label>
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full max-w-md h-64 object-cover rounded-lg shadow-md"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setPhotoForm(prev => ({ ...prev, image: null }));
                        const fileInput = document.getElementById('imageInput');
                        if (fileInput) fileInput.value = '';
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handlePhotoSubmit}
                disabled={loading || !photoForm.title || !photoForm.image}
                className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={20} />
                    Upload Photo
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Video Link Form */}
        {activeTab === 'video' && (
          <div className="bg-white rounded-lg shadow-xl p-8">
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Video Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={videoForm.title}
                  onChange={handleVideoChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., Cultural Night Highlights"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={videoForm.description}
                  onChange={handleVideoChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Brief description of the video"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  YouTube URL *
                </label>
                <input
                  type="url"
                  name="youtubeUrl"
                  value={videoForm.youtubeUrl}
                  onChange={handleVideoChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                <p className="text-sm text-gray-500 mt-2">
                  Paste the full YouTube video URL
                </p>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Upload Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={videoForm.date}
                  onChange={handleVideoChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <button
                type="button"
                onClick={handleVideoSubmit}
                disabled={loading || !videoForm.title || !videoForm.youtubeUrl}
                className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <Link2 size={20} />
                    Add Video Link
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminGallery;