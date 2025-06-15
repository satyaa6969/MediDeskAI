import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const loggedInUser = localStorage.getItem('loggedInUser');

    const handleLogout = () => {
        localStorage.removeItem('loggedInUser');
        navigate('/');
        window.location.reload();
    };

    return (
        <nav className="bg-white shadow-md fixed w-full z-20 top-0">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link to={loggedInUser ? "/dashboard" : "/"} className="text-2xl font-bold text-blue-600">
                    MediDeskAI
                </Link>

                {loggedInUser ? (
                    <div className="hidden md:flex space-x-6 items-center">
                        <NavLink to="/dashboard" className="text-gray-600 hover:text-blue-500">Dashboard</NavLink>
                        <button onClick={handleLogout} className="bg-red-500 text-white py-2 px-4 rounded-full hover:bg-red-600">
                            Logout
                        </button>
                    </div>
                ) : (
                    <div className="hidden md:flex space-x-6 items-center">
                        <NavLink to="/login" className="text-gray-600 hover:text-blue-500">Login</NavLink>
                        <Link to="/signup" className="bg-blue-600 text-white py-2 px-4 rounded-full hover:bg-blue-700">
                            Sign Up
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;