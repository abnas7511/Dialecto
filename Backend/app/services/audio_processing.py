from transformers import Wav2Vec2ForCTC, Wav2Vec2Processor
import torch
import soundfile as sf
import librosa
import ffmpeg
import os
from app.services.translation import TranslationService

class AudioProcessor:
    def __init__(self):
        self.model_name = "Bluecast/wav2vec2-Malayalam"
        self.processor = Wav2Vec2Processor.from_pretrained(self.model_name)
        self.model = Wav2Vec2ForCTC.from_pretrained(self.model_name)
        self.translator = TranslationService()
        
    def _load_audio(self, file_path: str):
        try:
            speech, original_sr = sf.read(file_path)
            if len(speech.shape) > 1:
                speech = speech.mean(axis=1)
            if original_sr != 16000:
                speech = librosa.resample(speech, orig_sr=original_sr, target_sr=16000)
            return speech
        except Exception as e:
            raise RuntimeError(f"Audio loading failed: {str(e)}")


    def process_video_translation(self, video_path: str):
        try:
            # Extract audio
            audio_path = video_path.replace("_original.mp4", "_audio.wav")
            (
                ffmpeg.input(video_path)
                .output(audio_path, ac=1, ar=16000)
                .run(overwrite_output=True)
            )
            
            # Load and preprocess audio
            speech = self._load_audio(audio_path)
            inputs = self.processor(
                speech, 
                sampling_rate=16000, 
                return_tensors="pt", 
                padding=True
            )
            
            # Get Malayalam transcription
            with torch.no_grad():
                logits = self.model(inputs.input_values).logits
            predicted_ids = torch.argmax(logits, dim=-1)
            malayalam_text = self.processor.decode(predicted_ids[0])
            
            # Translate to English
            english_text = self.translator.translate_text(malayalam_text, src='ml', dest='en')

            # Generate English audio
            audio_data = self.translator.text_to_speech(english_text, lang='en')
            translated_audio_path = audio_path.replace("_audio.wav", "_translated.mp3")
            
            with open(translated_audio_path, "wb") as f:
                f.write(audio_data.getbuffer())
            
            # Merge with original video
            output_video_path = video_path.replace("_original.mp4", "_translated.mp4")
            
            # Create input streams
            input_video = ffmpeg.input(video_path)
            input_audio = ffmpeg.input(translated_audio_path)

            # Combine streams
            output = ffmpeg.output(
            input_video.video,
            input_audio.audio,
            output_video_path,
            vcodec='copy',
            acodec='aac',
            strict='experimental'
            )
        
            output.run(overwrite_output=True)

            return {
                "original_audio": audio_path,
                "translated_audio": translated_audio_path,
                "translated_video": output_video_path,
                "original_text": malayalam_text,
                "translated_text": english_text
            }
        
        except Exception as e:
            raise RuntimeError(f"Processing failed: {str(e)}")