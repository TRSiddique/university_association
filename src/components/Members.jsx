import React from 'react';
import { useLoaderData, useNavigate } from "react-router-dom";
import MembersCard from './MembersCard';
import { FaPlus } from 'react-icons/fa';
import { useState } from 'react';

const Members = () => {
  const loadedMembers = useLoaderData();
  const navigate = useNavigate();
  const [members, setMembers]= useState(loadedMembers)

  return (
    <div className="p-4 lg:p-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
        All Members List ({members.length})
      </h1>

      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
        {members.map(member => (
          <MembersCard
            key={member._id}
            members={members}
            setMembers={setMembers}
            member={member}
          />
        ))}
      </div>

      {/* Join Button */}
      <div className="flex justify-center mt-8">
       <button
        onClick={() => navigate("/addMember")}
        className="hidden lg:flex fixed bottom-6 right-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-full font-semibold shadow-xl hover:from-indigo-500 hover:to-blue-500 hover:scale-110 transition-all z-50"
      >
        Join As a Member
      </button>
       <button
        onClick={() => navigate("/addMember")}
        className="flex lg:hidden fixed bottom-6 right-6 bg-blue-500 text-white p-4 rounded-full shadow-xl hover:bg-blue-600 hover:scale-110 transition-all z-50"
        title="Join As a Member"
      >
        <FaPlus size={20} />
      </button>
      </div>
    </div>
  );
};

export default Members;
