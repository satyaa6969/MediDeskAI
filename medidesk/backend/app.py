import os
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
        # We'll format it like a list. The `\n- ` creates a new bullet point on a new line.
        history_summary = "\n- ".join([f"{record.get('date')}: {record.get('notes')}" for record in history_records])
        history_summary = "- " + history_summary  # Add the first bullet point
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
    - If an illness needs more than 1 medicine, specify the name and dosage of all the required medicines.

    Respond ONLY with a JSON object in the following format, with no other text, comments, or explanations, use multiple tables if required:
    {{
      "medication": "string",
      "dosage": "string",
      "instructions": "string"
    }}
    """

   

    try:
        # The rest of the function remains exactly the same.
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


if __name__ == '__main__':
    app.run(port=5000, debug=True)
