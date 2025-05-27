# Dialecto

Dialecto is an AI-powered video translation platform designed to translate rural dialect audio in videos into natural English audio while preserving cultural nuances and emotional essence. It leverages state-of-the-art deep learning models and advanced audio processing techniques to provide accurate and context-aware translations.

## Features

- Upload videos with rural dialect audio for translation
- Automatic extraction and transcription of audio using AI models
- Translation of dialect text to English with context preservation
- Generation of English audio from translated text
- Merging translated audio back into the original video
- User authentication and protected routes in the frontend
- Responsive and modern React frontend with intuitive UI
- Pricing, team, and contact sections included in the frontend

## Technologies Used

### Backend

- FastAPI for building the REST API
- Uvicorn as the ASGI server
- SQLAlchemy ORM with PostgreSQL for database management
- ffmpeg-python for audio and video processing
- Hugging Face Transformers (Wav2Vec2) for speech-to-text transcription
- Torch for deep learning model inference
- googletrans for text translation
- gTTS for text-to-speech conversion
- Librosa and Soundfile for audio processing

### Frontend

- React 18 with TypeScript
- React Router DOM for client-side routing
- Zustand for state management
- Tailwind CSS for styling
- Vite as the build tool
- Supabase JS client for backend integration
- Lucide React for icons

## Installation

### Backend

1. Navigate to the `Backend` directory:
   ```bash
   cd Backend
   ```

2. Create and activate a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up your database and environment variables as needed.

5. Run the FastAPI server:
   ```bash
   uvicorn app.main:app --reload
   ```

### Frontend

1. Navigate to the `Frontend` directory:
   ```bash
   cd Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

## Usage

- Use the frontend web interface to sign up or log in.
- Upload videos containing rural dialect audio for translation.
- Monitor translation job status and download translated videos and audio.
- Explore additional pages such as pricing, team, and contact.

## API Endpoints Overview

- `POST /api/v1/upload-video`: Upload a video for translation.
- `GET /api/v1/texts/{job_id}`: Retrieve original and translated texts.
- `POST /api/v1/start-translation/{job_id}`: Start the translation process.
- `GET /api/v1/status/{job_id}`: Check the status of a translation job.
- `GET /api/v1/download/{file_type}/{job_id}`: Download original audio, translated audio, or translated video.

## Frontend Routes Overview

- `/` - Home page with features and how it works.
- `/login` - User login page.
- `/signup` - User registration page.
- `/services` - Services page (requires authentication).
- `/dashboard` - User dashboard (requires authentication).
- `/audio-dashboard` - Audio translation dashboard (requires authentication).
- `/text-dashboard` - Text translation dashboard (requires authentication).

## License

This project is licensed under the MIT License.

## Contact

For questions or support, please contact the project maintainer.

---
This README provides a comprehensive overview of the Dialecto project, including setup, usage, and technology stack details.
