// src/utils/aiAssistant.js

export const generateAIPrescription = async (diagnosis, patient) => {
    // THIS IS THE INTEGRATION. It's the full address of your Python server's API endpoint.
    const BACKEND_URL = 'http://localhost:5000/api/generate-prescription';

    try {
        // Your React app sends a POST request with the patient's data...
        const response = await fetch(BACKEND_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ diagnosis, patient }),
        });

        // ...and then it waits for the backend to send back the AI's response.
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const prescriptionData = await response.json();
        return prescriptionData;

    } catch (error) {
        console.error("Could not fetch prescription from the backend:", error);
        throw error;
    }
};