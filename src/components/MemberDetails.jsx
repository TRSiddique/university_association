import React from 'react';
import { useLoaderData, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Phone, 
  Calendar, 
  GraduationCap, 
  MapPin, 
  IdCard, 
  Droplet, 
  User,
  Mail,
  Share2
} from 'lucide-react';
const MemberDetails = () => {
  const member = useLoaderData(); 
  const { name,
    session,
    department,
    blood,
    mobile,
    union,
    studentId,
    photo, } = member;
const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${name} - CHUSAP Member`,
          text: `Check out ${name}'s profile from CHUSAP`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Profile link copied to clipboard!');
    }
  };
  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md text-black">
      <h1 className="text-2xl font-bold mb-4">Details of {name} </h1>

      <img
        src={photo}
        alt={name}
        className="w-full h-64 object-cover rounded-lg mb-4"
      />
    
      <p className="mb-1"><strong>নাম:</strong> {name}</p> 
      <p className="mb-1"><strong>সেশন:</strong> {session}</p>
      <p className="mb-1"><strong>ডিপার্টমেন্ট:</strong> {department}</p>
       <p className="mb-1"><strong>মোবাইল:</strong> {mobile}</p> 
      <p className="mb-1"><strong>ইউনিয়ন:</strong> {union}</p>
      <p className="mb-1"><strong>স্টুডেন্ট আইডি:</strong> {studentId}</p>
      <p className="mb-1 font-medium text-red-500"><strong>রক্তের গ্রুপ:</strong> {blood || "N/A"}</p>

      <div className="flex flex-row justify-between">
        <Link
        to="/members"
        className="inline-block mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Back to Members
      </Link>
      <button
                onClick={handleShare}
                className="inline-block flex flex-row justify-center mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                <Share2 size={20} />
              
              </button>
      </div>
    </div>
  );
};

export default MemberDetails;