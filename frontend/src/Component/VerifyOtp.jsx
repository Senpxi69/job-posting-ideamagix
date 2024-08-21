import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

function VerifyOtp() {
    const [otp, setOtp] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const hasPermission = sessionStorage.getItem("hasPermission")

        if (!hasPermission) {
            navigate('/')
        }

        navigate(window.location.pathname, { replace: true });

        const handlePopState = () => {
            navigate('/');
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };


    }, [navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);

        try {
            const email = localStorage.getItem('email');
            if (!email) {
                toast.error("No email found. Please try again.");
                return;
            }

            const response = await axios.post("http://localhost:5000/auth/verify-otp", { email, otp });
            console.log(response.data);
            toast.success("OTP verified successfully");
            navigate("/change-password");

        } catch (error) {
            console.error(error);
            toast.error("Invalid OTP. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center mb-6">Verify OTP</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                            Enter OTP
                        </label>
                        <input
                            type="text"
                            id="otp"
                            name="otp"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter the OTP"
                            maxLength={6}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-2 px-4 ${isSubmitting ? 'bg-gray-400' : 'bg-blue-500'} text-white font-semibold rounded-lg shadow-md hover:${isSubmitting ? '' : 'bg-blue-600'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                        {isSubmitting ? 'Verifying...' : 'Verify OTP'}
                    </button>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
}

export default VerifyOtp;
