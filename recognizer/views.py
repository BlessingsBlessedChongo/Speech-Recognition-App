import io
import time
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import speech_recognition as sr
import soundfile as sf
import numpy as np

@csrf_exempt
def recognize_speech(request):
    if request.method == 'POST' and request.FILES.get('audio_data'):
        start_time = time.time()
        recognizer = sr.Recognizer()
        
        try:
            # Read audio file into memory
            audio_file = request.FILES['audio_data']
            audio_bytes = audio_file.read()
            
            # Convert audio to proper format
            try:
                # First try standard WAV processing
                with io.BytesIO(audio_bytes) as audio_buffer:
                    with sr.AudioFile(audio_buffer) as source:
                        recognizer.adjust_for_ambient_noise(source, duration=0.3)
                        audio_data = recognizer.record(source)
            except Exception as e:
                # Fallback to soundfile for format conversion
                try:
                    with io.BytesIO(audio_bytes) as audio_buffer:
                        # Convert to PCM WAV format
                        data, samplerate = sf.read(audio_buffer)
                        with io.BytesIO() as wav_buffer:
                            sf.write(wav_buffer, data, samplerate, format='WAV')
                            wav_buffer.seek(0)
                            with sr.AudioFile(wav_buffer) as source:
                                recognizer.adjust_for_ambient_noise(source, duration=0.3)
                                audio_data = recognizer.record(source)
                except Exception as e:
                    return JsonResponse({
                        'error': 'Unsupported audio format',
                        'solution': 'Please try recording again',
                        'technical': str(e)
                    }, status=400)
            
            # Validate audio content
            if not hasattr(audio_data, 'frame_data') or len(audio_data.frame_data) == 0:
                return JsonResponse({
                    'error': 'No speech detected',
                    'solution': 'Please speak louder and try again'
                }, status=400)
            
            # Perform speech recognition
            try:
                text = recognizer.recognize_google(
                    audio_data,
                    language="en-US",
                    show_all=False
                )
                return JsonResponse({
                    'text': text,
                    'processing_time': f"{(time.time() - start_time):.2f}s"
                })
                
            except sr.UnknownValueError:
                return JsonResponse({
                    'error': 'Could not understand audio',
                    'solution': 'Please speak more clearly'
                }, status=400)
                
            except sr.RequestError as e:
                return JsonResponse({
                    'error': 'Speech service unavailable',
                    'solution': 'Please try again later',
                    'technical': str(e)
                }, status=503)
                
        except Exception as e:
            return JsonResponse({
                'error': 'Processing failed',
                'solution': 'Please try again',
                'technical': str(e)
            }, status=500)
    
    return JsonResponse({
        'error': 'Invalid request',
        'solution': 'Please use the recording interface'
    }, status=400) 
