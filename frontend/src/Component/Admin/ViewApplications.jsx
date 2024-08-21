import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ViewApplications = () => {
    const navigate = useNavigate();
    const { jobId } = useParams();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');

    const handleViewMore = (candidateId, applicationId) => {
        localStorage.setItem('applicationId', applicationId);
        navigate(`/view-candidate/${candidateId}`);
    };

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:5000/application/candidates/${jobId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setApplications(response.data.applications);
                toast.success("Applications fetched successfully!");
            } catch (err) {
                setError(err.message);
                toast.error("Failed to fetch applications!");
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, [jobId, token]);

    if (loading) {
        return <div className="text-center py-4">Loading...</div>;
    }

    if (error) {
        return <div className="text-center py-4 text-red-500">Error: {error}</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <ToastContainer />
            <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center">Applications</h1>
            {applications.length === 0 ? (
                <p className="text-center text-gray-600">No applications found.</p>
            ) : (
                <ul className="space-y-6">
                    {applications.map(application => (
                        <li key={application._id} className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                            {application.candidate ? (
                                <>
                                    <p className="text-lg text-gray-700 mb-2"><strong>Phone Number:</strong> {application.candidate.phoneNumber || 'N/A'}</p>
                                    <p className="text-lg text-gray-700 mb-2"><strong>Skills:</strong> {application.candidate.skills?.join(', ') || 'N/A'}</p>
                                    <p className="text-lg text-gray-700 mb-2"><strong>LinkedIn:</strong> <a href={application.candidate.linkedinProfile} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">{application.candidate.linkedinProfile || 'N/A'}</a></p>
                                    <p className="text-lg text-gray-700 mb-4"><strong>Portfolio:</strong> <a href={application.candidate.portfolio} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">{application.candidate.portfolio || 'N/A'}</a></p>
                                    <button
                                        onClick={() => handleViewMore(application.candidate._id, application._id)}
                                        className="py-2 px-4 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition duration-200 ease-in-out"
                                    >
                                        View More Details
                                    </button>
                                </>
                            ) : (
                                <p className="text-gray-600">No candidate information available.</p>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ViewApplications;
