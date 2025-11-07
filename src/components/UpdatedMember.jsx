import React from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';


const UpdatedMember = () => {
  const member = useLoaderData();
  const navigate = useNavigate();

   
  const { _id, name,
    session,
    department,
    blood,
    mobile,
    union,
    studentId,
    photo, } = member;

    
const handleUpdateMember=(e)=>{
        e.preventDefault();
    const form = e.target;

    const name = form.name.value;
    const session = form.session.value;
    const department = form.department.value;
    const blood = form.blood.value;
    const mobile = form.mobile.value;
    const union = form.union.value;
    const studentId = form.studentId.value;
    const photo = form.photo.value;

    
  const updatedMember = {
    name,
    session,
    department,
    blood,
    mobile,
    union,
    studentId,
    photo,
  };
  
  console.log(updatedMember);
   fetch(`http://localhost:4000/member/${_id}`, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(updatedMember),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.modifiedCount > 0) {
          Swal.fire({
            title: 'Updated!',
            text: 'Member information updated successfully.',
            icon: 'success',
          });
          navigate('/members'); // redirect to member list page
        }
      });
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
            />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">ছবি</legend>
            <input
              type="text"
              name="photo"
              className="input input-bordered w-full"
              placeholder="ছবির লিংক (Image URL)"
              defaultValue={photo}
            />
          </fieldset>
        </div>

        {/* Submit Button */}
        <div className="mt-6 text-center">
          <input
            type="submit"
            value="Update Member"
            className="btn btn-success w-full md:w-1/2"
          />
        </div>
      </form>
    </div>
    );
};

export default UpdatedMember;