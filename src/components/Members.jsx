import React from 'react';
import { useLoaderData, useNavigate } from "react-router-dom";
import MembersCard from './MembersCard';
import { FaPlus, FaFilter, FaSearch } from 'react-icons/fa';
import { useState } from 'react';

const Members = () => {
  const loadedMembers = useLoaderData();
  const navigate = useNavigate();
  const [members, setMembers] = useState(loadedMembers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    blood: '',
    union: '',
    department: '',
    session: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  // Get unique values for filter dropdowns
  const bloodGroups = [...new Set(loadedMembers.map(member => member.blood).filter(Boolean))];
  const unions = [...new Set(loadedMembers.map(member => member.union).filter(Boolean))];
  const departments = [...new Set(loadedMembers.map(member => member.department).filter(Boolean))];
  const sessions = [...new Set(loadedMembers.map(member => member.session).filter(Boolean))];

  // Filter members based on search term and filters
  const filteredMembers = members.filter(member => {
    // Search term filter (search in name, studentId, mobile)
    const matchesSearch = searchTerm === '' || 
      member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.mobile?.includes(searchTerm);

    // Blood group filter
    const matchesBlood = filters.blood === '' || member.blood === filters.blood;
    
    // Union filter
    const matchesUnion = filters.union === '' || member.union === filters.union;
    
    // Department filter
    const matchesDepartment = filters.department === '' || member.department === filters.department;
    
    // Session filter
    const matchesSession = filters.session === '' || member.session === filters.session;

    return matchesSearch && matchesBlood && matchesUnion && matchesDepartment && matchesSession;
  });

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

  const hasActiveFilters = filters.blood || filters.union || filters.department || filters.session || searchTerm;

  return (
    <div className="p-4 lg:p-6">
      {/* Header with Search and Filter */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            All Members List ({filteredMembers.length})
            {hasActiveFilters && (
              <span className="text-sm text-gray-600 ml-2">
                (Filtered from {loadedMembers.length})
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
                className="input input-bordered w-full lg:w-64 pl-10"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`btn ${showFilters ? 'btn-primary' : 'btn-outline'}`}
            >
              <FaFilter className="mr-2" />
              Filter
              {hasActiveFilters && (
                <span className="ml-2 bg-primary text-primary-content rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  {Object.values(filters).filter(Boolean).length + (searchTerm ? 1 : 0)}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-base-200 p-4 rounded-lg mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Blood Group Filter */}
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Blood Group</span>
                </label>
                <select
                  value={filters.blood}
                  onChange={(e) => handleFilterChange('blood', e.target.value)}
                  className="select select-bordered w-full"
                >
                  <option value="">All Blood Groups</option>
                  {bloodGroups.map(blood => (
                    <option key={blood} value={blood}>{blood}</option>
                  ))}
                </select>
              </div>

              {/* Union Filter */}
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Union</span>
                </label>
                <select
                  value={filters.union}
                  onChange={(e) => handleFilterChange('union', e.target.value)}
                  className="select select-bordered w-full"
                >
                  <option value="">All Unions</option>
                  {unions.map(union => (
                    <option key={union} value={union}>{union}</option>
                  ))}
                </select>
              </div>

              {/* Department Filter */}
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Department</span>
                </label>
                <select
                  value={filters.department}
                  onChange={(e) => handleFilterChange('department', e.target.value)}
                  className="select select-bordered w-full"
                >
                  <option value="">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              {/* Session Filter */}
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Session</span>
                </label>
                <select
                  value={filters.session}
                  onChange={(e) => handleFilterChange('session', e.target.value)}
                  className="select select-bordered w-full"
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
                  className="btn btn-outline btn-sm"
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
              <span className="badge badge-primary gap-2">
                Search: "{searchTerm}"
                <button onClick={() => setSearchTerm('')}>×</button>
              </span>
            )}
            {filters.blood && (
              <span className="badge badge-secondary gap-2">
                Blood: {filters.blood}
                <button onClick={() => handleFilterChange('blood', '')}>×</button>
              </span>
            )}
            {filters.union && (
              <span className="badge badge-accent gap-2">
                Union: {filters.union}
                <button onClick={() => handleFilterChange('union', '')}>×</button>
              </span>
            )}
            {filters.department && (
              <span className="badge badge-info gap-2">
                Department: {filters.department}
                <button onClick={() => handleFilterChange('department', '')}>×</button>
              </span>
            )}
            {filters.session && (
              <span className="badge badge-success gap-2">
                Session: {filters.session}
                <button onClick={() => handleFilterChange('session', '')}>×</button>
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
              className="btn btn-primary"
            >
              Clear All Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
          {filteredMembers.map(member => (
            <MembersCard
              key={member._id}
              members={members}
              setMembers={setMembers}
              member={member}
            />
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