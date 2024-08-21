import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateJobForm = () => {
    const [title, setTitle] = useState('');
    const [company, setCompany] = useState('');
    const [category, setCategory] = useState('');
    const [type, setType] = useState('');
    const [tags, setTags] = useState('');
    const [skills, setSkills] = useState('');
    const [experienceRequired, setExperienceRequired] = useState('');
    const [description, setDescription] = useState('');
    const [salary, setSalary] = useState('');
    const [additionalFields, setAdditionalFields] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        const createdBy = localStorage.getItem('user');

        if (!createdBy) {
            toast.error('User ID is required to post a job.');
            return;
        }

        try {
            const response = await axios.post(
                'http://localhost:5000/admin/create-job',
                {
                    title,
                    company,
                    category,
                    type,
                    tags: tags.split(',').map(tag => tag.trim()),
                    skills: skills.split(',').map(skill => skill.trim()),
                    experienceRequired,
                    description,
                    salary,
                    additionalFields: additionalFields.split(',').reduce((acc, field) => {
                        const [key, value] = field.split(':').map(part => part.trim());
                        if (key && value) acc[key] = value;
                        return acc;
                    }, {}),
                    createdBy
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            toast.success('Job posted successfully!');
            navigate(`/admin/${createdBy}`);
        } catch (error) {
            toast.error('Failed to post job');
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
            <ToastContainer />
            <div className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Create Job Posting</h1>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="mb-4">
                            <label htmlFor="title" className="block text-lg font-medium text-gray-800">Title</label>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-base py-2 px-4"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="company" className="block text-lg font-medium text-gray-800">Company</label>
                            <input
                                type="text"
                                id="company"
                                value={company}
                                onChange={(e) => setCompany(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-base py-2 px-4"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="category" className="block text-lg font-medium text-gray-800">Category</label>
                            <input
                                type="text"
                                id="category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-base py-2 px-4"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="type" className="block text-lg font-medium text-gray-800">Type</label>
                            <input
                                type="text"
                                id="type"
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-base py-2 px-4"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="tags" className="block text-lg font-medium text-gray-800">Tags (comma separated)</label>
                            <input
                                type="text"
                                id="tags"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-base py-2 px-4"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="skills" className="block text-lg font-medium text-gray-800">Skills (comma separated)</label>
                            <input
                                type="text"
                                id="skills"
                                value={skills}
                                onChange={(e) => setSkills(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-base py-2 px-4"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="experienceRequired" className="block text-lg font-medium text-gray-800">Experience Required</label>
                            <input
                                type="text"
                                id="experienceRequired"
                                value={experienceRequired}
                                onChange={(e) => setExperienceRequired(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-base py-2 px-4"
                                required
                            />
                        </div>
                        <div className="mb-4 col-span-2">
                            <label htmlFor="description" className="block text-lg font-medium text-gray-800">Description</label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-base py-2 px-4"
                                rows="4"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="salary" className="block text-lg font-medium text-gray-800">Salary</label>
                            <input
                                type="text"
                                id="salary"
                                value={salary}
                                onChange={(e) => setSalary(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-base py-2 px-4"
                                required
                            />
                        </div>
                        <div className="mb-4 col-span-2">
                            <label htmlFor="additionalFields" className="block text-lg font-medium text-gray-800">Additional Fields (key:value, comma separated)</label>
                            <input
                                type="text"
                                id="additionalFields"
                                value={additionalFields}
                                onChange={(e) => setAdditionalFields(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-base py-2 px-4"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150"
                    >
                        Post Job
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateJobForm;
