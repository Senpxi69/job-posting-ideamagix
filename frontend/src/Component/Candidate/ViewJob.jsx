import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ViewJob = () => {
    const { jobId } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [applicationStatus, setApplicationStatus] = useState('');
    const [isApplied, setIsApplied] = useState(false);
    const candidateId = localStorage.getItem('candidate');
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/admin/view-job/${jobId}`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                setJob(data.job);
            } catch (err) {
                handleFetchError(err);
            } finally {
                setLoading(false);
            }
        };

        const checkApplicationStatus = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/application/status/${candidateId}/${jobId}`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                setIsApplied(true);
                setApplicationStatus(data.application.status);
            } catch (err) {
                if (err.response?.status === 404) {
                    setIsApplied(false);
                } else {
                    handleFetchError(err);
                }
            }
        };

        fetchJobDetails();
        checkApplicationStatus();
    }, [jobId, token, candidateId]);

    const handleFetchError = (error) => {
        const message = error.response?.data?.msg || 'An error occurred';
        setError(message);
        toast.error(message);
    };

    const handleApply = async () => {
        if (!candidateId) {
            toast.error('You must be logged in to apply for a job.');
            return;
        }

        setApplicationStatus('Submitting...');

        try {
            await axios.post('http://localhost:5000/application/create-application', {
                candidate: candidateId,
                job: jobId
            }, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            setIsApplied(true);
            setApplicationStatus('Application submitted successfully!');
            toast.success('Application submitted successfully!');
        } catch (err) {
            handleFetchError(err);
            setApplicationStatus('Failed to apply for the job');
        }
    };

    if (loading) {
        return <div className="text-center py-4">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <ToastContainer />
            <h1 className="text-3xl font-bold mb-6">Job Details</h1>
            {error ? (
                <div className="text-center py-4 text-red-600">{error}</div>
            ) : (
                job && (
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-2">{job.title}</h2>
                        <p className="text-gray-600 mb-2">Company: {job.company}</p>
                        <p className="text-gray-600 mb-2">Category: {job.category}</p>
                        <p className="text-gray-600 mb-2">Type: {job.type}</p>
                        <p className="text-gray-600 mb-2">Experience Required: {job.experienceRequired}</p>
                        <p className="text-gray-600 mb-2">Salary: {job.salary}</p>
                        <p className="text-gray-800 mb-4">{job.description}</p>
                        {!isApplied ? (
                            <button
                                onClick={handleApply}
                                className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Apply
                            </button>
                        ) : (
                            <div className="w-full py-2 px-4 bg-gray-300 text-gray-600 font-semibold rounded-lg shadow-md text-center">
                                Already Applied - Status: {applicationStatus}
                            </div>
                        )}
                    </div>
                )
            )}
        </div>
    );
};

export default ViewJob;
