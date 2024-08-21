import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AdminDashboard() {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchJobs = async () => {
            const adminId = localStorage.getItem('user');
            const token = localStorage.getItem('token');

            console.log('Admin ID:', adminId);
            console.log('Token:', token);

            try {
                const response = await axios.get(`http://localhost:5000/admin/${adminId}/jobs`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                console.log('Response Data:', response.data);

                if (response.data.jobs.length === 0) {
                    setJobs([]);
                } else {
                    setJobs(response.data.jobs);
                }

            } catch (err) {
                console.error('Error:', err);
                setError('Failed to fetch jobs');
                setJobs([]);  // Set jobs to an empty array on error
            }
        };

        fetchJobs();
    }, [navigate]);


    const handleApplications = (jobId) => {
        navigate(`/view-applications/${jobId}`);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    const handleLogout = () => {
        // Clear local storage
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('user');
        // Navigate to homepage
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <ToastContainer />
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <button
                    onClick={handleLogout}
                    className="py-1 px-3 text-sm bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                    Logout
                </button>
            </div>
            <div className="flex flex-col space-y-4 mb-6">
                <button
                    onClick={() => navigate('/create-job')}
                    className="w-full py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Create Job
                </button>
            </div>
            <div className="mt-6">
                <h2 className="text-2xl font-bold mb-4">Jobs Created by Admin</h2>
                <div className="bg-white p-4 rounded-lg shadow-md">
                    {jobs.length === 0 ? (
                        <p className="text-gray-600">No jobs available currently.</p>
                    ) : (
                        <ul className="space-y-4">
                            {jobs.map((job) => (
                                <li key={job._id} className="p-4 border border-gray-200 rounded-lg shadow-sm flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xl font-semibold">{job.title}</h3>
                                        <p className="text-gray-600">Company: {job.company}</p>
                                        <p className="text-gray-600">Posted on: {formatDate(job.createdAt)}</p>
                                    </div>
                                    <button
                                        onClick={() => handleApplications(job._id)}
                                        className="ml-4 py-2 px-4 bg-yellow-600 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                                    >
                                        View Applications
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
