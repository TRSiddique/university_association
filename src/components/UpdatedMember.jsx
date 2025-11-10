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
      const response = await fetch('https://university-association-backend-1.onrender.com//upload', {
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

      const response = await fetch(`https://university-association-backend-1.onrender.com//member/${_id}`, {
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
          title: 'Updated!',
          text: 'Member information updated successfully.',
          icon: 'success',
        }).then(() => {
          navigate('/members'); // redirect to member list page
        });
      } else {
        Swal.fire({
          title: 'No Changes!',
          text: 'No changes were made to the member information.',
          icon: 'info',
        });
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Something went wrong. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
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
    <div className="flex justify-center items-center min-h-screen bg-base-200 px-3">
      <form
        onSubmit={handleUpdateMember}
        className="bg-base-100 shadow-xl rounded-2xl p-6 w-full max-w-4xl"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-success">
          Update Your Information
        </h2> 

        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <fieldset className="fieldset">
            <legend className="fieldset-legend">নাম</legend>
            <input
              type="text"
              name="name"
              className="input input-bordered w-full"
              placeholder="নাম লিখুন"
              defaultValue={name}
              required
            />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">সেশন</legend>
            <input
              type="text"
              name="session"
              className="input input-bordered w-full"
              placeholder="সেশন লিখুন (যেমন: ২০১৯-২০)"
              defaultValue={session}
              required
            />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">ডিপার্টমেন্ট</legend>
            <input
              type="text"
              name="department"
              className="input input-bordered w-full"
              placeholder="ডিপার্টমেন্টের নাম লিখুন"
              defaultValue={department}
              required
            />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">রক্তের গ্রুপ</legend>
            <input
              type="text"
              name="blood"
              className="input input-bordered w-full"
              placeholder="যেমন: A+, O-, B+"
              defaultValue={blood}
            />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">মোবাইল</legend>
            <input
              type="text"
              name="mobile"
              className="input input-bordered w-full"
              placeholder="মোবাইল নাম্বার লিখুন"
              defaultValue={mobile}
              required
            />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">ইউনিয়ন</legend>
            <input
              type="text"
              name="union"
              className="input input-bordered w-full"
              placeholder="ইউনিয়নের নাম লিখুন"
              defaultValue={union}
            />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">স্টুডেন্ট আইডি</legend>
            <input
              type="text"
              name="studentId"
              className="input input-bordered w-full"
              placeholder="স্টুডেন্ট আইডি লিখুন"
              defaultValue={studentId}
              required
            />
          </fieldset>

          {/* Updated Photo Field - File Input */}
          <fieldset className="fieldset">
            <legend className="fieldset-legend">ছবি</legend>
            
            {/* Current Photo Preview */}
            {currentPhoto && (
              <div className="mb-3">
                <p className="text-sm font-medium mb-2">Current Photo:</p>
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
              className="file-input file-input-bordered w-full"
            />
            <div className="text-xs text-gray-500 mt-1">
              Supported formats: JPEG, PNG, GIF, WebP (Max 5MB)
            </div>

            {/* New Photo Preview */}
            {/* {photoFile && (
              <div className="mt-2">
                <p className="text-sm text-success font-medium">New Photo Preview:</p>
                <div className="mt-1">
                  <img 
                    src={URL.createObjectURL(photoFile)} 
                    alt="Preview" 
                    className="h-20 w-20 object-cover rounded border"
                  />
                </div>
              </div>
            )} */}
          </fieldset>
        </div>

        {/* Submit Button */}
        <div className="mt-6 text-center">
          <button
            type="submit"
            disabled={uploading}
            className={`btn btn-success w-full md:w-1/2 ${uploading ? 'loading' : ''}`}
          >
            {uploading ? 'Updating...' : 'Update Member'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdatedMember;