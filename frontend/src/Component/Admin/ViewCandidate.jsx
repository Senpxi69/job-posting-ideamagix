import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ViewCandidate() {
    const { candidateId } = useParams();
    const [candidate, setCandidate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [status, setStatus] = useState('');
    const [rejectionReason, setRejectionReason] = useState('');
    const [rejectionReasonVisible, setRejectionReasonVisible] = useState(false);
    const [resumeUrl, setResumeUrl] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchCandidateDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/candidate/view-candidate/${candidateId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const data = response.data;

                // Construct URL for the resume
                if (data.candidate.resume) {
                    const resumePath = data.candidate.resume; // e.g., 'uploads/1724206349139.pdf'
                    setResumeUrl(`http://localhost:5000/${resumePath}`);
                }

                setCandidate(data.candidate);
                setStatus(data.candidate?.status || '');
                setLoading(false);
                toast.success("Candidate details fetched successfully!");
            } catch (err) {
                setError('Failed to fetch candidate details');
                setLoading(false);
                console.error(err);
                toast.error("Failed to fetch candidate details!");
            }
        };

        fetchCandidateDetails();
    }, [candidateId, token]);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    const handleUpdateStatus = async () => {
        try {
            const updateData = { status };
            if (status === "Rejected") {
                updateData.rejectionReason = rejectionReason;
            }

            const applicationId = localStorage.getItem('applicationId');
            const response = await axios.put(`http://localhost:5000/application/update-status/${applicationId}`, updateData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            toast.success("Status updated successfully!");
            setCandidate({ ...candidate, status: response.data.status });

            if (status !== "Rejected") {
                setRejectionReason('');
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to update status!");
        }
    };

    const handleStatusChange = (e) => {
        const newStatus = e.target.value;
        setStatus(newStatus);
        setRejectionReasonVisible(newStatus === "Rejected");
    };

    if (loading) {
        return <div className="text-center py-4">Loading...</div>;
    }

    if (error) {
        return <div className="text-center py-4">{error}</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <ToastContainer />
            <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center">Candidate Details</h1>
            {candidate ? (
                <div className="bg-white p-8 rounded-lg shadow-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="space-y-4">
                            <div className="text-lg font-semibold text-gray-700"><strong>full Name:</strong> {candidate.user.fullname || 'N/A'}</div>
                            <div className="text-lg font-semibold text-gray-700"><strong>Phone Number:</strong> {candidate.phoneNumber || 'N/A'}</div>
                            <div className="text-lg font-semibold text-gray-700"><strong>Address:</strong> {candidate.address || 'N/A'}</div>
                            <div className="text-lg font-semibold text-gray-700"><strong>LinkedIn Profile:</strong> {candidate.linkedinProfile || 'N/A'}</div>
                            <div className="text-lg font-semibold text-gray-700"><strong>Portfolio:</strong> {candidate.portfolio || 'N/A'}</div>
                            <div className="text-lg font-semibold text-gray-700"><strong>Skills:</strong> {candidate.skills.join(', ') || 'N/A'}</div>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800 mb-2">Experience:</h2>
                                {candidate.experience.map(exp => (
                                    <div key={exp._id} className="mb-4 p-4 border border-gray-300 rounded-md">
                                        <p><strong>Company:</strong> {exp.company || 'N/A'}</p>
                                        <p><strong>Role:</strong> {exp.role || 'N/A'}</p>
                                        <p><strong>Start Date:</strong> {formatDate(exp.startDate)}</p>
                                        <p><strong>End Date:</strong> {formatDate(exp.endDate)}</p>
                                        <p><strong>Description:</strong> {exp.description || 'N/A'}</p>
                                    </div>
                                ))}
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800 mb-2">Education:</h2>
                                {candidate.education.map(edu => (
                                    <div key={edu._id} className="mb-4 p-4 border border-gray-300 rounded-md">
                                        <p><strong>Institution:</strong> {edu.institution || 'N/A'}</p>
                                        <p><strong>Degree:</strong> {edu.degree || 'N/A'}</p>
                                        <p><strong>Start Date:</strong> {formatDate(edu.startDate)}</p>
                                        <p><strong>End Date:</strong> {formatDate(edu.endDate)}</p>
                                        <p><strong>Description:</strong> {edu.description || 'N/A'}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {resumeUrl && (
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">Resume:</h2>
                            <iframe
                                src={resumeUrl}
                                width="100%"
                                height="600"
                                title="Resume"
                                className="border border-gray-300 rounded-md"
                            ></iframe>
                        </div>
                    )}

                    <div className="mb-8">
                        <label className="block text-gray-700 text-lg font-semibold mb-2">Update Status:</label>
                        <select
                            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            value={status}
                            onChange={handleStatusChange}
                        >
                            <option value="">Select Status</option>
                            <option value="Applied">Applied</option>
                            <option value="In Review">Reviewed</option>
                            <option value="Interviewed">Interview Scheduled</option>
                            <option value="Hired">Hired</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>

                    {rejectionReasonVisible && (
                        <div className="mb-8">
                            <label className="block text-gray-700 text-lg font-semibold mb-2">Rejection Reason:</label>
                            <textarea
                                className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder="Provide the reason for rejection"
                            />
                        </div>
                    )}

                    <button
                        onClick={handleUpdateStatus}
                        className="w-full py-3 px-6 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150"
                    >
                        Update Status
                    </button>
                </div>
            ) : (
                <p className="text-center text-gray-700">No candidate details available.</p>
            )}
        </div>
    );
}

export default ViewCandidate;