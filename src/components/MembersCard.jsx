import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const MembersCard = ({ member, members, setMembers }) => {
  const { _id, name, session, department, blood, photo } = member;

  const handleDelete = (_id) => {
    console.log(_id);
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to delete this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("delete confirm");
        fetch(`https://university-association-backend-1.onrender.com/member/${_id}`, {
          method: "DELETE",
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            if (data.deletedCount > 0) {
              Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success",
              });
              const remaining = members.filter((mem) => mem._id !== _id);
              setMembers(remaining);
            }
          });
      }
    });
  };

  return (
    <div className="p-0">
      <div className="border-s-gray-500 rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-200 overflow-hidden">
        {/* Layout: vertical on small, horizontal on lg */}
        <div className="flex flex-col h-100 lg:flex-row lg:h-64">
          {/* Image */}
          <figure className="w-full lg:w-1/2 h-40 lg:h-full overflow-hidden border-b lg:border-b-0 lg:border-r border-gray-200 rounded-t-xl lg:rounded-tl-xl lg:rounded-bl-xl">
            <img
              src={photo || "https://via.placeholder.com/150"}
              alt={name}
              className="p-2 rounded-xl lg:rounded-2xl w-full h-full object-cover"
            />
          </figure>

          {/* Info */}
          <div className="p-4 flex-1 flex flex-col justify-between">
            <div className="flex flex-col ">
              <h3 className="text-lg text-black font-bold mb-1">{name}</h3>
              <p className="text-sm font-bold text-gray-600 mb-1">
                Session: {session}
              </p>
              <p className="text-sm font-bold text-gray-600 mb-1">
                Department: {department}
              </p>
              <p className="text-sm font-bold text-red-500">
                Blood Group: {blood || "N/A"}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end items-center space-x-4 mt-4 lg:mt-0">
              <button
                onClick={() => handleDelete(_id)}
                className="bg-red-100 text-red-600 p-2 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-md"
                title="Delete Member"
              >
                <FaTrash size={18} />
              </button>

              <Link
                to={`/updateMember/${_id}`}
                className="bg-blue-100 text-blue-600 p-2 rounded-full hover:bg-blue-500 hover:text-white transition-all shadow-md"
                title="Edit Member"
              >
                <FaEdit size={18} />
              </Link>

              <Link
                to={`/members/${_id}`}
                className="bg-green-100 text-green-600 p-2 rounded-full hover:bg-green-500 hover:text-white transition-all shadow-md"
                title="View Details"
              >
                <FaEye size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembersCard;
