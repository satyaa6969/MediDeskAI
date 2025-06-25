import React, { useState, useEffect } from 'react';
import PatientList from '../components/PatientList';
import PatientDetailViewer from '../components/PatientDetailViewer';
import AddPatientModal from '../components/AddPatientModal';
import { generateAIPrescription } from '../utils/aiAssistant';
import { createPrescriptionPDF } from '../utils/pdfGenerator';

const DashboardPage = () => {
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [doctorInfo, setDoctorInfo] = useState({ name: '', title: '', email: '' });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [mcpData, setMcpData] = useState(null);
    const [isMcpLoading, setIsMcpLoading] = useState(false);

    useEffect(() => {
        try {
            const loggedInUserSession = JSON.parse(localStorage.getItem('loggedInUser'));
            const allUsers = JSON.parse(localStorage.getItem('users_db')) || [];
            if (loggedInUserSession && loggedInUserSession.email) {
                const currentUserData = allUsers.find(user => user.email === loggedInUserSession.email);
                if (currentUserData) {
                    setDoctorInfo({ name: currentUserData.fullName || '', title: currentUserData.title || '', email: currentUserData.email });
                    const userPatients = currentUserData.patients || [];
                    setPatients(userPatients);
                    setSelectedPatient(userPatients[0] || null);
                }
            }
        } catch (error) { console.error("Failed to load user data", error); }
        finally { setIsLoading(false); }
    }, []);

    useEffect(() => {
        if (!selectedPatient) { setMcpData(null); return; }
        const fetchMcpData = async () => {
            setIsMcpLoading(true); setMcpData(null);
            try {
                const response = await fetch(`http://localhost:5000/api/mcp/patient/${selectedPatient.id}`);
                if (!response.ok) throw new Error('Network response was not ok');
                setMcpData(await response.json());
            } catch (error) { console.error("Failed to fetch MCP data:", error); }
            finally { setIsMcpLoading(false); }
        };
        fetchMcpData();
    }, [selectedPatient]);

    const updatePatientDatabase = (newPatientList) => {
        const allUsers = JSON.parse(localStorage.getItem('users_db')) || [];
        const userIndex = allUsers.findIndex(user => user.email === doctorInfo.email);
        if (userIndex !== -1) {
            allUsers[userIndex].patients = newPatientList;
            localStorage.setItem('users_db', JSON.stringify(allUsers));
        }
    };

    const handleAddPatient = (newPatient) => {
        setPatients(prev => {
            const updated = [...prev, newPatient];
            updatePatientDatabase(updated);
            setSelectedPatient(newPatient);
            return updated;
        });
    };

    const handleRemovePatient = (patientId) => {
        if (window.confirm("Are you sure?")) {
            setPatients(prev => {
                const updated = prev.filter(p => p.id !== patientId);
                updatePatientDatabase(updated);
                if (selectedPatient && selectedPatient.id === patientId) {
                    setSelectedPatient(updated[0] || null);
                }
                return updated;
            });
        }
    };

    const handleUpdatePatientHistory = (patientId, newHistoryEntry) => {
        setPatients(prev => {
            const updated = prev.map(p => (p.id === patientId ? { ...p, history: [newHistoryEntry, ...(p.history || [])] } : p));
            updatePatientDatabase(updated);
            setSelectedPatient(updated.find(p => p.id === patientId));
            return updated;
        });
    };

    const handleGeneratePrescription = async (patient) => {
        if (!patient || !patient.diagnosis) { alert("Please select a patient with a diagnosis."); return; }
        if (!mcpData) { alert("External data is still loading. Please wait a moment."); return; }
        setIsGenerating(true);
        try {
            const prescriptionData = await generateAIPrescription(patient, mcpData);
            if (prescriptionData) {
                createPrescriptionPDF(patient, prescriptionData, doctorInfo);
            } else { alert("AI failed to return a valid prescription."); }
        } catch (error) { console.error("Error in prescription flow:", error); alert("A critical error occurred."); }
        finally { setIsGenerating(false); }
    };

    if (isLoading) { return <div className="flex h-screen items-center justify-center">Loading Dashboard...</div>; }
    return (
        <>
            <AddPatientModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddPatient={handleAddPatient} />
            <div className="flex h-screen bg-gray-100 pt-16">
                <div className="w-1/3 bg-white border-r border-gray-200 overflow-y-auto">
                    <PatientList patients={patients} onSelectPatient={setSelectedPatient} selectedPatientId={selectedPatient?.id} onAddNew={() => setIsModalOpen(true)} />
                </div>
                <div className="w-2/3 p-8 overflow-y-auto">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome, {doctorInfo.title} {doctorInfo.name}</h1>
                    <PatientDetailViewer
                        patient={selectedPatient} mcpData={mcpData} isMcpLoading={isMcpLoading} isGenerating={isGenerating}
                        onRemovePatient={handleRemovePatient} onAddHistory={handleUpdatePatientHistory}
                        onGeneratePrescription={handleGeneratePrescription}
                    />
                </div>
            </div>
        </>
    );
};
export default DashboardPage;
