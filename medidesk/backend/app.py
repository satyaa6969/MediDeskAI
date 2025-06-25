import os
import time
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from groq import Groq

load_dotenv()
app = Flask(__name__)
CORS(app)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

@app.route('/api/generate-prescription', methods=['POST'])
def generate_prescription_route():
    data = request.json
    patient = data.get('patient')
    mcp_data = data.get('mcpData')

    if not patient or not patient.get('diagnosis'):
        return jsonify({"error": "Diagnosis and patient data are required"}), 400

    history_summary = "No previous medical history provided."
    if patient.get('history'):
        history_summary = "\n- ".join([f"{record.get('date')}: {record.get('notes')}" for record in patient['history']])
        history_summary = "- " + history_summary

    mcp_summary = "No external data provided."
    if mcp_data:
        vitals = mcp_data.get('recentVitals', {})
        alerts = mcp_data.get('importantAlerts', [])
        mcp_summary = f"""- Blood Type: {mcp_data.get('bloodType', 'N/A')}
    - Last Recorded Vitals: BP {vitals.get('bloodPressure', 'N/A')}, HR {vitals.get('heartRate', 'N/A')}
    - CRITICAL ALERTS FROM CENTRAL RECORD: {', '.join(alerts) if alerts else "None"}"""

    prompt = f"""You are an expert medical AI consultant. Your task is to generate a safe prescription by synthesizing ALL available data.

    **Patient Information (from Doctor's Notes):**
    - Name: {patient.get('name')}
    - Age: {patient.get('age')}
    - Diagnosis: "{patient.get('diagnosis')}"

    **Patient's Medical History (from Doctor's Notes):**
    {history_summary}

    **External MCP/FHIR Record (from Central Hospital System):**
    {mcp_summary}

    **Your Critical Task:**
    Synthesize BOTH the doctor's notes AND the external record.
    - **CROSS-REFERENCE:** Pay extremely close attention to the "CRITICAL ALERTS" from the external record. If an alert mentions an allergy (e.g., to Penicillin), you MUST NOT prescribe that class of drug.
    - **ANALYZE VITALS:** Use the vitals to confirm your decision.
    - **LOGICAL NEXT STEP:** Based on all information, suggest the most logical treatment.

    Respond ONLY with a JSON object in the following format:
    {{
      "medication": "string",
      "dosage": "string",
      "instructions": "string"
    }}
    """
    try:
        completion = client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[
                {"role": "system", "content": "You are a helpful medical prescription assistant that only responds in JSON format."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"}
        )
        return completion.choices[0].message.content, 200, {'Content-Type': 'application/json'}
    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({"error": "Failed to communicate with AI service"}), 500

@app.route('/api/mcp/patient/<patient_id>', methods=['GET'])
def get_mcp_patient_data(patient_id):
    # This is the reliable mock server. It will always work.
    mock_profiles = [
        {"bloodType": "A-", "lastCheckupDate": "2024-03-10", "recentVitals": {"bloodPressure": "145/92 mmHg", "heartRate": "85 bpm"}, "importantAlerts": ["Patient has a known allergy to Penicillin.", "Monitor for hypertension."]},
        {"bloodType": "O+", "lastCheckupDate": "2024-01-20", "recentVitals": {"bloodPressure": "120/80 mmHg", "heartRate": "70 bpm"}, "importantAlerts": ["No significant alerts."]},
        {"bloodType": "B+", "lastCheckupDate": "2024-02-05", "recentVitals": {"bloodPressure": "125/82 mmHg", "heartRate": "78 bpm"}, "importantAlerts": ["Requires annual cardiovascular screening."]},
    ]
    profile_index = hash(patient_id) % len(mock_profiles)
    time.sleep(1.5)
    return jsonify(mock_profiles[profile_index])

if __name__ == '__main__':
    app.run(port=5000, debug=True)
