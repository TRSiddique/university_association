// src/components/Members.jsx
import { Calendar, ChevronDown, Droplet, Edit, Filter, GraduationCap, MapPin, Search, Trash2, User, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { FaPlus } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useAuth } from '../../context/AuthContext';

export default function Members() {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('All');
  const [filterBloodGroup, setFilterBloodGroup] = useState('All');
  const [filterSession, setFilterSession] = useState('All');
  const [filterUnion, setFilterUnion] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    filterMembers();
  }, [searchTerm, filterDepartment, filterBloodGroup, filterSession, filterUnion, members]);

  useEffect(() => {
    let count = 0;
    if (searchTerm) count++;
    if (filterDepartment !== 'All') count++;
    if (filterBloodGroup !== 'All') count++;
    if (filterSession !== 'All') count++;
    if (filterUnion !== 'All') count++;
    setActiveFiltersCount(count);
  }, [searchTerm, filterDepartment, filterBloodGroup, filterSession, filterUnion]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      console.log('Fetching from: http://localhost:4000/member');

      const response = await fetch('http://localhost:4000/member', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers.get('content-type'));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Received non-JSON response:', text);
        throw new Error('Server returned invalid response format');
      }

      const data = await response.json();
      console.log('Members loaded:', data.length);
      
      if (!Array.isArray(data)) {
        throw new Error('Invalid data format received');
      }

      setMembers(data);
      setFilteredMembers(data);
    } catch (error) {
      console.error('Error fetching members:', error);
      
      if (error.name === 'AbortError') {
        setError('Request timeout - server took too long to respond');
      } else if (error.message.includes('Failed to fetch')) {
        setError('Cannot connect to server. Please check if the server is running on port 4000.');
      } else {
        setError(error.message);
      }
      
      setMembers([]);
      setFilteredMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (_id) => {
    Swal.fire({
      title: "আপনি কি শিওর?",
      text: "আপনি এটি পুনরায় ফিরিয়ে আনতে পারবেন না!",
      icon: "warning", 
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "হ্যাঁ ,ডিলিট করব!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:4000/member/${_id}`, {
          method: "DELETE",
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.deletedCount > 0) {
              Swal.fire({
                title: "Deleted!",
                text: "ডিলিট করা হয়েছে",
                icon: "success",
              });
              const remaining = members.filter((mem) => mem._id !== _id);
              setMembers(remaining);
            }
          })
          .catch((error) => {
            console.error('Error deleting member:', error);
            Swal.fire({
              title: "Error!",
              text: "Failed to delete member.",
              icon: "error",
            });
          });
      }
    });
  };

  const filterMembers = () => {
    let filtered = members;

    if (searchTerm) {
      filtered = filtered.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (member.studentId && member.studentId.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filterDepartment !== 'All') {
      filtered = filtered.filter(member => member.department === filterDepartment);
    }

    if (filterBloodGroup !== 'All') {
      filtered = filtered.filter(member => member.blood === filterBloodGroup);
    }

    if (filterSession !== 'All') {
      filtered = filtered.filter(member => member.session === filterSession);
    }

    if (filterUnion !== 'All') {
      filtered = filtered.filter(member => member.union === filterUnion);
    }

    setFilteredMembers(filtered);
  };

  const handleCardClick = (memberId, e) => {
    if (e.target.closest('button')) {
      return;
    }
    navigate(`/members/${memberId}`);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setFilterDepartment('All');
    setFilterBloodGroup('All');
    setFilterSession('All');
    setFilterUnion('All');
  };

  const hasActiveFilters = () => {
    return searchTerm !== '' || 
           filterDepartment !== 'All' || 
           filterBloodGroup !== 'All' || 
           filterSession !== 'All' || 
           filterUnion !== 'All';
  };

  const departments = ['All', ...new Set(members.map(m => m.department).filter(Boolean))];
  const bloodGroups = ['All', ...new Set(members.map(m => m.blood).filter(Boolean))];
  const sessions = ['All', ...new Set(members.map(m => m.session).filter(Boolean))];
  const unions = ['All', ...new Set(members.map(m => m.union).filter(Boolean))];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
        <div className="text-xl text-gray-600">Loading members...</div>
        <div className="text-sm text-gray-500 mt-2">Please wait...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h2 className="text-xl font-bold text-red-700 mb-2">Error Loading Members</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchMembers}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-2 sm:mb-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900  sm:mb-2">আমাদের সদস্যবৃন্দ </h1>
          <p className="text-base sm:text-lg text-gray-600">চুসাপের সদস্যদের পরিচিতি </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-2 mb-6 sm:mb-2">
          {/* Top Bar - Search and Filter Toggle */}
          <div className="flex flex-row sm:flex-row gap-4 mb-2">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="নাম বা আইডি লিখে সার্চ করুন..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-gray-700 pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Filter Controls */}
            <div className="flex gap-3">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 bg-blue-500 text-white px-4 sm:px-6 py-3 rounded-xl hover:bg-blue-600 transition-colors relative lg:hidden"
              >
                <Filter size={18} />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {/* Clear Filters Button */}
              {hasActiveFilters() && (
                <button
                  onClick={clearAllFilters}
                  className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 sm:px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors border border-gray-200"
                >
                  <X size={18} />
                  <span className="hidden sm:inline">Clear</span>
                </button>
              )}
            </div>
          </div>

          {/* Filter Options - Responsive Grid */}
          <div className={`${isFilterOpen ? 'block' : 'hidden'} lg:block transition-all duration-300`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* Department Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <GraduationCap size={16} />
                  ডিপার্টমেন্ট
                </label>
                <div className="relative">
                  <select
                    value={filterDepartment}
                    onChange={(e) => setFilterDepartment(e.target.value)}
                    className="w-full text-gray-700 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-gray-50 hover:bg-white transition-colors duration-200"
                  >
                    {departments.map(dept => (
                      <option key={dept} value={dept}>
                        {dept === 'All' ? 'সব বিভাগ ' : dept}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </div>
              </div>

              {/* Blood Group Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <Droplet size={16} />
                  রক্তের গ্রুপ
                </label>
                <div className="relative">
                  <select
                    value={filterBloodGroup}
                    onChange={(e) => setFilterBloodGroup(e.target.value)}
                    className="w-full text-gray-700 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-gray-50 hover:bg-white transition-colors duration-200"
                  >
                    {bloodGroups.map(blood => (
                      <option key={blood} value={blood}>
                        {blood === 'All' ? 'সব রক্তের গ্রুপ' : blood}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </div>
              </div>

              {/* Session Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <Calendar size={16} />
                  সেশন
                </label>
                <div className="relative">
                  <select
                    value={filterSession}
                    onChange={(e) => setFilterSession(e.target.value)}
                    className="w-full text-gray-700 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-gray-50 hover:bg-white transition-colors duration-200"
                  >
                    {sessions.map(session => (
                      <option key={session} value={session}>
                        {session === 'All' ? 'সব সেশন' : session}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </div>
              </div>

              {/* Union Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <MapPin size={16} />
                  ইউনিয়ন
                </label>
                <div className="relative">
                  <select
                    value={filterUnion}
                    onChange={(e) => setFilterUnion(e.target.value)}
                    className="w-full text-gray-700 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-gray-50 hover:bg-white transition-colors duration-200"
                  >
                    {unions.map(union => (
                      <option key={union} value={union}>
                        {union === 'All' ? 'সব ইউনিয়ন' : union}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </div>
              </div>
            </div>

            {/* Active Filters Badges - Mobile */}
            {hasActiveFilters() && (
              <div className="mt-4 lg:hidden">
                <div className="flex flex-wrap gap-2">
                  {searchTerm && (
                    <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      Search: "{searchTerm}"
                      <button onClick={() => setSearchTerm('')} className="hover:text-blue-900">
                        <X size={14} />
                      </button>
                    </span>
                  )}
                  {filterDepartment !== 'All' && (
                    <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                      Dept: {filterDepartment}
                      <button onClick={() => setFilterDepartment('All')} className="hover:text-green-900">
                        <X size={14} />
                      </button>
                    </span>
                  )}
                  {filterBloodGroup !== 'All' && (
                    <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                      Blood: {filterBloodGroup}
                      <button onClick={() => setFilterBloodGroup('All')} className="hover:text-red-900">
                        <X size={14} />
                      </button>
                    </span>
                  )}
                  {filterSession !== 'All' && (
                    <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                      Session: {filterSession}
                      <button onClick={() => setFilterSession('All')} className="hover:text-purple-900">
                        <X size={14} />
                      </button>
                    </span>
                  )}
                  {filterUnion !== 'All' && (
                    <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                      Union: {filterUnion}
                      <button onClick={() => setFilterUnion('All')} className="hover:text-orange-900">
                        <X size={14} />
                      </button>
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Members Grid */}
        {filteredMembers.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 sm:p-12 text-center">
            <User size={64} className="text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">No members found</h2>
            <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
            {hasActiveFilters() && (
              <button
                onClick={clearAllFilters}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredMembers.map((member) => (
              <div
                key={member._id}
                onClick={(e) => handleCardClick(member._id, e)}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer flex flex-col h-full"
              >
                {/* Member Photo */}
                <div className="relative h-40 sm:h-64 bg-gradient-to-br from-blue-400 to-indigo-600 overflow-hidden flex-shrink-0">
                  {member.photo ? (
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User size={64} className="text-white opacity-50" />
                    </div>
                  )}
                </div>

                {/* Member Info */}
                <div className="p-4 sm:p-2 flex-1 flex flex-col">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 text-center line-clamp-2">
                    {member.name}
                  </h3>

                  <div className="space-y-3 flex-1">
                    {/* Department */}
                    {member.department && (
                      <div className="flex items-center gap-3 text-gray-700">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <GraduationCap size={16} className="text-blue-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-gray-500">ডিপার্টমেন্ট</p>
                          <p className="font-semibold text-sm truncate">{member.department}</p>
                        </div>
                      </div>
                    )}

                    {/* Blood Group */}
                    {member.blood && (
                      <div className="flex items-center gap-3 text-gray-700">
                        <div className="bg-red-100 p-2 rounded-lg">
                          <Droplet size={16} className="text-red-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">রক্তের গ্রুপ</p>
                          <p className="font-bold text-sm text-red-600 ">{member.blood}</p>
                        </div>
                      </div>
                    )}

                    {/* Session */}
                    {member.session && (
                      <div className="flex items-center gap-3 text-gray-700">
                        <div className="bg-green-100 p-2 rounded-lg">
                          <Calendar size={16} className="text-green-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">সেশন</p>
                          <p className="font-semibold text-sm">{member.session}</p>
                        </div>
                      </div>
                    )}

                    {/* Union */}
                    {member.union && (
                      <div className="flex items-center gap-3 text-gray-700">
                        <div className="bg-purple-100 p-2 rounded-lg">
                          <MapPin size={16} className="text-purple-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">ইউনিয়ন</p>
                          <p className="font-semibold text-sm">{member.union}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 pt-4 border-t border-gray-200 flex justify-center items-center gap-2 lg:gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/updateMember/${member._id}`);
                      }}
                      className="flex-1 flex items-center justify-center gap-1 lg:gap-2 bg-blue-500 text-white py-2 px-1 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                    >
                      <Edit size={14} />
                      Update
                    </button>

                    {isAdmin() && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(member._id);
                        }}
                        className="flex-1 flex items-center justify-center gap-1 lg:gap-2 bg-red-500 text-white py-2 px-1 rounded-lg hover:bg-red-600 transition-colors text-sm"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    )}
                  </div>
                </div>

                {/* Hover Effect Border */}
                <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Add Member Button */}
      <div className="flex justify-center mt-8">
        <button
          onClick={() => navigate("/addMember")}
          className="hidden lg:flex fixed bottom-6 right-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-full font-semibold shadow-xl hover:from-indigo-500 hover:to-blue-500 hover:scale-110 transition-all z-50 items-center gap-2"
        > নতুন সদস্য হিসেবে যুক্ত হোন
          <FaPlus size={16} />
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
}