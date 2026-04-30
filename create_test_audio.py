import wave
import struct

def create_dummy_wav(filename):
    # Create a 1-second silent mono 8kHz WAV file
    sample_rate = 8000
    duration = 1.0 
    num_samples = int(sample_rate * duration)
    
    with wave.open(filename, 'w') as wav_file:
        wav_file.setnchannels(1)
        wav_file.setsampwidth(2)
        wav_file.setframerate(sample_rate)
        
        for _ in range(num_samples):
            value = 0
            data = struct.pack('<h', value)
            wav_file.writeframesraw(data)

if __name__ == "__main__":
    create_dummy_wav("test_audio.wav")
    print("Created test_audio.wav")
