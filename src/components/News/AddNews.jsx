import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddNews = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        headline: '',
        shortDescription: '',
        fullDescription: '',
        image: ''
    });
    const [imagePreview, setImagePreview] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [selectedFile, setSelectedFile] = useState(null);

    // ImageBB API Key
    const IMGBB_API_KEY = '32006f2a50e2265ea475805d6b074bf3';

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            if (!validTypes.includes(file.type)) {
                setErrors(prev => ({
                    ...prev,
                    image: 'Please select a valid image file (JPEG, PNG, GIF)'
                }));
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setErrors(prev => ({
                    ...prev,
                    image: 'Image size should be less than 5MB'
                }));
                return;
            }

            // Create preview
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
            setSelectedFile(file);

            // Clear image error
            if (errors.image) {
                setErrors(prev => ({
                    ...prev,
                    image: ''
                }));
            }
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.headline.trim()) {
            newErrors.headline = 'Headline is required';
        } else if (formData.headline.length < 10) {
            newErrors.headline = 'Headline should be at least 10 characters long';
        }

        if (!formData.shortDescription.trim()) {
            newErrors.shortDescription = 'Short description is required';
        } else if (formData.shortDescription.length < 20) {
            newErrors.shortDescription = 'Short description should be at least 20 characters long';
        }

        if (!formData.fullDescription.trim()) {
            newErrors.fullDescription = 'Full description is required';
        } else if (formData.fullDescription.length < 50) {
            newErrors.fullDescription = 'Full description should be at least 50 characters long';
        }

        if (!selectedFile) {
            newErrors.image = 'Please select an image';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            let imageUrl = '';

            // Step 1: Upload image to ImageBB if selected
            if (selectedFile) {
                const imageBBFormData = new FormData();
                imageBBFormData.append('image', selectedFile);

                console.log('Uploading to ImageBB...');

                const imageBBResponse = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
                    method: 'POST',
                    body: imageBBFormData,
                });

                const imageBBResult = await imageBBResponse.json();
                
                console.log('ImageBB Response:', imageBBResult);

                if (!imageBBResponse.ok || !imageBBResult.success) {
                    throw new Error(imageBBResult.error?.message || 'Image upload to ImageBB failed');
                }

                // Get the URL from ImageBB response
                imageUrl = imageBBResult.data.url;
                console.log('Image uploaded to ImageBB:', imageUrl);
            }

            // Step 2: Prepare and save news data with ImageBB URL
            const newsData = {
                headline: formData.headline,
                shortDescription: formData.shortDescription,
                fullDescription: formData.fullDescription,
                image: imageUrl
            };

            console.log('Saving news with ImageBB URL:', newsData);

            // Step 3: Save news to your backend (fixed double slash)
            const response = await fetch('https://university-association-backend-1.onrender.com/news', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newsData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to save news');
            }

            if (result.success) {
                alert('News added successfully with ImageBB hosting!');
                navigate('/news');
            } else {
                throw new Error(result.message || 'Failed to save news');
            }

        } catch (error) {
            console.error('Error saving news:', error);
            alert('Error saving news. Please try again. ' + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        // Clean up the object URL to prevent memory leaks
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }
        
        if (window.confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
            navigate('/news');
        }
    };

    // Clean up object URL when component unmounts
    useState(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Add New News</h1>
                    <p className="text-gray-600">Create and publish new news articles for CUSAP</p>
                </div>

                <div className="max-w-4xl mx-auto">
                    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
                        {/* Headline */}
                        <div className="mb-6">
                            <label htmlFor="headline" className="block text-sm font-medium text-gray-700 mb-2">
                                Headline *
                            </label>
                            <input
                                type="text"
                                id="headline"
                                name="headline"
                                value={formData.headline}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.headline ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter news headline"
                            />
                            {errors.headline && (
                                <p className="text-red-500 text-sm mt-1">{errors.headline}</p>
                            )}
                        </div>

                        {/* Short Description */}
                        <div className="mb-6">
                            <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700 mb-2">
                                Short Description *
                            </label>
                            <textarea
                                id="shortDescription"
                                name="shortDescription"
                                value={formData.shortDescription}
                                onChange={handleInputChange}
                                rows="3"
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.shortDescription ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Brief description that will appear in news listings"
                            />
                            {errors.shortDescription && (
                                <p className="text-red-500 text-sm mt-1">{errors.shortDescription}</p>
                            )}
                        </div>

                        {/* Full Description */}
                        <div className="mb-6">
                            <label htmlFor="fullDescription" className="block text-sm font-medium text-gray-700 mb-2">
                                Full Description *
                            </label>
                            <textarea
                                id="fullDescription"
                                name="fullDescription"
                                value={formData.fullDescription}
                                onChange={handleInputChange}
                                rows="8"
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.fullDescription ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Complete news content with details"
                            />
                            {errors.fullDescription && (
                                <p className="text-red-500 text-sm mt-1">{errors.fullDescription}</p>
                            )}
                        </div>

                        {/* Image Upload */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                News Image *
                            </label>
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex-1">
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                            id="imageUpload"
                                        />
                                        <label
                                            htmlFor="imageUpload"
                                            className="cursor-pointer block"
                                        >
                                            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span className="text-blue-600 font-medium">Click to upload image</span>
                                            <p className="text-sm text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                                            {/* <p className="text-xs text-green-600 mt-1">Images will be hosted on ImageBB</p> */}
                                        </label>
                                    </div>
                                    {errors.image && (
                                        <p className="text-red-500 text-sm mt-1">{errors.image}</p>
                                    )}
                                </div>
                                
                                {/* Image Preview */}
                                {imagePreview && (
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                                        <div className="border rounded-lg p-2">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="w-full h-48 object-cover rounded"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Publishing...
                                    </>
                                ) : (
                                    'Publish News'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddNews;