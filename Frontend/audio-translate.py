from flask import Flask, request, jsonify, send_file
from google.cloud import speech_v1 as speech
from google.cloud import translate_v2 as translate
from google.cloud import texttospeech
import os
from flask_cors import CORS
import tempfile
from werkzeug.utils import secure_filename
from pathlib import Path
import wave
import soundfile as sf
import numpy as np

app = Flask(__name__)
# Configure CORS properly
CORS(app, resources={
    r"/*": {
        "origins": "*",
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

# Configure Google Cloud credentials
CREDENTIALS_FILE = 'google-credentials.json'
CREDENTIALS_PATH = Path(__file__).parent / CREDENTIALS_FILE

if not CREDENTIALS_PATH.exists():
    raise FileNotFoundError(
        f"Google Cloud credentials file not found at {CREDENTIALS_PATH}. "
        "Please place your credentials file in the same directory as this script."
    )

os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = str(CREDENTIALS_PATH)

# Add this after app initialization
TEMP_DIR = tempfile.gettempdir()
os.makedirs(TEMP_DIR, exist_ok=True)

def get_wav_sample_rate(file_path):
    try:
        with wave.open(file_path, 'rb') as wav_file:
            return wav_file.getframerate()
    except:
        return 48000  # Default to 48kHz if can't read WAV header

def convert_to_mono(input_path, output_path):
    # Read audio file
    data, samplerate = sf.read(input_path)
    
    # Convert to mono if stereo
    if len(data.shape) > 1 and data.shape[1] > 1:
        data = np.mean(data, axis=1)
    
    # Write mono audio
    sf.write(output_path, data, samplerate, format='WAV', subtype='PCM_16')
    return samplerate

@app.route('/translate-audio', methods=['POST'])  # Changed from '/api/translate-audio'
def translate_audio():
    try:
        if not Path(os.environ['GOOGLE_APPLICATION_CREDENTIALS']).exists():
            return jsonify({
                'error': 'Google Cloud credentials not found. Please check server configuration.'
            }), 500

        if 'audio' not in request.files:
            return jsonify({'error': 'No audio file provided'}), 400

        audio_file = request.files['audio']
        if audio_file.filename == '':
            return jsonify({'error': 'No selected file'}), 400
            
        # Save original file
        input_filename = secure_filename(audio_file.filename)
        temp_audio_path = os.path.join(TEMP_DIR, input_filename)
        mono_audio_path = os.path.join(TEMP_DIR, f'mono_{input_filename}')
        
        # Save the uploaded file
        audio_file.save(temp_audio_path)
        
        # Convert to mono and get sample rate
        sample_rate = convert_to_mono(temp_audio_path, mono_audio_path)

        # Initialize clients
        speech_client = speech.SpeechClient()
        translate_client = translate.Client()
        tts_client = texttospeech.TextToSpeechClient()

        # Convert audio to text (Malayalam)
        with open(mono_audio_path, 'rb') as audio:
            content = audio.read()
            audio_input = speech.RecognitionAudio(content=content)
            config = speech.RecognitionConfig(
                encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
                sample_rate_hertz=sample_rate,
                language_code="ml-IN",
                enable_automatic_punctuation=True,
                audio_channel_count=1  # Explicitly set mono
            )
            response = speech_client.recognize(config=config, audio=audio_input)

        # Extract Malayalam text
        malayalam_text = ' '.join(result.alternatives[0].transcript 
                                for result in response.results)

        # Translate to English
        translation = translate_client.translate(
            malayalam_text,
            source_language='ml',
            target_language='en'
        )
        english_text = translation['translatedText']

        # Convert English text to speech
        synthesis_input = texttospeech.SynthesisInput(text=english_text)
        voice = texttospeech.VoiceSelectionParams(
            language_code="en-US",
            ssml_gender=texttospeech.SsmlVoiceGender.NEUTRAL,
            name="en-US-Standard-D"
        )
        audio_config = texttospeech.AudioConfig(
            audio_encoding=texttospeech.AudioEncoding.MP3,
            speaking_rate=1.0,
            pitch=0
        )

        response = tts_client.synthesize_speech(
            input=synthesis_input,
            voice=voice,
            audio_config=audio_config
        )

        # Save the translated audio with unique name
        output_filename = f'translated_{secure_filename(audio_file.filename)}.mp3'
        output_path = os.path.join(TEMP_DIR, output_filename)
        with open(output_path, 'wb') as out:
            out.write(response.audio_content)

        return jsonify({
            'text': english_text,
            'audioUrl': f'http://localhost:5003/audio/{output_filename}'
        })

    except Exception as e:
        print(f"Error in translate_audio: {str(e)}")  # Add server-side logging
        return jsonify({'error': str(e)}), 500

    finally:
        # Cleanup temporary files
        for path in [temp_audio_path, mono_audio_path]:
            if 'path' in locals() and os.path.exists(path):
                try:
                    os.remove(path)
                except:
                    pass

@app.route('/audio/<filename>')  # Changed from '/api/audio/<filename>'
def serve_audio(filename):
    try:
        file_path = os.path.join(TEMP_DIR, secure_filename(filename))
        if not os.path.exists(file_path):
            return jsonify({'error': 'Audio file not found'}), 404
            
        return send_file(
            file_path,
            mimetype='audio/mpeg',
            as_attachment=True,
            download_name=filename
        )
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health')  # Changed from '/api/health' to '/health'
def health_check():
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    print("Server running on http://localhost:5003")
    app.run(debug=True, port=5003, host='0.0.0.0')