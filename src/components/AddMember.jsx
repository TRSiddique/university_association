import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const AddMember = () => {
  const navigate = useNavigate();
  const [photoFile, setPhotoFile] = useState(null);
  const [uploading, setUploading] = useState(false);

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
    }
  };

  const uploadImageToImgBB = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('https://api.imgbb.com/1/upload?key=32006f2a50e2265ea475805d6b074bf3', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (data.success) {
        return data.data.url; // Return the image URL
      } else {
        throw new Error('Image upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleAddMember = async (e) => {
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
      let photoUrl = '';

      // Upload image if a file is selected
      if (photoFile) {
        photoUrl = await uploadImageToImgBB(photoFile);
      }

      const newMember = {
        name,
        session,
        department,
        blood,
        mobile,
        union,
        studentId,
        photo: photoUrl,
      };

      console.log(newMember);

      const response = await fetch("https://university-association-backend-1.onrender.com/member", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(newMember),
      });

      const data = await response.json();

      if (data.insertedId) {
        Swal.fire({
          title: 'সফল!',
          text: 'মেম্বার সফলভাবে অ্যাড করা হয়েছে।',
          icon: 'success',
          confirmButtonText: 'ঠিক আছে',
        }).then(() => {
          form.reset();
          setPhotoFile(null);
          navigate('/members');
        });
      } else {
        throw new Error('Failed to add member');
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

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900 px-3 py-8">
      <form
        onSubmit={handleAddMember}
        className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 w-full max-w-4xl border border-gray-200 dark:border-gray-700"
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-green-600 dark:text-green-400">
          আপনি পেকুয়ার চবিয়ান হয়ে থাকলে এখনই যোগ দিন CUSAP এ!
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
              placeholder="আপনার নাম লিখুন"
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
              placeholder="ex: 2022-23, 2023-24"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-gray-700 dark:text-gray-300">ডিপার্টমেন্ট/বিভাগ</span>
            </label>
            <input
              type="text"
              name="department"
              className="input input-bordered w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="আপনার ডিপার্টমেন্ট লিখুন"
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
              placeholder="Ex: 018000000000"
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
              required
            >
              <option value="">ইউনিয়ন সিলেক্ট করুন</option>
              <option value="Toitong">Toitong</option>
              <option value="Pekua">Pekua</option>
              <option value="Shilkali">Shilkhali</option>
              <option value="Mognama">Mognama</option>
              <option value="Barobakia">Barobakia</option>
              <option value="Rajakhali">Rajakhali</option>
              <option value="Ujantia">Ujantia</option>
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
              placeholder="Ex: 20401033"
              required
            />
          </div>

          {/* Photo Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-gray-700 dark:text-gray-300">ছবি</span>
            </label>
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
            {photoFile && (
              <div className="mt-2">
                <p className="text-sm text-green-600 dark:text-green-400">Selected: {photoFile.name}</p>
                <div className="mt-1">
                  <img 
                    src={URL.createObjectURL(photoFile)} 
                    alt="Preview" 
                    className="h-20 w-20 object-cover rounded border"
                  />
                </div>
              </div>
            )}
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
                মেম্বার অ্যাড হচ্ছে...
              </div>
            ) : (
              'মেম্বার অ্যাড করুন'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMember;