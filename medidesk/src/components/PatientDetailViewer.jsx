import React, { useState, useEffect } from 'react';
import AddHistoryForm from './AddHistoryForm';

const PatientDetailViewer = ({
                                 patient,
                                 mcpData,
                                 isMcpLoading,
                                 isGenerating,
                                 onRemovePatient,
                                 onAddHistory,
                                 onRemoveHistory,
                                 onGeneratePrescription // This is now a simple trigger
                             }) => {

    // This component's only job is to display data and trigger events.
    // All logic for this component to display data is correct.
    const [editableMcpData, setEditableMcpData] = useState(null);
    useEffect(() => { if (mcpData) { setEditableMcpData(mcpData); } }, [mcpData]);

    if (!patient) {
        return <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg"><p className="text-gray-500 text-lg">Select a patient to view details.</p></div>;
    }

    // The display part of the component...
    return (
        <div className="bg-white p-6 rounded-lg shadow-md relative">
            <div className="flex items-start justify-between mb-4"><h1 className="text-3xl font-bold text-blue-600 pr-4">{patient.name}</h1><button onClick={() => onRemovePatient(patient.id)} className="flex-shrink-0 bg-red-100 text-red-600 text-sm font-bold py-2 px-3 rounded-lg hover:bg-red-200 transition-colors">Remove Patient</button></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 mb-6"><div className="mb-2"><span className="font-semibold text-gray-600">Age: </span><span className="text-gray-800">{patient.age}</span></div><div className="mb-2"><span className="font-semibold text-gray-600">Gender: </span><span className="text-gray-800">{patient.gender}</span></div><div className="mb-2"><span className="font-semibold text-gray-600">Primary Diagnosis: </span><span className="text-gray-800">{patient.diagnosis}</span></div></div>
            <div className="my-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-700">External Record <span className="text-sm font-medium text-blue-600">(MCP/FHIR)</span></h3>
                <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
                    {isMcpLoading && <p className="text-blue-700 animate-pulse">Loading data from MCP server...</p>}
                    {editableMcpData && !isMcpLoading && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium text-gray-700">Blood Type</label><input type="text" name="bloodType" value={editableMcpData.bloodType} readOnly className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"/></div>
                                <div><label className="block text-sm font-medium text-gray-700">Last Checkup</label><input type="text" name="lastCheckupDate" value={editableMcpData.lastCheckupDate} readOnly className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"/></div>
                                <div><label className="block text-sm font-medium text-gray-700">Blood Pressure</label><input type="text" name="bloodPressure" value={editableMcpData.recentVitals.bloodPressure} readOnly className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"/></div>
                                <div><label className="block text-sm font-medium text-gray-700">Heart Rate</label><input type="text" name="heartRate" value={editableMcpData.recentVitals.heartRate} readOnly className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"/></div>
                            </div>
                            <div className="md:col-span-2 mt-2 bg-red-50 border border-red-200 p-3 rounded-lg"><p className="block text-sm font-medium text-red-800">Critical Alerts (Read-Only)</p><ul className="list-disc list-inside text-red-700 pl-2 mt-1">{editableMcpData.importantAlerts.map((alert, index) => ( <li key={index} className="text-sm">{alert}</li> ))}</ul></div>
                        </div>
                    )}
                </div>
            </div>

            <div className="my-6">
                <button

                    onClick={() => onGeneratePrescription(patient)}
                    disabled={isGenerating}
                    className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-lg disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center justify-center">
                    {isGenerating ? "Generating..." : "⚡ Generate AI Prescription (PDF)"}
                </button>
            </div>

            <div><h3 className="text-xl font-semibold mb-2 text-gray-700">Medical History</h3><div className="bg-gray-50 p-4 rounded-md">{patient.history && patient.history.length > 0 ? (<ul className="space-y-3">{patient.history.map((record) => (<li key={record.id} className="flex justify-between items-start border-b border-gray-200 pb-2"><div><strong className="text-gray-600">{record.date}:</strong><p className="text-gray-800 ml-1 whitespace-pre-wrap">{record.notes}</p></div><button onClick={() => onRemoveHistory(patient.id, record.id)} className="text-red-500 hover:text-red-700 text-xs font-semibold ml-4 flex-shrink-0 mt-1" title="Remove this entry">REMOVE</button></li>))}</ul>) : ( <p className="text-gray-500">No history records found.</p> )}<div className="mt-6 border-t pt-4"><AddHistoryForm patientId={patient.id} onAddHistory={onAddHistory}/></div></div></div>
        </div>
    );
};

export default PatientDetailViewer;
