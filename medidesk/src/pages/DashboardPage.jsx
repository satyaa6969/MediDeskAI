import React, { useState, useEffect } from 'react';
import PatientList from '../components/PatientList';
import PatientDetailViewer from '../components/PatientDetailViewer';
import AddPatientModal from '../components/AddPatientModal';
import { generateAIPrescription } from '../utils/aiAssistant';
import { createPrescriptionPDF } from '../utils/pdfGenerator';

const DashboardPage = () => {
    // --- STATE MANAGEMENT ---
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [doctorInfo, setDoctorInfo] = useState({ name: '', title: '', email: '' });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false); // For the AI button
    const [mcpData, setMcpData] = useState(null);
    const [isMcpLoading, setIsMcpLoading] = useState(false);

    
    useEffect(() => {
        try {
            const loggedInUserSession = JSON.parse(localStorage.getItem('loggedInUser'));
            const allUsers = JSON.parse(localStorage.getItem('users_db')) || [];
            if (loggedInUserSession && loggedInUserSession.email) {
                const currentUserData = allUsers.find(user => user.email === loggedInUserSession.email);
                if (currentUserData) {
                    setDoctorInfo({
                        name: currentUserData.fullName || '',
                        title: currentUserData.title || '',
                        email: currentUserData.email
                    });
                    const userPatients = currentUserData.patients || [];
                    setPatients(userPatients);
                    setSelectedPatient(userPatients[0] || null);
                }
            }
        } catch (error) { console.error("Failed to load user data", error); }
        finally { setIsLoading(false); }
    }, []);
    useEffect(() => {
        // Don't fetch if no patient is selected
        if (!selectedPatient) {
            setMcpData(null);
            return;
        }

        const fetchMcpData = async () => {
            setIsMcpLoading(true);
            setMcpData(null); // Clear previous patient's data

            try {
                // Fetch from our new mock backend endpoint
                const response = await fetch(`http://localhost:5000/api/mcp/patient/${selectedPatient.id}`);
                if (!response.ok) throw new Error('Network response was not ok');

                const data = await response.json();
                setMcpData(data);

            } catch (error) {
                console.error("Failed to fetch MCP data:", error);
                // Optionally, set an error state here to show in the UI
            } finally {
                setIsMcpLoading(false);
            }
        };

        fetchMcpData();

    }, [selectedPatient]);

    // --- HANDLER FUNCTIONS ---

    // A helper function to save the updated patient list to localStorage
    const updatePatientDatabase = (newPatientList) => {
        const allUsers = JSON.parse(localStorage.getItem('users_db')) || [];
        const userIndex = allUsers.findIndex(user => user.email === doctorInfo.email);
        if (userIndex !== -1) {
            allUsers[userIndex].patients = newPatientList;
            localStorage.setItem('users_db', JSON.stringify(allUsers));
            setPatients(newPatientList);
        }
    };

    const handleAddPatient = (newPatient) => {
        const updatedPatients = [...patients, newPatient];
        updatePatientDatabase(updatedPatients);
        setSelectedPatient(newPatient);
    };

    const handleRemovePatient = (patientId) => {
        if (window.confirm("Are you sure you want to remove this patient?")) {
            const updatedPatients = patients.filter(p => p.id !== patientId);
            updatePatientDatabase(updatedPatients);
            if (selectedPatient && selectedPatient.id === patientId) {
                setSelectedPatient(updatedPatients[0] || null);
            }
        }
    };

    const handleUpdatePatientHistory = (patientId, newHistoryEntry) => {
        const updatedPatients = patients.map(p => (p.id === patientId ? { ...p, history: [newHistoryEntry, ...(p.history || [])] } : p));
        updatePatientDatabase(updatedPatients);
        setSelectedPatient(updatedPatients.find(p => p.id === patientId));
    };

    const handleRemoveHistory = (patientId, historyId) => {
        const updatedPatients = patients.map(p => (p.id === patientId ? { ...p, history: p.history.filter(h => h.id !== historyId) } : p));
        updatePatientDatabase(updatedPatients);
        setSelectedPatient(updatedPatients.find(p => p.id === patientId));
    };

    const handleGeneratePrescription = async (patient) => {
        if (!patient || !patient.diagnosis) {
            alert("Please ensure the patient has a primary diagnosis.");
            return;
        }

        setIsGenerating(true);

        try {
            const prescriptionData = await generateAIPrescription(patient.diagnosis, patient);
            createPrescriptionPDF(patient, prescriptionData, doctorInfo);

        } catch (error) {
            alert("Sorry, there was an error communicating with the AI assistant. Please check the browser and backend consoles for details.");
            console.error("Full error object:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    // --- RENDER LOGIC ---
    if (isLoading) {
        return <div className="flex h-screen items-center justify-center">Loading Dashboard...</div>;
    }

    return (
        <>
            <AddPatientModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAddPatient={handleAddPatient}
            />
            <div className="flex h-screen bg-gray-100 pt-16">
                <div className="w-1/3 bg-white border-r border-gray-200 overflow-y-auto">
                    <PatientList
                        patients={patients}
                        onSelectPatient={setSelectedPatient}
                        selectedPatientId={selectedPatient ? selectedPatient.id : null}
                        onAddNew={() => setIsModalOpen(true)}
                    />
                </div>
                <div className="w-2/3 p-8 overflow-y-auto">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">
                        Welcome, {doctorInfo.title} {doctorInfo.name}
                    </h1>
                    <PatientDetailViewer
                        patient={selectedPatient}
                        mcpData={mcpData}
                        isMcpLoading={isMcpLoading}
                        isGenerating={isGenerating}
                        onRemovePatient={handleRemovePatient}
                        onAddHistory={handleUpdatePatientHistory}
                        onRemoveHistory={handleRemoveHistory}
                        onGeneratePrescription={handleGeneratePrescription}
                    />
                </div>
            </div>
        </>
    );
};

export default DashboardPage;
