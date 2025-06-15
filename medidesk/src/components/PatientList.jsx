import React from 'react';

const PatientList = ({ patients, onSelectPatient, selectedPatientId, onAddNew }) => {
    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Patients ({patients.length})</h2>
                <button
                    onClick={onAddNew}
                    className="bg-blue-600 text-white text-sm font-bold py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    + Add New
                </button>
            </div>
            {patients.length > 0 ? (
                <ul>
                    {patients.map(patient => (
                        <li key={patient.id}>
                            <button
                                onClick={() => onSelectPatient(patient)}
                                className={`w-full text-left p-3 my-1 rounded-lg transition-colors duration-200 ${
                                    selectedPatientId === patient.id
                                        ? 'bg-blue-500 text-white shadow-md'
                                        : 'hover:bg-gray-200'
                                }`}
                            >
                                <div className="font-semibold">{patient.name}</div>
                                <div className="text-sm opacity-80">{patient.diagnosis}</div>
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500 text-center mt-10">No patients found. Click "Add New" to get started.</p>
            )}
        </div>
    );
};

export default PatientList;