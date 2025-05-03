# Speech Recognition Web App with Django


![Screenshot 2025-05-03 072653](https://github.com/user-attachments/assets/08794edc-68d9-4774-b6d5-4c4912c97f8e)
![Screenshot 2025-05-03 072716](https://github.com/user-attachments/assets/93d7559f-a105-4b8c-9ad7-4a21d16c73c9)
![Screenshot 2025-05-03 072733](https://github.com/user-attachments/assets/b1f8a86a-109b-4e43-9173-2d840c9db857)
![Screenshot 2025-05-03 072754](https://github.com/user-attachments/assets/68718f48-417f-42de-9a32-a1964dcf1db0)

A real-time speech-to-text web application built with Django and Web Audio API. Users can record their voice and get instant transcriptions.

## Features

- 🎤 Real-time audio recording with waveform visualization
- 🔊 Speech-to-text conversion using Google's Web Speech API
- ⚡ Optimized audio processing pipeline
- 📱 Responsive design for all device sizes
- 🛠️ Robust error handling and user feedback

## Technology Stack

- **Backend**: Django 4.2
- **Frontend**: HTML5, CSS3, JavaScript (Web Audio API)
- **Speech Recognition**: Python SpeechRecognition library
- **Audio Processing**: Web Audio API, PyAudio

## Installation

### Prerequisites

- Python 3.8+
- Node.js (for optional frontend development)
- Microphone-enabled device

### Setup

1. Clone the repository:
   ```
   git clone https://github.com/blessingsblessedchongo/Speech-Recognition-App.git
   cd speech-recognition-app
   ```

2. Create and activate a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Set up the database:
   ```
   python manage.py migrate
   ```

5. Run the development server:
   ```
   python manage.py runserver
   ```

6. Open in your browser:
   ```
   http://127.0.0.1:8000/
   ```

## Configuration

Configure environment variables by creating a `.env` file:

```
DEBUG=True
SECRET_KEY=your-secret-key-here
```

## Usage

1. Click the microphone button to start recording
2. Speak clearly into your microphone
3. Click stop to process the audio
4. View your transcribed text
5. (Optional) Copy or save the transcription

## Troubleshooting

### Common Issues

**Audio Not Recording:**
- Check browser microphone permissions
- Ensure no other app is using the microphone

**"Processing Error" Message:**
- Refresh the page and try again
- Try speaking louder and closer to the microphone

**Installation Problems:**
- On Linux, install PyAudio dependencies first:
  ```
  sudo apt-get install portaudio19-dev python3-pyaudio
  ```

## Project Structure

```
speech-recognition-app/
├── manage.py
├── requirements.txt
├── speech_app/          # Django project config
├── recognizer/          # Main app
│   ├── static/          # CSS/JS files
│   ├── templates/       # HTML templates
│   ├── views.py         # Backend logic
│   └── ...
└── README.md
```

## Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Acknowledgements

- Google Web Speech API
- Django Software Foundation
- MDN Web Docs for Web Audio API references

