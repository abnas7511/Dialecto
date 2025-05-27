from googletrans import Translator
from gtts import gTTS
import io

class TranslationService:
    def __init__(self):
        self.translator = Translator(service_urls=['translate.google.com'])
        
    def translate_text(self, text: str, src='ml', dest='en') -> str:
        return self.translator.translate(text, src=src, dest=dest).text
    
    def text_to_speech(self, text: str, lang='en') -> str:
        tts = gTTS(text=text, lang=lang)
        audio_file = io.BytesIO()
        tts.write_to_fp(audio_file)
        audio_file.seek(0)
        return audio_file