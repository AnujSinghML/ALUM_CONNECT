// client/src/routes/AdminProfile.jsx
import React, { useState, useEffect } from 'react';
import Layout from '../components/common/Layout';
import axios from 'axios';
import { useSidebarLayout } from '../hooks/useSidebarLayout';
import { Search, Filter, ChevronDown, ChevronUp } from 'lucide-react';

const AdminProfile = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [alumni, setAlumni] = useState([]);
  const [students, setStudents] = useState([]);
  const [filteredAlumni, setFilteredAlumni] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAlumniFilters, setShowAlumniFilters] = useState(false);
  const [showStudentFilters, setShowStudentFilters] = useState(false);
  
  // Filter states
  const [alumniFilters, setAlumniFilters] = useState({
    batch: '',
    branch: '',
    keyword: '',
  });
  
  const [studentFilters, setStudentFilters] = useState({
    batch: '',
    branch: '',
    keyword: '',
  });

  useSidebarLayout(true);
  
  // Fetch all users from /api/users
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_backend_URL}/api/users`, {
        withCredentials: true,
      });
      const users = res.data;
      setAllUsers(users);

      // Separate into alumni vs. students
      const alumniList = users.filter((u) => u.role === 'alumni');
      const studentList = users.filter((u) => u.role === 'student');
      
      setAlumni(alumniList);
      setStudents(studentList);
      setFilteredAlumni(alumniList);
      setFilteredStudents(studentList);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load user profiles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Get unique batches and branches
  const uniqueBatches = [...new Set(allUsers.filter(u => u.batch).map(u => u.batch))].sort();
  const uniqueBranches = [...new Set(allUsers.filter(u => u.branch).map(u => u.branch))].sort();

  // Apply alumni filters
  useEffect(() => {
    if (alumni.length) {
      let filtered = [...alumni];
      
      if (alumniFilters.batch) {
        filtered = filtered.filter(u => u.batch === alumniFilters.batch);
      }
      
      if (alumniFilters.branch) {
        filtered = filtered.filter(u => u.branch === alumniFilters.branch);
      }
      
      if (alumniFilters.keyword) {
        const keyword = alumniFilters.keyword.toLowerCase();
        filtered = filtered.filter(u => 
          (u.name && u.name.toLowerCase().includes(keyword)) || 
          (u.email && u.email.toLowerCase().includes(keyword))
        );
      }
      
      setFilteredAlumni(filtered);
    }
  }, [alumniFilters, alumni]);

  // Apply student filters
  useEffect(() => {
    if (students.length) {
      let filtered = [...students];
      
      if (studentFilters.batch) {
        filtered = filtered.filter(u => u.batch === studentFilters.batch);
      }
      
      if (studentFilters.branch) {
        filtered = filtered.filter(u => u.branch === studentFilters.branch);
      }
      
      if (studentFilters.keyword) {
        const keyword = studentFilters.keyword.toLowerCase();
        filtered = filtered.filter(u => 
          (u.name && u.name.toLowerCase().includes(keyword)) || 
          (u.email && u.email.toLowerCase().includes(keyword))
        );
      }
      
      setFilteredStudents(filtered);
    }
  }, [studentFilters, students]);

  // Handler to update filter fields
  const handleAlumniFilterChange = (e) => {
    const { name, value } = e.target;
    setAlumniFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStudentFilterChange = (e) => {
    const { name, value } = e.target;
    setStudentFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Reset filters
  const resetAlumniFilters = () => {
    setAlumniFilters({
      batch: '',
      branch: '',
      keyword: '',
    });
  };

  const resetStudentFilters = () => {
    setStudentFilters({
      batch: '',
      branch: '',
      keyword: '',
    });
  };

  // Handler: update a student's role to alumni
  const handleMarkAsAlumni = async (userId) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_backend_URL}/api/users/${userId}/role`,
        { role: 'alumni' },
        { withCredentials: true }
      );
      // Refresh after update
      fetchUsers();
    } catch (err) {
      console.error('Error updating user role:', err);
      setError('Failed to update user role');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <p className="text-blue-600 font-medium">Loading profiles...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="text-center p-8 text-red-500">{error}</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">

        {/* Alumni Section */}
        <section>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              Alumni Profiles
            </h2>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAlumniFilters(!showAlumniFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                <Filter size={18} />
                {showAlumniFilters ? 'Hide Filters' : 'Show Filters'}
                {showAlumniFilters ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              
              <span className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium">
                {filteredAlumni.length} {filteredAlumni.length === 1 ? 'alumni' : 'alumni'} found
              </span>
            </div>
          </div>
          
          {/* Alumni Filters */}
          {showAlumniFilters && (
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Batch Filter */}
                <div>
                  <label htmlFor="alumni-batch" className="block text-sm font-medium text-gray-700 mb-1">
                    Batch
                  </label>
                  <select
                    id="alumni-batch"
                    name="batch"
                    value={alumniFilters.batch}
                    onChange={handleAlumniFilterChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Batches</option>
                    {uniqueBatches.map(batch => (
                      <option key={`alumni-${batch}`} value={batch}>
                        {batch}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Branch Filter */}
                <div>
                  <label htmlFor="alumni-branch" className="block text-sm font-medium text-gray-700 mb-1">
                    Branch
                  </label>
                  <select
                    id="alumni-branch"
                    name="branch"
                    value={alumniFilters.branch}
                    onChange={handleAlumniFilterChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Branches</option>
                    {uniqueBranches.map(branch => (
                      <option key={`alumni-${branch}`} value={branch}>
                        {branch}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Keyword Search */}
                <div>
                  <label htmlFor="alumni-keyword" className="block text-sm font-medium text-gray-700 mb-1">
                    Search
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="alumni-keyword"
                      name="keyword"
                      value={alumniFilters.keyword}
                      onChange={handleAlumniFilterChange}
                      placeholder="Search name or email"
                      className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
              
              {/* Filter Actions */}
              <div className="flex justify-end mt-4">
                <button
                  onClick={resetAlumniFilters}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}
          
          {filteredAlumni.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-8 text-center">
              <p className="text-gray-600 mb-4">No alumni profiles found matching your filters.</p>
              {Object.values(alumniFilters).some(val => val !== '') && (
                <button
                  onClick={resetAlumniFilters}
                  className="text-blue-500 font-medium hover:text-blue-700"
                >
                  Reset Filters
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto bg-white rounded-xl shadow">
              <table className="min-w-full table-auto border-collapse text-left">
                <thead className="bg-gray-100 text-gray-600 uppercase text-xs tracking-wider">
                  <tr>
                    <th className="px-6 py-3 font-medium">Name</th>
                    <th className="px-6 py-3 font-medium">Email</th>
                    <th className="px-6 py-3 font-medium">Batch</th>
                    <th className="px-6 py-3 font-medium">Branch</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {filteredAlumni.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{user.email}</td>
                      <td className="px-6 py-4 text-gray-600">
                        {user.batch || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {user.branch || 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Students Section */}
        <section>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              Student Profiles
            </h2>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowStudentFilters(!showStudentFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                <Filter size={18} />
                {showStudentFilters ? 'Hide Filters' : 'Show Filters'}
                {showStudentFilters ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              
              <span className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium">
                {filteredStudents.length} {filteredStudents.length === 1 ? 'student' : 'students'} found
              </span>
            </div>
          </div>
          
          {/* Student Filters */}
          {showStudentFilters && (
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Batch Filter */}
                <div>
                  <label htmlFor="student-batch" className="block text-sm font-medium text-gray-700 mb-1">
                    Batch
                  </label>
                  <select
                    id="student-batch"
                    name="batch"
                    value={studentFilters.batch}
                    onChange={handleStudentFilterChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Batches</option>
                    {uniqueBatches.map(batch => (
                      <option key={`student-${batch}`} value={batch}>
                        {batch}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Branch Filter */}
                <div>
                  <label htmlFor="student-branch" className="block text-sm font-medium text-gray-700 mb-1">
                    Branch
                  </label>
                  <select
                    id="student-branch"
                    name="branch"
                    value={studentFilters.branch}
                    onChange={handleStudentFilterChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Branches</option>
                    {uniqueBranches.map(branch => (
                      <option key={`student-${branch}`} value={branch}>
                        {branch}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Keyword Search */}
                <div>
                  <label htmlFor="student-keyword" className="block text-sm font-medium text-gray-700 mb-1">
                    Search
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="student-keyword"
                      name="keyword"
                      value={studentFilters.keyword}
                      onChange={handleStudentFilterChange}
                      placeholder="Search name or email"
                      className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
              
              {/* Filter Actions */}
              <div className="flex justify-end mt-4">
                <button
                  onClick={resetStudentFilters}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}
          
          {filteredStudents.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-8 text-center">
              <p className="text-gray-600 mb-4">No student profiles found matching your filters.</p>
              {Object.values(studentFilters).some(val => val !== '') && (
                <button
                  onClick={resetStudentFilters}
                  className="text-blue-500 font-medium hover:text-blue-700"
                >
                  Reset Filters
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto bg-white rounded-xl shadow">
              <table className="min-w-full table-auto border-collapse text-left">
                <thead className="bg-gray-100 text-gray-600 uppercase text-xs tracking-wider">
                  <tr>
                    <th className="px-6 py-3 font-medium">Name</th>
                    <th className="px-6 py-3 font-medium">Email</th>
                    <th className="px-6 py-3 font-medium">Batch</th>
                    <th className="px-6 py-3 font-medium">Branch</th>
                    <th className="px-6 py-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {filteredStudents.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{user.email}</td>
                      <td className="px-6 py-4 text-gray-600">
                        {user.batch || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {user.branch || 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleMarkAsAlumni(user._id)}
                          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition text-xs font-medium"
                        >
                          Mark as Alumni
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
};

export default AdminProfile;