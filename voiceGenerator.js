// voiceGenerator.js
import axios from "axios";
import dotenv from "dotenv";

dotenv.config(); // Load .env variables

// Function to generate voice
export async function generateVoice(text, voiceId = "English") {
  try {
    const data = {
      text: text,
      voiceId: voiceId,   // voiceId is passed directly
      format: "MP3",
      channelType: "MONO",
      sampleRate: 44100,
    };

    const response = await axios.post(
      "https://api.murf.ai/v1/speech/generate",
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "api-key": process.env.MURF_API_KEY,
        },
      }
    );

    return response.data.audioFile; // The generated audio URL
  } catch (error) {
    console.error("Error generating voice:", error.response?.data || error.message);
    throw error;
  }
}
