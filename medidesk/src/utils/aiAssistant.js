/**
 * Calls our LIVE Python backend on Render to generate a prescription.
 */
export const generateAIPrescription = async (diagnosis, patient) => {
   
    const BACKEND_URL = 'https://medi-desk-ai-backend.onrender.com/api/generate-prescription';

    try {
        const response = await fetch(BACKEND_URL, {
            
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
