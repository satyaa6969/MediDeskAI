import React, { useState } from 'react';

const AddHistoryForm = ({ patientId, onAddHistory }) => {
    const [notes, setNotes] = useState('');
    // State for the date input, defaulting to today
    const [entryDate, setEntryDate] = useState(new Date().toISOString().split('T')[0]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!notes.trim() || !entryDate) return;

        const newHistoryEntry = {
            id: Date.now(), // Unique ID for this entry, crucial for deletion
            date: entryDate,
            notes: notes,
        };

        onAddHistory(patientId, newHistoryEntry);
        setNotes(''); // Clear the form after submission
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4">
            <h4 className="text-lg font-semibold mb-2 text-gray-600">Add New History Entry</h4>

            {/* New Date Input Field */}
            <div className="mb-4">
                <label htmlFor="history-date" className="block text-sm font-medium text-gray-700">Date</label>
                <input
                    type="date"
                    id="history-date"
                    value={entryDate}
                    onChange={(e) => setEntryDate(e.target.value)}
                    className="mt-1 w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>

            {/* Existing Notes Textarea */}
            <div>
                <label htmlFor="history-notes" className="block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                    id="history-notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Enter new diagnosis, prescription, or visit notes..."
                    className="mt-1 w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    required
                ></textarea>
            </div>

            <button
                type="submit"
                className="mt-2 py-2 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
            >
                Add to History
            </button>
        </form>
    );
};

export default AddHistoryForm;