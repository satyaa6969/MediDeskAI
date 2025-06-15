/**
 * Calls our LIVE Python backend on Render to generate a prescription.
 *
 * @param {string} diagnosis The patient's diagnosis.
 * @param {object} patient The full patient object for context.
 * @returns {Promise<object>} A promise that resolves to the prescription object.
 */
export const generateAIPrescription = async (diagnosis, patient) => {
    // --- THIS IS THE CRITICAL CHANGE ---
    // Replace the old localhost URL with your live Render URL
    const BACKEND_URL = 'https://medi-desk-ai-backend.onrender.com/api/generate-prescription';

    try {
        const response = await fetch(BACKEND_URL, {
            // ... the rest of the function stays the same
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ diagnosis, patient }),
        });

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