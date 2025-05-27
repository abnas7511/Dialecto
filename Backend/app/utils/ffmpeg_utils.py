import ffmpeg

def get_video_duration(input_path):
    probe = ffmpeg.probe(input_path)
    return float(probe['format']['duration'])

def create_thumbnail(input_path, output_path):
    (
        ffmpeg.input(input_path, ss='00:00:01')
        .filter('scale', 320, -1)
        .output(output_path, vframes=1)
        .run()
    )