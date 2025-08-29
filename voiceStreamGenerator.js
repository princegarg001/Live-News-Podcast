// voiceStreamGenerator.js
// Murf WebSocket streaming voice generator
import dotenv from 'dotenv';
import WebSocket from 'ws';
dotenv.config();

export async function generateVoiceStream(text, voiceId = "English", onData, onEnd, onError) {
  const ws = new WebSocket('wss://api.murf.ai/v1/speech/stream', {
    headers: {
      'api-key': process.env.MURF_API_KEY,
    },
  });

  ws.on('open', () => {
    ws.send(JSON.stringify({
      text,
      voiceId,
      format: 'MP3',
      channelType: 'MONO',
      sampleRate: 44100,
    }));
  });

  ws.on('message', (data) => {
    if (onData) onData(data);
  });

  ws.on('close', () => {
    if (onEnd) onEnd();
  });

  ws.on('error', (err) => {
    if (onError) onError(err);
  });

  return ws;
}
