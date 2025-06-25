export const generateAIPrescription = async (patient, mcpData) => {
    // This MUST point to your live Render backend for deployment.
    const BACKEND_URL = 'https://medi-desk-ai-backend.onrender.com/api/generate-prescription';

    try {
        const response = await fetch(BACKEND_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // This sends the complete data package.
            body: JSON.stringify({ patient, mcpData }),
        });
        if (!response.ok) {
            console.error(`Backend error! Status: ${response.status}`);
            return null;
        }
        return await response.json();
    } catch (error) {
        console.error("Could not fetch prescription from the backend:", error);
        return null;
    }
};
