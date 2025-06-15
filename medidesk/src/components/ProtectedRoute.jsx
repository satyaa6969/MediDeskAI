import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const loggedInUser = localStorage.getItem('loggedInUser');

    if (!loggedInUser) {
        // If no user is logged in, redirect to the login page
        return <Navigate to="/login" />;
    }

    // If user is logged in, render the component they are trying to access
    return children;
};

export default ProtectedRoute;