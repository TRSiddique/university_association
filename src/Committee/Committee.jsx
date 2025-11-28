import { useState, useEffect } from "react";
import committeeData from "../data/committeeData.json";

const Committee = () => {
  const [activeTab, setActiveTab] = useState("current");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMembers, setFilteredMembers] = useState([]);

  // Filter members based on search term
  useEffect(() => {
    if (activeTab === "current" && committeeData.currentCommittee) {
      const members = committeeData.currentCommittee.members;
      if (searchTerm.trim() === "") {
        setFilteredMembers(members);
      } else {
        const filtered = members.filter(
          (member) =>
            member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.department.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredMembers(filtered);
      }
    }
  }, [searchTerm, activeTab]);

  // Sort members by priority for display
  const sortedMembers = filteredMembers.sort((a, b) => a.priority - b.priority);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            ২য় কার্যনির্বাহী কমিটি
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            ২০২৫-২০২৬ শিক্ষাবর্ষ
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg shadow-sm p-1 flex">
            <button
              onClick={() => setActiveTab("current")}
              className={`px-6 py-3 rounded-md font-medium transition-colors ${
                activeTab === "current"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              বর্তমান কমিটি
            </button>
            <button
              onClick={() => setActiveTab("previous")}
              className={`px-6 py-3 rounded-md font-medium transition-colors ${
                activeTab === "previous"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              পূর্বের কমিটি
            </button>
          </div>
        </div>

        {/* Current Committee Tab */}
        {activeTab === "current" && (
          <div>
            {/* Search and Stats Bar */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    কমিটির সদস্যবৃন্দ
                  </h3>
                  <p className="text-gray-600 text-sm">
                    মোট ৩৯ সদস্য
                    {searchTerm && ` • ${filteredMembers.length} found`}
                  </p>
                </div>

                <div className="relative lg:w-80">
                  <input
                    type="text"
                    placeholder="নাম,পদবী লিখে সার্চ করুন..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 pl-10 pr-4 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <svg
                    className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Members List - Table for large screens */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden hidden md:block">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        নাম 
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        পদবি
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        বিভাগ 
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        সেশন 
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        মোবাইল 
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedMembers.map((member) => (
                      <tr
                        key={member.id}
                        className="hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {member.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              member.priority <= 5
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {member.position}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {member.department}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {member.session}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {member.mobile}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* No Results Message */}
              {sortedMembers.length === 0 && (
                <div className="text-center py-12">
                  <svg
                    className="w-16 h-16 text-gray-400 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    No members found
                  </h3>
                  <p className="text-gray-500">
                    Try adjusting your search terms
                  </p>
                </div>
              )}
            </div>

            {/* Members List - Cards for mobile */}
            <div className="md:hidden space-y-4">
              {sortedMembers.map((member) => (
                <div
                  key={member.id}
                  className="bg-white rounded-lg shadow-md p-4"
                >
                  {/* Line 1: Name and Position */}
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-sm font-semibold text-gray-900 flex-1">
                      {member.name}
                    </h3>
                    <span
                      className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${
                        member.priority <= 5
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {member.position}
                    </span>
                  </div>

                  {/* Line 2: Department and Session */}
                  <div className="text-xs text-gray-600 mb-1">
                  বিভাগ:  {member.department} •সেশন: {member.session}
                  </div>

                  {/* Line 3: Contact */}
                  <div className="text-xs text-gray-500">
                    📱 {member.mobile}
                  </div>
                </div>
              ))}

              {/* No Results Message for Mobile */}
              {sortedMembers.length === 0 && (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <svg
                    className="w-12 h-12 text-gray-400 mx-auto mb-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="text-base font-semibold text-gray-600 mb-1">
                    No members found
                  </h3>
                  <p className="text-sm text-gray-500">
                    Try adjusting your search terms
                  </p>
                </div>
              )}
            </div>

            {/* Export Option */}
            {/* <div className="mt-4 text-right">
                            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Export as PDF
                            </button>
                        </div> */}
          </div>
        )}

        {/* Previous Committees Tab */}
        {activeTab === "previous" && (
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">
                  পূর্ববর্তী কার্যনির্বাহী কমিটির সদস্যবৃন্দ
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 hidden md:table-header-group">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        শিক্ষাবর্ষ
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        সভাপতি
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        সাধারণ সম্পাদক
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        মোট সদস্য
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        বিস্তারিত
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {committeeData.previousCommittees.map(
                      (committee, index) => (
                        <tr
                          key={index}
                          className="hover:bg-gray-50 transition-colors md:table-row flex flex-col md:flex-row"
                        >
                          {/* Academic Year */}
                          <td className="px-6 py-4 whitespace-nowrap md:table-cell flex justify-between md:block">
                            <span className="font-semibold text-gray-900 md:hidden">
                              শিক্ষাবর্ষ:
                            </span>
                            <span className="font-semibold text-gray-900">
                              {committee.academicYear}
                            </span>
                          </td>

                          {/* President */}
                          <td className="px-6 py-4 whitespace-nowrap text-gray-900 md:table-cell flex justify-between md:block">
                            <span className="font-medium text-gray-500 md:hidden">
                              সভাপতি:
                            </span>
                            {committee.president}
                          </td>

                          {/* General Secretary */}
                          <td className="px-6 py-4 whitespace-nowrap text-gray-900 md:table-cell flex justify-between md:block">
                            <span className="font-medium text-gray-500 md:hidden">
                              সাধারণ সম্পাদক:
                            </span>
                            {committee.generalSecretary}
                          </td>

                          {/* Total Members */}
                          <td className="px-6 py-4 whitespace-nowrap md:table-cell flex justify-between md:block">
                            <span className="font-medium text-gray-500 md:hidden">
                              মোট সদস্য:
                            </span>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                              ৫০ জন
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium md:table-cell flex justify-between md:block">
                            <span className="font-medium text-gray-500 md:hidden">
                              বিস্তারিত:
                            </span>
                            <a
                              href="https://www.facebook.com/share/p/1Aq3mXfbZT/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-900"
                            >
                              View Details
                            </a>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Archive Note */}
            <div className="mt-6 text-center">
              <p className="text-gray-500 text-sm">
                Complete committee archives with full member lists are
                maintained in our records
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Committee;
