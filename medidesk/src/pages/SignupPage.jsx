import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SignupPage = () => {
    // State for all the form fields
    const [title, setTitle] = useState('Dr.');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState(''); // The address field

    // State for handling errors
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const users = JSON.parse(localStorage.getItem('users_db')) || [];

        if (users.find(user => user.email === email)) {
            setError('User with this email already exists.');
            return;
        }

        // Create the new user object with ALL the correct fields
        const newUser = {
            title,
            fullName,
            email,
            password,
            address, // Include the address
            patients: []
        };
        users.push(newUser);
        localStorage.setItem('users_db', JSON.stringify(users));

        alert('Signup successful! Please log in.');
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <div className="text-center mb-8">
                    <Link to="/" className="text-3xl font-bold text-blue-600">MediDeskAI</Link>
                    <h2 className="text-2xl font-semibold text-gray-700 mt-4">Create Your Account</h2>
                </div>

                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                <form onSubmit={handleSubmit}>
                    {/* Title Field */}
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-gray-700 font-medium mb-2">Title</label>
                        <select
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option>Dr.</option>
                            <option>Nurse</option>
                            <option>PA</option>
                            <option>Admin</option>
                        </select>
                    </div>

                    {/* Full Name Field */}
                    <div className="mb-4">
                        <label htmlFor="fullname" className="block text-gray-700 font-medium mb-2">Full Name</label>
                        <input type="text" id="fullname" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                    </div>

                    {/* Email Field */}
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email Address</label>
                        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border rounded-lg" required />
                    </div>

                    {/* Password Field */}
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-700 font-medium mb-2">Password</label>
                        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border rounded-lg" required />
                    </div>

                    {/* Address Field */}
                    <div className="mb-6">
                        <label htmlFor="address" className="block text-gray-700 font-medium mb-2">Clinic Address</label>
                        <input
                            type="text"
                            id="address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., 123 Health St, Wellness City"
                            required
                        />
                    </div>

                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-semibold">Create Account</button>
                </form>

                <p className="text-center text-gray-600 mt-6">
                    Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Log in</Link>
                </p>
            </div>
        </div>
    );
};

export default SignupPage;