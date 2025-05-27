import os
import subprocess

# Define input directories
video_folder = ""  # Change this to your video folder path
audio_folder = "./output_audio"  # Change this to your audio folder path
output_folder = "./output"  # Change this to where you want to save output videos

# Ensure output directory exists
os.makedirs(output_folder, exist_ok=True)

def replace_audio(video_file, audio_file, output_file):
    """
    Replace the audio of a video file with a new audio file.
    """
    command = [
        "ffmpeg",
        "-i", video_file,         # Input video
        "-i", audio_file,         # Input new audio
        "-c:v", "copy",           # Copy video codec (no re-encoding)
        "-c:a", "aac",            # Encode audio in AAC
        "-strict", "experimental",
        "-map", "0:v:0",          # Select video from first input
        "-map", "1:a:0",          # Select audio from second input
        "-y",                     # Overwrite without asking
        output_file
    ]
    
    subprocess.run(command, check=True)
    print(f"Processed: {output_file}")

# Process all videos
for video_filename in os.listdir(video_folder):
    video_path = os.path.join(video_folder, video_filename)
    
    # Find matching audio file (assuming same filename but different extension)
    audio_filename = os.path.splitext(video_filename)[0] + ".mp3"  # Change to correct extension if needed
    audio_path = os.path.join(audio_folder, audio_filename)

    if os.path.exists(audio_path):
        output_path = os.path.join(output_folder, video_filename)
        replace_audio(video_path, audio_path, output_path)
    else:
        print(f"Skipping {video_filename}, matching audio not found.")
