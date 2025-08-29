📰 Live-News-Podcast

A modern React + Node.js application that fetches the latest news and reads it aloud using Text-to-Speech (TTS) powered by the Murf API.
The app includes a clean UI dashboard, WebSocket-based live toggle, and an optional latest news video player for a complete multimedia experience.

🚀 Features

🌍 Multi-language & Multi-voice support (powered by Murf AI)

📰 Fetch latest news dynamically via API

🔊 Text-to-Speech with streaming playback

🎨 Interactive React UI with Tailwind & Shadcn/UI

🔄 WebSocket toggle for real-time voice control

🎥 Latest video news section (embedded)

⚡ Node.js backend with Express for API & TTS handling

🛠️ Tech Stack

Frontend (UI):

React (Vite/CRA)

TailwindCSS + Shadcn/UI

WebSockets (toggle feature)

Backend (API):

Node.js + Express

Axios for Murf API calls

dotenv for config

WebSocket server

Integrations:

Murf TTS API

News API (or custom feed)

Video embed (YouTube / API)

📂 Project Structure
voice-news-reader/
├── backend/
│   ├── index.js          # Express + WebSocket backend
│   ├── voiceGenerator.js # Murf API integration
│   ├── NewsFetcher.js    # News API fetcher
│   └── .env              # API keys (MURF_API_KEY, NEWS_API_KEY)
│
├── frontend/
│   ├── src/
│   │   ├── App.js        # Main React app
│   │   ├── components/   # UI Components
│   │   │   ├── NewsList.jsx
│   │   │   ├── VoicePlayer.jsx
│   │   │   ├── WebSocketToggle.jsx
│   │   │   └── VideoSection.jsx
│   │   └── utils/
│   │       └── socket.js
│   ├── public/
│   │   └── index.html
│   └── package.json
│
└── README.md

⚙️ Setup & Installation
1️⃣ Clone Repository
git clone https://github.com/your-username/voice-news-reader.git
cd voice-news-reader

2️⃣ Backend Setup
cd backend
npm install


Create a .env file:

MURF_API_KEY=your_murf_api_key_here
NEWS_API_KEY=your_news_api_key_here
PORT=5000


Run backend:

node index.js

3️⃣ Frontend Setup
cd ../frontend
npm install
npm start


The app will run at:
👉 Frontend: http://localhost:3000
👉 Backend: http://localhost:5000

🎯 Usage

Open the app in your browser.

Select Language & Voice.

Fetch latest news.

Toggle WebSocket Voice Control.

Listen 🎧 or watch 📺 the latest news video.

🎥 Demo Preview

🔮 Future Enhancements

Offline mode with cached news

User personalization (topics, voices)

Multi-device sync with WebSockets

Advanced video + audio sync

🤝 Contributing

Pull requests are welcome! For major changes, open an issue first.
