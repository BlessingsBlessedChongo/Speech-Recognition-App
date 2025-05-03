// Web Worker for background audio processing
self.importScripts('https://cdn.jsdelivr.net/npm/pcm-util@1.0.0/dist/pcm-util.min.js');

self.onmessage = function(e) {
    const { audioData, command } = e.data;
    
    if (command === 'process') {
        processAudio(audioData)
            .then(result => self.postMessage({ 
                status: 'success', 
                result 
            }))
            .catch(error => self.postMessage({ 
                status: 'error', 
                error: error.message 
            }));
    }
};

async function processAudio(audioData) {
    try {
        // Convert to 16kHz mono WAV
        const audioContext = new OfflineAudioContext(1, 16000 * 5, 16000); // Max 5 seconds
        const buffer = await audioContext.decodeAudioData(audioData);
        
        // Normalize audio
        const normalizedBuffer = await normalizeAudio(buffer);
        
        // Convert to WAV
        return bufferToWav(normalizedBuffer);
    } catch (error) {
        throw new Error(`Audio processing failed: ${error.message}`);
    }
}

function normalizeAudio(buffer) {
    return new Promise((resolve) => {
        const offlineCtx = new OfflineAudioContext(
            buffer.numberOfChannels,
            buffer.length,
            buffer.sampleRate
        );
        
        const source = offlineCtx.createBufferSource();
        source.buffer = buffer;
        
        // Create gain node for normalization
        const gainNode = offlineCtx.createGain();
        const maxVal = getMaxAmplitude(buffer);
        
        if (maxVal > 0) {
            gainNode.gain.value = 1 / maxVal;
        }
        
        source.connect(gainNode);
        gainNode.connect(offlineCtx.destination);
        source.start();
        
        offlineCtx.startRendering().then(normalizedBuffer => {
            resolve(normalizedBuffer);
        });
    });
}

function getMaxAmplitude(buffer) {
    let max = 0;
    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < channelData.length; i++) {
            const absVal = Math.abs(channelData[i]);
            if (absVal > max) max = absVal;
        }
    }
    return max;
}

function bufferToWav(buffer) {
    const numChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const length = buffer.length * numChannels * 2 + 44;
    const bufferArray = new ArrayBuffer(length);
    const view = new DataView(bufferArray);
    
    // WAV header
    writeString(view, 0, 'RIFF');
    view.setUint32(4, length - 8, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM format
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numChannels * 2, true); // byte rate
    view.setUint16(32, numChannels * 2, true); // block align
    view.setUint16(34, 16, true); // bits per sample
    writeString(view, 36, 'data');
    view.setUint32(40, buffer.length * numChannels * 2, true);
    
    // Audio data
    let offset = 44;
    for (let i = 0; i < buffer.length; i++) {
        for (let channel = 0; channel < numChannels; channel++) {
            const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i]));
            view.setInt16(offset, sample < 0 ? sample * 32768 : sample * 32767, true);
            offset += 2;
        }
    }
    
    return new Blob([view], { type: 'audio/wav' });
}

function writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}