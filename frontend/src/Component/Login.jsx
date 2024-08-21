// src/components/Login.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Show success message if available
        const successMessage = () => {
            const message = localStorage.getItem('success');
            if (message) {
                toast.success(message);
                localStorage.removeItem('success');
            }
        };

        // Redirect user based on role and authentication status
        const handleNavigation = () => {
            const savedRole = localStorage.getItem('role');
            const token = localStorage.getItem('token');
            const user = localStorage.getItem('user');

            if (savedRole && token && user) {
                const route = savedRole === 'admin' ? `/admin/${user}` : `/candidate/${user}`;
                navigate(route);
            }
        };

        handleNavigation();
        successMessage();
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // API call for login
            const response = await axios.post('http://localhost:5000/auth/login', { email, password, role });

            // Extract data from response
            const { user, token } = response.data;

            // Save user info and token in localStorage
            localStorage.setItem('role', role);
            localStorage.setItem('user', user);
            localStorage.setItem('token', token);

            // Navigate to the appropriate route based on the role
            const redirectPath = role === 'candidate' ? `/candidate/${user}` : `/admin/${user}`;
            navigate(redirectPath);

            toast.success('Login successful!');
        } catch (error) {
            toast.error('Login failed. Please check your credentials.');
            console.error('Login error:', error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                            Role
                        </label>
                        <select
                            id="role"
                            name="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                            <option value="">Select your role</option>
                            <option value="admin">Admin</option>
                            <option value="candidate">Candidate</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Login
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <a href="/register" className="text-indigo-600 hover:text-indigo-800">
                        Don't have an account? Register here
                    </a>
                    <div className="mt-2">
                        <a href="/forgot-password" className="text-indigo-600 hover:text-indigo-800">
                            Forgot your password? Reset here
                        </a>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Login;
