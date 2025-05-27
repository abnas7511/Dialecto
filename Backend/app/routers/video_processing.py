from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.responses import FileResponse
from app.models.database import SessionLocal, VideoTranslation
from app.services.audio_processing import AudioProcessor
import uuid
import os
from sqlalchemy.orm import Session

router = APIRouter()
processor = AudioProcessor()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/upload-video")
async def upload_video(file: UploadFile = File(...), db: Session = Depends(get_db)):
    try:
        file_id = str(uuid.uuid4())
        original_path = f"app/temp_files/{file_id}_original.mp4"
        
        # Save video
        with open(original_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Create DB entry
        translation_job = VideoTranslation(
            id=file_id,
            original_video_path=original_path,
            status="uploaded"
        )
        db.add(translation_job)
        db.commit()
        
        return {"job_id": file_id, "status": "uploaded"}
    
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/texts/{job_id}")
def get_texts(job_id: str, db: Session = Depends(get_db)):
    job = db.query(VideoTranslation).filter(VideoTranslation.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    return {
        "original_text": job.original_text,
        "translated_text": job.translated_text
    }

@router.post("/start-translation/{job_id}")
def start_translation(job_id: str, db: Session = Depends(get_db)):
    job = db.query(VideoTranslation).filter(VideoTranslation.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    try:
        result = processor.process_video_translation(job.original_video_path) 
        
        # Update job status
        job.extracted_audio_path = result["original_audio"]
        job.translated_audio_path = result["translated_audio"]
        job.translated_video_path = result["translated_video"]
        job.original_text = result["original_text"]  # Add this
        job.translated_text = result["translated_text"]
        job.status = "completed"
        db.commit()
        
        return {"status": "completed", "output_path": result["translated_video"],  "original_text": result["original_text"],  # Add this
            "translated_text": result["translated_text"] }
    
    except Exception as e:
        job.status = "failed"
        db.commit()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/status/{job_id}")
def get_status(job_id: str, db: Session = Depends(get_db)):
    job = db.query(VideoTranslation).filter(VideoTranslation.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return {"status": job.status}

@router.get("/download/{file_type}/{job_id}")
def download_file(file_type: str, job_id: str, db: Session = Depends(get_db)):
    job = db.query(VideoTranslation).filter(VideoTranslation.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    file_path = None
    if file_type == "original_audio":
        file_path = job.extracted_audio_path
    elif file_type == "translated_video":
        file_path = job.translated_video_path
    elif file_type == "translated_audio":
        file_path = job.translated_audio_path
    else:
        raise HTTPException(status_code=400, detail="Invalid file type")
    
    if not file_path or not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    
    return FileResponse(file_path)