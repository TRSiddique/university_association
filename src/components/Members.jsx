// src/components/Members.jsx
import { Calendar, Droplet, GraduationCap, Search, User } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Members() {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('All');
  const [filterBloodGroup, setFilterBloodGroup] = useState('All');

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    filterMembers();
  }, [searchTerm, filterDepartment, filterBloodGroup, members]);

  const fetchMembers = async () => {
    try {
      const response = await fetch('https://university-association-backend-1.onrender.com/member');
      const data = await response.json();
      setMembers(data);
      setFilteredMembers(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching members:', error);
      setLoading(false);
    }
  };

  const filterMembers = () => {
    let filtered = members;

    // Search by name
    if (searchTerm) {
      filtered = filtered.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by department
    if (filterDepartment !== 'All') {
      filtered = filtered.filter(member => member.department === filterDepartment);
    }

    // Filter by blood group
    if (filterBloodGroup !== 'All') {
      filtered = filtered.filter(member => member.blood === filterBloodGroup);
    }

    setFilteredMembers(filtered);
  };

  // Get unique departments and blood groups
  const departments = ['All', ...new Set(members.map(m => m.department).filter(Boolean))];
  const bloodGroups = ['All', ...new Set(members.map(m => m.blood).filter(Boolean))];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading members...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Our Members</h1>
          <p className="text-lg text-gray-600">Meet the talented members of CUSAP</p>
          <div className="mt-4 text-2xl font-semibold text-blue-600">
            {filteredMembers.length} {filteredMembers.length === 1 ? 'Member' : 'Members'}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Department Filter */}
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept === 'All' ? 'All Departments' : dept}</option>
              ))}
            </select>

            {/* Blood Group Filter */}
            <select
              value={filterBloodGroup}
              onChange={(e) => setFilterBloodGroup(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {bloodGroups.map(blood => (
                <option key={blood} value={blood}>{blood === 'All' ? 'All Blood Groups' : blood}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Members Grid */}
        {filteredMembers.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <User size={64} className="text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No members found</h2>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member) => (
              <div
                key={member._id}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
              >
                {/* Member Photo */}
                <div className="relative h-48 bg-gradient-to-br from-blue-400 to-indigo-600 overflow-hidden">
                  {member.photo ? (
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User size={64} className="text-white opacity-50" />
                    </div>
                  )}
                  {/* Blood Group Badge */}
                  {member.blood && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                      {member.blood}
                    </div>
                  )}
                </div>

                {/* Member Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                    {member.name}
                  </h3>

                  <div className="space-y-3">
                    {/* Department */}
                    {member.department && (
                      <div className="flex items-center gap-3 text-gray-700">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <GraduationCap size={18} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Department</p>
                          <p className="font-semibold">{member.department}</p>
                        </div>
                      </div>
                    )}

                    {/* Blood Group */}
                    {member.blood && (
                      <div className="flex items-center gap-3 text-gray-700">
                        <div className="bg-red-100 p-2 rounded-lg">
                          <Droplet size={18} className="text-red-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Blood Group</p>
                          <p className="font-semibold">{member.blood}</p>
                        </div>
                      </div>
                    )}

                    {/* Session */}
                    {member.session && (
                      <div className="flex items-center gap-3 text-gray-700">
                        <div className="bg-green-100 p-2 rounded-lg">
                          <Calendar size={18} className="text-green-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Session</p>
                          <p className="font-semibold">{member.session}</p>
                        </div>
                      </div>
                    )}

                    {/* Student ID */}
                    {member.studentId && (
                      <div className="flex items-center gap-3 text-gray-700">
                        <div className="bg-purple-100 p-2 rounded-lg">
                          <User size={18} className="text-purple-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Student ID</p>
                          <p className="font-semibold">{member.studentId}</p>
                        </div>
                      </div>
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
    </div>
  );
}