import os
import sys
from dotenv import load_dotenv

# Load env vars
load_dotenv()

# Add root to sys.path
sys.path.append(os.getcwd())

from api.services.text_analysis import analyze_text_content
from api.core.config import settings

def test_analysis():
    print(f"Using API Key: {settings.google_api_key[:5]}...{settings.google_api_key[-5:] if len(settings.google_api_key) > 10 else ''}")
    try:
        print("Starting analysis...")
        result = analyze_text_content("This is a test message to check if the API is working.")
        print("Analysis successful!")
        print(result)
    except Exception as e:
        print("\n--- ERROR CAUGHT ---")
        import traceback
        traceback.print_exc()
        print("--------------------\n")

if __name__ == "__main__":
    test_analysis()
