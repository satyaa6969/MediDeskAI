import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <>
            {/* Hero Section */}
            <header className="bg-blue-600 text-white pt-32 pb-20">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">Revolutionizing Healthcare with AI</h1>
                    <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                        Our platform provides intelligent diagnostics, streamlined patient management, and predictive insights.
                    </p>
                    <Link to="/signup" className="bg-white text-blue-600 font-bold py-3 px-8 rounded-full text-lg hover:bg-gray-100 transition duration-300">
                        Get Started Today
                    </Link>
                </div>
            </header>

            {/* Features Section */}
            <section className="py-20">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center mb-12">Core Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="bg-white p-8 rounded-lg shadow-lg">
                            <h3 className="text-xl font-bold mb-2">AI Diagnostics</h3>
                            <p className="text-gray-600">Leverage advanced AI for faster, more accurate diagnostics.</p>
                        </div>
                        <div className="bg-white p-8 rounded-lg shadow-lg">
                            <h3 className="text-xl font-bold mb-2">Patient Management</h3>
                            <p className="text-gray-600">A centralized system to manage patient records and appointments.</p>
                        </div>
                        <div className="bg-white p-8 rounded-lg shadow-lg">
                            <h3 className="text-xl font-bold mb-2">Predictive Analytics</h3>
                            <p className="text-gray-600">Use data-driven insights to predict patient outcomes.</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default HomePage;