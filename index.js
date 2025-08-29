import dotenv from "dotenv";
import express from "express";
import path from "path";
import { getLatestNews } from "./NewsFetcher.js";
import { generateVoice } from "./voiceGenerator.js";
import { voiceOptions } from "./voiceoptions.js";
import { generateVoiceStream } from "./voiceStreamGenerator.js";
const app = express();
app.use(express.json());
// WebSocket endpoint for voice streaming
app.post("/api/voice-stream", async (req, res) => {
  const { lang, text } = req.body;
  const voiceId = voiceOptions[lang];
  if (!voiceId) {
    console.error("Invalid language selected:", lang);
    return res.status(400).json({ error: "Invalid language selected." });
  }
  res.set({
    "Content-Type": "audio/mpeg",
    "Transfer-Encoding": "chunked"
  });
  try {
    await generateVoiceStream(
      text,
      voiceId,
      (chunk) => {
        // Ensure chunk is a Buffer
        if (!(chunk instanceof Buffer)) {
          chunk = Buffer.from(chunk);
        }
        res.write(chunk);
      },
      () => res.end(),
      (err) => {
        console.error("Voice stream error:", err);
        res.status(500).end();
      }
    );
  } catch (error) {
    console.error("Voice stream exception:", error);
    res.status(500).end();
  }
});
dotenv.config();
const PORT = process.env.PORT || 5000;

// Route: Get latest news

app.get("/api/news", async (req, res) => {
  try {
    const newsString = await getLatestNews();
    // Split newsString into articles (assuming each article is separated by two newlines)
    const articles = newsString
      .split("\n\n")
      .map(item => {
        const [title, ...descArr] = item.split(". ");
        return {
          title: title || "Latest News",
          description: descArr.join(". ") || ""
        };
      });
    res.json({ news: articles });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch news." });
  }
});

// Route: Get podcast audio for selected language

app.post("/api/voice", async (req, res) => {
  const { lang, text } = req.body;
  const voiceId = voiceOptions[lang];
  if (!voiceId) {
    return res.status(400).json({ error: "Invalid language selected." });
  }
  try {
    const audioUrl = await generateVoice(text, voiceId);
    res.json({ audioUrl });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate podcast audio." });
  }
});

// Serve React static files in production
if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "client", "build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});