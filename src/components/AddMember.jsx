import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const AddMember = () => {
  const navigate = useNavigate();
  const handleAddMember = (e) => {
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

    
  const newMember = {
    name,
    session,
    department,
    blood,
    mobile,
    union,
    studentId,
    photo,
  };

    console.log(newMember);

    fetch("http://localhost:4000/member", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(newMember),
    })
      .then(res => res.json())
      .then(data => {
        if (data.insertedId) {
          Swal.fire({
            title: 'Success!',
            text: 'Member has been added successfully.',
            icon: 'success',
            confirmButtonText: 'OK',
          }).then(() => {
            form.reset();           // optional: clear the form
            navigate('/members');   // automatically navigate to member list
          }); // optional: reset form after adding
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'Something went wrong. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }})
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
            <input
              type="text"
              name="blood"
              className="input input-bordered w-full"
              placeholder="Ex: A+, O+"
            />
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
            <input
              type="text"
              name="union"
              className="input input-bordered w-full"
              placeholder="Enter Your Union Name"
            />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">UNiversity Student ID</legend>
            <input
              type="text"
              name="studentId"
              className="input input-bordered w-full"
              placeholder="Ex: 20401033"
              required
            />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Photo</legend>
            <input
              type="text"
              name="photo"
              className="input input-bordered w-full"
              placeholder="Image URL"
            />
          </fieldset>
        </div>

        {/* Submit Button */}
        <div className="mt-6 text-center">
          <input
            type="submit"
            value="Add Member"
            className="btn btn-success w-full md:w-1/2"
          />
        </div>
      </form>
    </div>
  );
};

export default AddMember;
