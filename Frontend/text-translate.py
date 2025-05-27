from flask import Flask, request, jsonify
from google.cloud import translate_v2 as translate
import os
from flask_cors import CORS
from pathlib import Path

app = Flask(__name__)
# Update CORS configuration
CORS(app)

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    return response

# Configure Google Cloud credentials
CREDENTIALS_FILE = 'google-credentials.json'
CREDENTIALS_PATH = Path(__file__).parent / CREDENTIALS_FILE

if not CREDENTIALS_PATH.exists():
    raise FileNotFoundError(
        f"Google Cloud credentials file not found at {CREDENTIALS_PATH}. "
        "Please place your credentials file in the same directory as this script."
    )

os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = str(CREDENTIALS_PATH)

@app.route('/api/health')
def health_check():
    return jsonify({'status': 'ok'})

@app.route('/api/translate-text', methods=['POST'])
def translate_text():
    try:
        data = request.json
        if not data or 'text' not in data:
            return jsonify({'error': 'No text provided'}), 400

        # Initialize translation client
        translate_client = translate.Client()

        # Perform translation
        translation = translate_client.translate(
            data['text'],
            source_language='ml',
            target_language='en'
        )

        return jsonify({
            'translatedText': translation['translatedText']
        })

    except Exception as e:
        print(f"Error in translate_text: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("Text translation server running on http://localhost:5001")
    try:
        # Update host to allow external connections
        app.run(debug=True, port=5001, host='0.0.0.0')
    except Exception as e:
        print(f"Failed to start server: {e}")
        # If port 5001 is in use, try alternative port
        try:
            print("Trying alternative port 5002...")
            app.run(debug=True, port=5002, host='0.0.0.0')
        except Exception as e:
            print(f"Failed to start server on alternative port: {e}")
