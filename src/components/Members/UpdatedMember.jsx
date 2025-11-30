import { useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const UpdatedMember = () => {
  const member = useLoaderData();
  const navigate = useNavigate();
  const [photoFile, setPhotoFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState(member.photo);

  const { _id, name, session, department, blood, mobile, union, studentId, photo } = member;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        Swal.fire({
          title: 'Invalid File!',
          text: 'Please select a valid image file (JPEG, PNG, GIF, WebP).',
          icon: 'error',
          confirmButtonText: 'OK',
        });
        e.target.value = ''; // Clear the input
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          title: 'File Too Large!',
          text: 'Please select an image smaller than 5MB.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
        e.target.value = ''; // Clear the input
        return;
      }

      setPhotoFile(file);
      // Show preview immediately
      setCurrentPhoto(URL.createObjectURL(file));
    }
  };

  const uploadImageToServer = async (file) => {
    const formData = new FormData();
    formData.append('photo', file);

    try {
      const response = await fetch('https://university-association-backend-1.onrender.com/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (data.success) {
        return data.imageUrl; // Return the image URL
      } else {
        throw new Error('Image upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleUpdateMember = async (e) => {
    e.preventDefault();
    setUploading(true);

    const form = e.target;
    const name = form.name.value;
    const session = form.session.value;
    const department = form.department.value;
    const blood = form.blood.value;
    const mobile = form.mobile.value;
    const union = form.union.value;
    const studentId = form.studentId.value;

    try {
      let photoUrl = currentPhoto;

      // Upload new image if a file is selected
      if (photoFile) {
        photoUrl = await uploadImageToServer(photoFile);
      }

      const updatedMember = {
        name,
        session,
        department,
        blood,
        mobile,
        union,
        studentId,
        photo: photoUrl,
      };

      console.log('Updated member data:', updatedMember);

      const response = await fetch(`https://university-association-backend-1.onrender.com/member/${_id}`, {
        method: 'PUT',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(updatedMember),
      });

      const data = await response.json();
      console.log(data);

      if (data.modifiedCount > 0 || data.upsertedCount > 0) {
        Swal.fire({
          title: 'সফল!',
          text: 'মেম্বার ইনফরমেশন সফলভাবে আপডেট করা হয়েছে।',
          icon: 'success',
        }).then(() => {
          navigate('/members'); // redirect to member list page
        });
      } else {
        Swal.fire({
          title: 'কোনো পরিবর্তন নেই!',
          text: 'মেম্বার ইনফরমেশনে কোনো পরিবর্তন করা হয়নি।',
          icon: 'info',
        });
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        title: 'ত্রুটি!',
        text: 'কিছু একটা সমস্যা হয়েছে, আবার চেষ্টা করুন।',
        icon: 'error',
        confirmButtonText: 'ঠিক আছে',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setCurrentPhoto('');
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900 px-3 py-8">
      <form
        onSubmit={handleUpdateMember}
        className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 w-full max-w-4xl border border-gray-200 dark:border-gray-700"
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-green-600 dark:text-green-400">
          আপনার তথ্য আপডেট করুন 
        </h2>

        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-gray-700 dark:text-gray-300">নাম</span>
            </label>
            <input
              type="text"
              name="name"
              className="input input-bordered w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              defaultValue={name}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-gray-700 dark:text-gray-300">সেশন</span>
            </label>
            <input
              type="text"
              name="session"
              className="input input-bordered w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              defaultValue={session}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-gray-700 dark:text-gray-300">ডিপার্টমেন্ট</span>
            </label>
            <input
              type="text"
              name="department"
              className="input input-bordered w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              defaultValue={department}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-gray-700 dark:text-gray-300">রক্তের গ্রুপ</span>
            </label>
            <select
              name="blood"
              className="select select-bordered w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              defaultValue={blood}
              required
            >
              <option value="">রক্তের গ্রুপ সিলেক্ট করুন</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-gray-700 dark:text-gray-300">মোবাইল নম্বর</span>
            </label>
            <input
              type="text"
              name="mobile"
              className="input input-bordered w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              defaultValue={mobile}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-gray-700 dark:text-gray-300">ইউনিয়ন</span>
            </label>
            <select
              name="union"
              className="select select-bordered w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              defaultValue={union}
              required
            >
             <option value="">ইউনিয়ন সিলেক্ট করুন</option>
              <option value="টইটং">টইটং</option> 
              <option value="পেকুয়া">পেকুয়া</option>
              <option value="শীলখালী">শীলখালী</option>
              <option value="মগনামা">মগনামা</option>
              <option value="বারবাকিয়া">বারবাকিয়া</option>
              <option value="রাজাখালী">রাজাখালী</option>
              <option value="উজানটিয়া">উজানটিয়া</option> 
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-gray-700 dark:text-gray-300">স্টুডেন্ট আইডি</span>
            </label>
            <input
              type="text"
              name="studentId"
              className="input input-bordered w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              defaultValue={studentId}
              required
            />
          </div>

          {/* Photo Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-gray-700 dark:text-gray-300">ছবি</span>
            </label>
            
            {/* Current Photo Preview */}
            {currentPhoto && (
              <div className="mb-3">
                <p className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">বর্তমান ছবি:</p>
                <div className="relative inline-block">
                  <img 
                    src={currentPhoto} 
                    alt="Current" 
                    className="h-24 w-24 object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="absolute -top-2 -right-2 btn btn-xs btn-circle btn-error"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            {/* File Input */}
            <input
              type="file"
              name="photo"
              accept="image/*"
              onChange={handleFileChange}
              className="file-input file-input-bordered w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Supported formats: JPEG, PNG, GIF, WebP (Max 5MB)
            </div>
          </div>
        </div>

        {/* Submit Button with Enhanced Loading State */}
        <div className="mt-6 text-center">
          <button
            type="submit"
            disabled={uploading}
            className={`btn w-full md:w-1/2 text-white ${
              uploading 
                ? 'bg-gray-400 border-gray-400 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700 border-green-600'
            }`}
          >
            {uploading ? (
              <div className="flex items-center justify-center gap-2">
                <span className="loading loading-spinner loading-sm"></span>
                আপডেট হচ্ছে...
              </div>
            ) : (
              'মেম্বার আপডেট করুন'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdatedMember;