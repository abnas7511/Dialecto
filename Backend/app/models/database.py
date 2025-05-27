from sqlalchemy import create_engine, Column, Integer, String, DateTime
from datetime import datetime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class VideoTranslation(Base):
    __tablename__ = "video_translations"
    
    id = Column(String, primary_key=True, index=True)  # Changed to String for UUID
    user_id = Column(Integer)
    original_video_path = Column(String)
    extracted_audio_path = Column(String)
    translated_audio_path = Column(String)
    translated_video_path = Column(String)
    original_text = Column(String)  # Add this
    translated_text = Column(String)
    status = Column(String, default="pending")
    created_at = Column(DateTime, default=datetime.utcnow)