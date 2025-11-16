import { useEffect, useMemo, useState } from 'react';
import { FaFilter, FaPlus, FaSearch, FaTrash } from 'react-icons/fa';
import { useLoaderData, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from '../context/AuthContext'; // ADD THIS IMPORT
import MembersCard from './MembersCard';


const Members = () => {
  const loadedMembers = useLoaderData();
  const navigate = useNavigate();
  const { isAdmin } = useAuth(); // ADD THIS
  
  // Ensure members is always an array
  const [members, setMembers] = useState(() => {
    return Array.isArray(loadedMembers) ? loadedMembers : [];
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    blood: '',
    union: '',
    department: '',
    session: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // ADD DELETE FUNCTION HERE
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

  // Faster loading - remove artificial delay
  useEffect(() => {
    // Set loading to false immediately since data is already loaded by router
    setIsLoading(false);
  }, []);

  // Memoize unique values for better performance
  const { bloodGroups, unions, departments, sessions } = useMemo(() => {
    const safeMembers = Array.isArray(members) ? members : [];
    return {
      bloodGroups: [...new Set(safeMembers.map(member => member.blood).filter(Boolean))].sort(),
      unions: [...new Set(safeMembers.map(member => member.union).filter(Boolean))].sort(),
      departments: [...new Set(safeMembers.map(member => member.department).filter(Boolean))].sort(),
      sessions: [...new Set(safeMembers.map(member => member.session).filter(Boolean))].sort()
    };
  }, [members]);

  // Memoize filtered members for better performance
  const filteredMembers = useMemo(() => {
    const safeMembers = Array.isArray(members) ? members : [];
    
    return safeMembers.filter(member => {
      if (!member) return false;
      
      // Search term filter
      const matchesSearch = searchTerm === '' || 
        (member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         member.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         member.mobile?.includes(searchTerm));

      // Individual filters
      const matchesBlood = !filters.blood || member.blood === filters.blood;
      const matchesUnion = !filters.union || member.union === filters.union;
      const matchesDepartment = !filters.department || member.department === filters.department;
      const matchesSession = !filters.session || member.session === filters.session;

      return matchesSearch && matchesBlood && matchesUnion && matchesDepartment && matchesSession;
    });
  }, [members, searchTerm, filters]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      blood: '',
      union: '',
      department: '',
      session: ''
    });
    setSearchTerm('');
  };

  const hasActiveFilters = useMemo(() => {
    return Object.values(filters).some(value => value !== '') || searchTerm !== '';
  }, [filters, searchTerm]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 lg:p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading Members</h2>
          <p className="text-gray-500">Please wait while we fetch the member data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      {/* Header with Search and Filter */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            All Members List ({filteredMembers.length})
            {hasActiveFilters && (
              <span className="text-sm text-gray-600 ml-2">
                (Filtered from {members.length})
              </span>
            )}
          </h1>

          <div className="flex gap-2">
            {/* Search Input */}
            <div className="relative flex-1 lg:flex-none">
              <input
                type="text"
                placeholder="Search by name, ID, or mobile..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full lg:w-64 px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                showFilters 
                  ? 'bg-blue-600 text-white border-blue-600' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <FaFilter />
              Filter
              {hasActiveFilters && (
                <span className="bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  {Object.values(filters).filter(Boolean).length + (searchTerm ? 1 : 0)}
                </span>
              )}
            </button>

            {/* ADD ADMIN DELETE BUTTON IN HEADER */}
            {isAdmin() && (
              <div className="flex items-center gap-2 px-3 bg-red-50 border border-red-200 rounded-lg">
                <FaTrash className="text-red-600" />
                <span className="text-red-700 text-sm font-medium">Admin Mode</span>
              </div>
            )}
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Blood Group Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Blood Group
                </label>
                <select
                  value={filters.blood}
                  onChange={(e) => handleFilterChange('blood', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Blood Groups</option>
                  {bloodGroups.map(blood => (
                    <option key={blood} value={blood}>{blood}</option>
                  ))}
                </select>
              </div>

              {/* Union Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Union
                </label>
                <select
                  value={filters.union}
                  onChange={(e) => handleFilterChange('union', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Unions</option>
                  {unions.map(union => (
                    <option key={union} value={union}>{union}</option>
                  ))}
                </select>
              </div>

              {/* Department Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                <select
                  value={filters.department}
                  onChange={(e) => handleFilterChange('department', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              {/* Session Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session
                </label>
                <select
                  value={filters.session}
                  onChange={(e) => handleFilterChange('session', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Sessions</option>
                  {sessions.map(session => (
                    <option key={session} value={session}>{session}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <div className="mt-4 text-center">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mb-4">
            {searchTerm && (
              <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm gap-2">
                Search: "{searchTerm}"
                <button 
                  onClick={() => setSearchTerm('')}
                  className="hover:text-blue-600"
                >
                  ×
                </button>
              </span>
            )}
            {filters.blood && (
              <span className="inline-flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm gap-2">
                Blood: {filters.blood}
                <button 
                  onClick={() => handleFilterChange('blood', '')}
                  className="hover:text-red-600"
                >
                  ×
                </button>
              </span>
            )}
            {filters.union && (
              <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm gap-2">
                Union: {filters.union}
                <button 
                  onClick={() => handleFilterChange('union', '')}
                  className="hover:text-green-600"
                >
                  ×
                </button>
              </span>
            )}
            {filters.department && (
              <span className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm gap-2">
                Department: {filters.department}
                <button 
                  onClick={() => handleFilterChange('department', '')}
                  className="hover:text-purple-600"
                >
                  ×
                </button>
              </span>
            )}
            {filters.session && (
              <span className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm gap-2">
                Session: {filters.session}
                <button 
                  onClick={() => handleFilterChange('session', '')}
                  className="hover:text-yellow-600"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Members Grid */}
      {filteredMembers.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No members found</h3>
          <p className="text-gray-500 mb-4">
            {hasActiveFilters 
              ? "Try adjusting your filters or search term" 
              : "No members available"
            }
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear All Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
          {filteredMembers.map(member => (
            <div key={member._id} className="relative">
              {/* ADD DELETE BUTTON FOR EACH MEMBER CARD */}
              {isAdmin() && (
                <button 
                  onClick={() => handleDelete(member._id)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-colors z-10"
                  title="Delete Member"
                >
                  <FaTrash size={12} />
                </button>
              )}
              <MembersCard
                members={members}
                setMembers={setMembers}
                member={member}
              />
            </div>
          ))}
        </div>
      )}

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