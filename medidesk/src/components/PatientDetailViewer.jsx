import React from 'react';
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
                                 isGenerating,
                                 onRemovePatient,
                                 onAddHistory,
                                 onRemoveHistory,
                                 onGeneratePrescription
                             }) => {
    // Display a placeholder if no patient is selected
    if (!patient) {
        return (
            <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
                <p className="text-gray-500 text-lg">Select a patient to view details or add a new one.</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md relative">
            <div className="flex items-start justify-between mb-4">
                {/* Patient Name */}
                <h1 className="text-3xl font-bold text-blue-600 pr-4">{patient.name}</h1>

                {/* Remove Patient Button */}
                <button
                    onClick={() => onRemovePatient(patient.id)}
                    className="flex-shrink-0 bg-red-100 text-red-600 text-sm font-bold py-2 px-3 rounded-lg hover:bg-red-200 transition-colors"
                >
                    Remove Patient
                </button>
            </div>

            {/* Patient Vitals/Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 mb-6">
                <DetailItem label="Age" value={patient.age} />
                <DetailItem label="Gender" value={patient.gender} />
                <DetailItem label="Primary Diagnosis" value={patient.diagnosis} />
            </div>

            {/* AI Prescription Button */}
            <div className="my-6">
                <button
                    onClick={() => onGeneratePrescription(patient)}
                    disabled={isGenerating}
                    className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-lg disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {isGenerating ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Generating...
                        </>
                    ) : (
                        '⚡ Generate AI Prescription (PDF)'
                    )}
                </button>
            </div>

            {/* Medical History Section */}
            <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-700">Medical History</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                    {/* List of existing history entries */}
                    {patient.history && patient.history.length > 0 ? (
                        <ul className="space-y-3">
                            {patient.history.map((record) => (
                                <li key={record.id} className="flex justify-between items-start border-b border-gray-200 pb-2">
                                    <div>
                                        <strong className="text-gray-600">{record.date}:</strong>
                                        <p className="text-gray-800 ml-1 whitespace-pre-wrap">{record.notes}</p>
                                    </div>
                                    <button
                                        onClick={() => onRemoveHistory(patient.id, record.id)}
                                        className="text-red-500 hover:text-red-700 text-xs font-semibold ml-4 flex-shrink-0 mt-1"
                                        title="Remove this entry"
                                    >
                                        REMOVE
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">No history records found.</p>
                    )}

                    {/* Form to add a new history entry */}
                    <div className="mt-6 border-t pt-4">
                        <AddHistoryForm
                            patientId={patient.id}
                            onAddHistory={onAddHistory}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientDetailViewer;