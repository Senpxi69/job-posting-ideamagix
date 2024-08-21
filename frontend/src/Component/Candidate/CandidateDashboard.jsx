import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const CandidateDashboard = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error("No token found");
                }
                const response = await axios.get('http://localhost:5000/admin/all-job', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setJobs(response.data.jobs);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch jobs');
                setLoading(false);
                console.error(err);
                toast.error("Failed to fetch jobs!");
            }
        };

        fetchJobs();
    }, []);

    useEffect(() => {
        const role = localStorage.getItem('role');
        const user = localStorage.getItem('user');

        if (role === 'admin') {
            localStorage.removeItem('role'); // Ensure this aligns with your application logic
            navigate(`/admin/${user}`);
        } else if (role === 'candidate') {
            navigate(`/candidate/${user}`);
        } else {
            navigate('/');
        }
    }, [navigate]);

    const handleViewJob = (jobId) => {
        navigate(`/view-job/${jobId}`);
    };

    const handleLogout = () => {
        // Clear local storage
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('user');
        // Navigate to homepage
        navigate('/');
    };

    if (loading) {
        return <div className="text-center py-4">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <ToastContainer />
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Available Jobs</h1>
                <button
                    onClick={handleLogout}
                    className="py-1 px-3 text-sm bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                    Logout
                </button>
            </div>
            {error && <div className="text-center py-4">{error}</div>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.length > 0 ? (
                    jobs.map((job) => (
                        <div key={job._id} className="bg-white p-4 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold mb-2">{job.title}</h2>
                            <p className="text-gray-600 mb-2"><strong>Company:</strong> {job.company}</p>
                            <p className="text-gray-600 mb-2"><strong>Category:</strong> {job.category}</p>
                            <p className="text-gray-600 mb-2"><strong>Type:</strong> {job.type}</p>
                            <p className="text-gray-600 mb-2"><strong>Experience Required:</strong> {job.experienceRequired}</p>
                            <p className="text-gray-600 mb-2"><strong>Salary:</strong> {job.salary}</p>
                            <button
                                onClick={() => handleViewJob(job._id)}
                                className="mt-4 w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                View Job
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-700">No jobs available.</p>
                )}
            </div>
        </div>
    );
};

export default CandidateDashboard;