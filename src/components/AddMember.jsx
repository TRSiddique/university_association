import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

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

      const response = await fetch("http://localhost:4000/member", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(newMember),
      });

      const data = await response.json();

      if (data.insertedId) {
        Swal.fire({
          title: 'Success!',
          text: 'Member has been added successfully.',
          icon: 'success',
          confirmButtonText: 'OK',
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
        title: 'Error!',
        text: 'Something went wrong. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200 px-3">
      <form
        onSubmit={handleAddMember}
        className="bg-base-100 shadow-xl rounded-2xl p-6 w-full max-w-4xl"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-success">
          Join as a New Member
        </h2>

        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Name</legend>
            <input
              type="text"
              name="name"
              className="input input-bordered w-full"
              placeholder="Enter your Name"
              required
            />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Session</legend>
            <input
              type="text"
              name="session"
              className="input input-bordered w-full"
              placeholder="ex: 2022-23, 2023-24"
              required
            />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Department</legend>
            <input
              type="text"
              name="department"
              className="input input-bordered w-full"
              placeholder="Enter Department Name"
              required
            />
          </fieldset>
<fieldset className="fieldset">
  <legend className="fieldset-legend">Blood Group</legend>
  <select
    name="blood"
    className="select select-bordered w-full"
  >
    <option value="">Select Blood Group</option>
    <option value="A+">A+</option>
    <option value="A-">A-</option>
    <option value="B+">B+</option>
    <option value="B-">B-</option>
    <option value="AB+">AB+</option>
    <option value="AB-">AB-</option>
    <option value="O+">O+</option>
    <option value="O-">O-</option>
  </select>
</fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Mobile Number</legend>
            <input
              type="text"
              name="mobile"
              className="input input-bordered w-full"
              placeholder="Ex: 018000000000"
              required
            />
          </fieldset>

         <fieldset className="fieldset">
  <legend className="fieldset-legend">Union</legend>
  <select
    name="union"
    className="select select-bordered w-full"
  >
    <option value="">Select Your Union</option>
    <option value="Toitong">Toitong</option>
    <option value="Pekua">Pekua</option>
    <option value="Shilkali">Shilkhali</option>
    <option value="Mognama">Mognama</option>
    <option value="Barobakia">Barobakia</option>
    <option value="Rajakhali">Rajakhali</option>
    <option value="Ujantia">Ujantia</option>
  </select>
</fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">University Student ID</legend>
            <input
              type="text"
              name="studentId"
              className="input input-bordered w-full"
              placeholder="Ex: 20401033"
              required
            />
          </fieldset>

          {/* Updated Photo Field - File Input */}
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Photo</legend>
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
            {photoFile && (
              <div className="mt-2">
                <p className="text-sm text-success">Selected: {photoFile.name}</p>
                <div className="mt-1">
                  <img 
                    src={URL.createObjectURL(photoFile)} 
                    alt="Preview" 
                    className="h-20 w-20 object-cover rounded border"
                  />
                </div>
              </div>
            )}
          </fieldset>
        </div>

        {/* Submit Button */}
        <div className="mt-6 text-center">
          <button
            type="submit"
            disabled={uploading}
            className={`btn btn-success w-full md:w-1/2 ${uploading ? 'loading' : ''}`}
          >
            {uploading ? 'Uploading...' : 'Add Member'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMember;