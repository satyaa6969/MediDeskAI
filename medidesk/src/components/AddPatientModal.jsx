import React, { useState } from 'react';

const AddPatientModal = ({ isOpen, onClose, onAddPatient }) => {
    // Existing state
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('Male');
    const [diagnosis, setDiagnosis] = useState('');

    // --- NEW STATE for the new fields ---
    const [symptoms, setSymptoms] = useState('');
    const [allergies, setAllergies] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        // --- PASS THE NEW DATA in the new patient object ---
        onAddPatient({
            id: Date.now(),
            name,
            age,
            gender,
            diagnosis,
            symptoms,  // Add symptoms
            allergies, // Add allergies
            history: []
        });
        onClose(); // Close modal after submission
        // Reset form completely
        setName(''); setAge(''); setGender('Male'); setDiagnosis('');
        setSymptoms(''); setAllergies(''); // Reset new fields too
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 flex justify-center items-center p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6">Add New Patient</h2>
                <form onSubmit={handleSubmit}>
                    {/* Unchanged fields: Name, Age, Gender */}
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Full Name</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 border rounded" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Age</label>
                        <input type="number" value={age} onChange={e => setAge(e.target.value)} className="w-full p-2 border rounded" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Gender</label>
                        <select value={gender} onChange={e => setGender(e.target.value)} className="w-full p-2 border rounded bg-white">
                            <option>Male</option>
                            <option>Female</option>
                            <option>Other</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Primary Diagnosis</label>
                        <input type="text" placeholder="e.g., Hypertension, Type 2 Diabetes" value={diagnosis} onChange={e => setDiagnosis(e.target.value)} className="w-full p-2 border rounded" required />
                    </div>

                    {/* --- NEW INPUT FIELDS --- */}
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Key Symptoms</label>
                        <textarea placeholder="e.g., High fever, persistent cough, headache" value={symptoms} onChange={e => setSymptoms(e.target.value)} className="w-full p-2 border rounded" rows="2"></textarea>
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2">Known Allergies</label>
                        <input type="text" placeholder="e.g., Penicillin, Aspirin (or leave blank)" value={allergies} onChange={e => setAllergies(e.target.value)} className="w-full p-2 border rounded" />
                    </div>
                    {/* --- END OF NEW FIELDS --- */}

                    <div className="flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="py-2 px-4 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
                        <button type="submit" className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700">Add Patient</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPatientModal;