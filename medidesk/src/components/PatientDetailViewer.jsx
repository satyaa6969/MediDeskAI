import React, { useState, useEffect } from 'react'; // <-- Import useState and useEffect
import AddHistoryForm from './AddHistoryForm';

// A small helper component for consistent styling
const DetailItem = ({ label, value }) => (
    <div className="mb-2">
        <span className="font-semibold text-gray-600">{label}: </span>
        <span className="text-gray-800">{value}</span>
    </div>
);


const PatientDetailViewer = ({
                                 patient,
                                 mcpData,
                                 isMcpLoading,
                                 isGenerating,
                                 onRemovePatient,
                                 onAddHistory,
                                 onRemoveHistory,
                                 onGeneratePrescription
                             }) => {


    const [editableMcpData, setEditableMcpData] = useState(null);
    const [isSaving, setIsSaving] = useState(false);


    useEffect(() => {

        if (mcpData) {
            setEditableMcpData(mcpData);
        }
    }, [mcpData]);

    const handleDataChange = (e) => {
        const { name, value } = e.target;

        // Handle nested 'recentVitals' object
        if (name === "bloodPressure" || name === "heartRate") {
            setEditableMcpData(prev => ({
                ...prev,
                recentVitals: { ...prev.recentVitals, [name]: value }
            }));
        } else {
            setEditableMcpData(prev => ({ ...prev, [name]: value }));
        }
    };


    const handleUpdateMcpData = async () => {
        setIsSaving(true);
        try {
            const response = await fetch(`http://localhost:5000/api/mcp/patient/${patient.id}/update-vitals`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editableMcpData)
            });

            if (!response.ok) throw new Error('Server update failed');

            const result = await response.json();
            alert(result.message); // Show a success message

        } catch (error) {
            console.error("Failed to update MCP data:", error);
            alert("Failed to save updated data to the server.");
        } finally {
            setIsSaving(false);
        }
    };


    if (!patient) {
        return <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg"><p className="text-gray-500 text-lg">Select a patient to view details.</p></div>;
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md relative">
            {/* ... The top part with patient name and vitals remains the same ... */}
            <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl font-bold text-blue-600 pr-4">{patient.name}</h1>
                <button onClick={() => onRemovePatient(patient.id)} className="flex-shrink-0 bg-red-100 text-red-600 text-sm font-bold py-2 px-3 rounded-lg hover:bg-red-200 transition-colors">Remove Patient</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 mb-6">
                <DetailItem label="Age" value={patient.age} />
                <DetailItem label="Gender" value={patient.gender} />
                <DetailItem label="Primary Diagnosis" value={patient.diagnosis} />
            </div>


            <div className="my-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-700">External Record <span className="text-sm font-medium text-blue-600">(MCP/FHIR)</span></h3>
                <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
                    {isMcpLoading && <p className="text-blue-700 animate-pulse">Loading data from MCP server...</p>}


                    {editableMcpData && !isMcpLoading && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Blood Pressure</label>
                                    <input type="text" name="bloodPressure" value={editableMcpData.recentVitals.bloodPressure} onChange={handleDataChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Heart Rate</label>
                                    <input type="text" name="heartRate" value={editableMcpData.recentVitals.heartRate} onChange={handleDataChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                                </div>
                            </div>
                            <div>
                                <p className="font-medium text-gray-700">Alerts: <span className="text-sm text-red-600 font-normal">{editableMcpData.importantAlerts.join(', ')}</span></p>
                                <p className="text-xs text-gray-500 mt-1">Note: Critical alerts like allergies are typically managed in a separate, dedicated system and are shown here for reference.</p>
                            </div>
                            <button onClick={handleUpdateMcpData} disabled={isSaving} className="w-full mt-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed">
                                {isSaving ? 'Saving...' : 'Save Vitals to MCP Server'}
                            </button>
                        </div>
                    )}
                </div>
            </div>


            <div className="my-6">
                <button onClick={() => onGeneratePrescription(patient)} disabled={isGenerating} className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-lg disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center justify-center">
                    {isGenerating ? ( <> <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle> <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path> </svg> Generating... </> ) : ( '⚡ Generate AI Prescription (PDF)' )}
                </button>
            </div>
            <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-700">Medical History</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                    {patient.history && patient.history.length > 0 ? (
                        <ul className="space-y-3">
                            {patient.history.map((record) => (
                                <li key={record.id} className="flex justify-between items-start border-b border-gray-200 pb-2">
                                    <div>
                                        <strong className="text-gray-600">{record.date}:</strong>
                                        <p className="text-gray-800 ml-1 whitespace-pre-wrap">{record.notes}</p>
                                    </div>
                                    <button onClick={() => onRemoveHistory(patient.id, record.id)} className="text-red-500 hover:text-red-700 text-xs font-semibold ml-4 flex-shrink-0 mt-1" title="Remove this entry">REMOVE</button>
                                </li>
                            ))}
                        </ul>
                    ) : ( <p className="text-gray-500">No history records found.</p> )}
                    <div className="mt-6 border-t pt-4">
                        <AddHistoryForm patientId={patient.id} onAddHistory={onAddHistory}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientDetailViewer;
