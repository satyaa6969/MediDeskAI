import os
import time
import requests
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

    if not patient or not patient.get('diagnosis'):
        return jsonify({"error": "Diagnosis and patient data are required"}), 400

    history_records = patient.get('history', [])
    if history_records:
        history_summary = "\n- ".join([f"{record.get('date')}: {record.get('notes')}" for record in history_records])
        history_summary = "- " + history_summary
    else:
        history_summary = "No previous medical history provided for this condition."

    prompt = f"""
    You are an expert medical AI assistant. Your task is to act as a consultant and suggest the next course of action by generating a prescription based on a patient's complete record.

    **Patient Information:**
    - Name: {patient.get('name')}
    - Age: {patient.get('age')}
    - Gender: {patient.get('gender')}
    - Primary Diagnosis: "{patient.get('diagnosis')}"
    - Reported Symptoms: "{patient.get('symptoms', 'Not provided')}"
    - Known Allergies: "{patient.get('allergies', 'None reported')}"

    **Patient's Medical History (in chronological order):**
    {history_summary}

    **Your Critical Task:**
    Analyze the patient's entire medical history to understand the progression of their condition.
    - If the history indicates a previous treatment was ineffective or the condition is worsening, suggest a logical next step (e.g., a different medication, a stronger dosage, or adding a supplementary treatment).
    - If the history shows improvement, suggest continuing the effective treatment, possibly with a note about monitoring.
    - If there is no history, provide a standard, first-line treatment for the primary diagnosis.
    - **CRITICAL:** Always respect the 'Known Allergies'.
    - If there is no primary diagnosis or the primary diagnosis is not a real disease then generate an error or leave a blank prescription

    Respond ONLY with a JSON object in the following format, with no other text, comments, or explanations:
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
                {"role": "system",
                 "content": "You are a helpful medical prescription assistant that only responds in JSON format."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"}
        )

        prescription_data = completion.choices[0].message.content
        return prescription_data, 200, {'Content-Type': 'application/json'}

    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({"error": "Failed to communicate with AI service"}), 500


@app.route('/api/mcp/patient/<patient_id>', methods=['GET'])
def get_mcp_patient_data(patient_id):
    """
    This is the REAL implementation.
    It calls an external FHIR server to get live patient data.
    """
    FHIR_SERVER_URL = os.getenv("FHIR_SERVER_BASE_URL")


    headers = {
        'Content-Type': 'application/fhir+json',

    }


    try:

        patient_url = f"{FHIR_SERVER_URL}/Patient/1215255"
        patient_response = requests.get(patient_url, headers=headers)
        patient_response.raise_for_status()
        patient_data = patient_response.json()


        allergy_url = f"{FHIR_SERVER_URL}/AllergyIntolerance?patient=1215255"
        allergy_response = requests.get(allergy_url, headers=headers)
        allergy_response.raise_for_status()
        allergy_data = allergy_response.json()

    except requests.exceptions.RequestException as e:
        print(f"Error fetching data from FHIR server: {e}")
        return jsonify({"error": "Failed to communicate with the external medical record server."}), 503


    try:

        alerts = []
        if allergy_data.get("entry"):
            for entry in allergy_data["entry"]:
                substance = entry["resource"]["code"]["text"]
                alerts.append(f"Known allergy to: {substance}")


        if not alerts:
            alerts.append("No allergies reported on external server.")


        transformed_data = {
            "bloodType": patient_data.get("multipleBirthBoolean", "Not Available"),
            "lastCheckupDate": patient_data.get("meta", {}).get("lastUpdated", "N/A").split('T')[0],
            "recentVitals": {
                "bloodPressure": "120/80 mmHg (Sample)",
                "heartRate": "75 bpm (Sample)",
                "temperature": "37.0°C (Sample)"
            },
            "importantAlerts": alerts
        }
        return jsonify(transformed_data)

    except (KeyError, IndexError) as e:
        print(f"Error parsing the FHIR response: {e}")
        return jsonify({"error": "The format of the external medical data was unexpected."}), 500


@app.route('/api/mcp/patient/<patient_id>/update-vitals', methods=['POST'])
def update_mcp_patient_data(patient_id):

    updated_data = request.json

    print(f"--- Mock MCP Server: Received request to UPDATE patient_id: {patient_id} ---")
    print(f"--- New Data Received: {updated_data} ---")


    time.sleep(1.5)


    print("--- Update successful. ---")
    return jsonify({"status": "success", "message": "Patient records updated on external server."})




if __name__ == '__main__':
    app.run(port=5000, debug=True)
