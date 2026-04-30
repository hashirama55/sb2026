import os
import sys
from dotenv import load_dotenv

# Load env vars
load_dotenv()

# Add root to sys.path
sys.path.append(os.getcwd())

from api.services.audio_analysis import analyze_audio_content
from api.core.config import settings

def test_audio_analysis():
    audio_path = "test_audio.wav"
    if not os.path.exists(audio_path):
        from create_test_audio import create_dummy_wav
        create_dummy_wav(audio_path)
        
    print(f"Testing audio analysis with: {audio_path}")
    try:
        result = analyze_audio_content(audio_path, "audio/wav")
        print("Audio Analysis successful!")
        print(result)
    except Exception as e:
        print("\n--- ERROR CAUGHT ---")
        import traceback
        traceback.print_exc()
        print("--------------------\n")

if __name__ == "__main__":
    test_audio_analysis()
