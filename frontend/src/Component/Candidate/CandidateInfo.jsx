import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'

const CandidateInfo = () => {
    const navigate = useNavigate();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [resume, setResume] = useState(null);
    const [linkedinProfile, setLinkedinProfile] = useState('');
    const [portfolio, setPortfolio] = useState('');
    const [skills, setSkills] = useState([]);
    const [newSkill, setNewSkill] = useState('');
    const [experience, setExperience] = useState([{ company: '', role: '', startDate: '', endDate: '', description: '' }]);
    const [education, setEducation] = useState([{ institution: '', degree: '', startDate: '', endDate: '', description: '' }]);

    const handleClick = async () => {
        try {
            const user = localStorage.getItem('user');
            const formData = new FormData();
            formData.append('user', user);
            formData.append("phoneNumber", phoneNumber);
            formData.append("address", address);
            formData.append("linkedinProfile", linkedinProfile);
            formData.append("portfolio", portfolio);
            formData.append("skills", JSON.stringify(skills));
            formData.append("experience", JSON.stringify(experience));
            formData.append("education", JSON.stringify(education));

            if (resume) {
                formData.append("resume", resume);
            }

            const response = await axios.post("http://localhost:5000/candidate/create-candidate", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.status) {
                localStorage.setItem("candidate", response.data.candidate._id);
                localStorage.setItem('success', 'Candidate created successfully!');
                navigate('/')

            } else {
                toast.error('Unexpected response from server.');
                console.error('Unexpected response:', response.data);
            }
        } catch (error) {
            toast.error(`Error creating candidate: ${error.response ? error.response.data.msg : error.message}`);
            console.error('Error creating candidate:', error.response ? error.response.data : error.message);
        }
    };

    const handleAddExperience = () => {
        setExperience([...experience, { company: '', role: '', startDate: '', endDate: '', description: '' }]);
    };

    const handleAddEducation = () => {
        setEducation([...education, { institution: '', degree: '', startDate: '', endDate: '', description: '' }]);
    };

    const handleChangeExperience = (index, field, value) => {
        const updatedExperience = [...experience];
        updatedExperience[index][field] = value;
        setExperience(updatedExperience);
    };

    const handleChangeEducation = (index, field, value) => {
        const updatedEducation = [...education];
        updatedEducation[index][field] = value;
        setEducation(updatedEducation);
    };

    const handleSkillChange = (e) => {
        setNewSkill(e.target.value);
    };

    const handleAddSkill = () => {
        if (newSkill && !skills.includes(newSkill)) {
            setSkills([...skills, newSkill]);
            setNewSkill(''); // Clear input after adding
        }
    };

    const handleRemoveSkill = (skill) => {
        setSkills(skills.filter(s => s !== skill));
    };

    const handleFileChange = (e) => {
        setResume(e.target.files[0]); // Update state with the selected file
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Candidate Information</h2>
                <form
                    onSubmit={(e) => { e.preventDefault(); handleClick(); }}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                        <input
                            type="text"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Address</label>
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Resume</label>
                        <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                            className="mt-1 block w-full text-sm text-gray-500 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-md file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        />
                        {resume && <p className="mt-2 text-sm text-gray-500">Selected file: {resume.name}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">LinkedIn Profile</label>
                        <input
                            type="text"
                            value={linkedinProfile}
                            onChange={(e) => setLinkedinProfile(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Portfolio</label>
                        <input
                            type="text"
                            value={portfolio}
                            onChange={(e) => setPortfolio(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Skills</label>
                        <div className="flex flex-col mb-2">
                            <input
                                type="text"
                                value={newSkill}
                                onChange={handleSkillChange}
                                placeholder="Add a skill"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            <button
                                type="button"
                                onClick={handleAddSkill}
                                className="mt-2 py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Add Skill
                            </button>
                        </div>
                        <ul>
                            {skills.map(skill => (
                                <li key={skill} className="flex justify-between items-center mb-1">
                                    {skill}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveSkill(skill)}
                                        className="text-red-500"
                                    >
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Experience</label>
                        {experience.map((exp, index) => (
                            <div key={index} className="mb-4 border p-4 rounded-md">
                                <input
                                    type="text"
                                    placeholder="Company"
                                    value={exp.company}
                                    onChange={(e) => handleChangeExperience(index, 'company', e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mb-2"
                                />
                                <input
                                    type="text"
                                    placeholder="Role"
                                    value={exp.role}
                                    onChange={(e) => handleChangeExperience(index, 'role', e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mb-2"
                                />
                                <input
                                    type="date"
                                    placeholder="Start Date"
                                    value={exp.startDate}
                                    onChange={(e) => handleChangeExperience(index, 'startDate', e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mb-2"
                                />
                                <input
                                    type="date"
                                    placeholder="End Date"
                                    value={exp.endDate}
                                    onChange={(e) => handleChangeExperience(index, 'endDate', e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mb-2"
                                />
                                <textarea
                                    placeholder="Description"
                                    value={exp.description}
                                    onChange={(e) => handleChangeExperience(index, 'description', e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setExperience(experience.filter((_, i) => i !== index))}
                                    className="text-red-500 mt-2"
                                >
                                    Remove Experience
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={handleAddExperience}
                            className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Add Experience
                        </button>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Education</label>
                        {education.map((edu, index) => (
                            <div key={index} className="mb-4 border p-4 rounded-md">
                                <input
                                    type="text"
                                    placeholder="Institution"
                                    value={edu.institution}
                                    onChange={(e) => handleChangeEducation(index, 'institution', e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mb-2"
                                />
                                <input
                                    type="text"
                                    placeholder="Degree"
                                    value={edu.degree}
                                    onChange={(e) => handleChangeEducation(index, 'degree', e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mb-2"
                                />
                                <input
                                    type="date"
                                    placeholder="Start Date"
                                    value={edu.startDate}
                                    onChange={(e) => handleChangeEducation(index, 'startDate', e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mb-2"
                                />
                                <input
                                    type="date"
                                    placeholder="End Date"
                                    value={edu.endDate}
                                    onChange={(e) => handleChangeEducation(index, 'endDate', e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mb-2"
                                />
                                <textarea
                                    placeholder="Description"
                                    value={edu.description}
                                    onChange={(e) => handleChangeEducation(index, 'description', e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setEducation(education.filter((_, i) => i !== index))}
                                    className="text-red-500 mt-2"
                                >
                                    Remove Education
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={handleAddEducation}
                            className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Add Education
                        </button>
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Submit
                    </button>
                </form>
                <ToastContainer />
            </div>
        </div>
    );
};

export default CandidateInfo;
