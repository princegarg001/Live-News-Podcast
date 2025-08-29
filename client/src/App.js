
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import "./App.css";

const LANGUAGES = [
  { label: "English", value: "English" },
  { label: "French", value: "French" },
  { label: "German", value: "German" },
];

function App() {
  const [selectedLang, setSelectedLang] = useState("English");
  const [news, setNews] = useState([]);
  const [audioUrl, setAudioUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [streamMode, setStreamMode] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setError("");
    try {
      const res = await axios.get("/api/news");
  setNews(res.data.news || []);
    } catch (err) {
      setError("Failed to fetch news.");
    }
  };

  const handleLanguageChange = (e) => {
    setSelectedLang(e.target.value);
    setAudioUrl("");
    setError("");
  };

  const handleListen = async () => {
    setLoading(true);
    setError("");
    setAudioUrl("");
    if (!streamMode) {
      try {
        const res = await axios.post("/api/voice", {
          lang: selectedLang,
          text: news.map ? news.map(n => n.description).join(" ") : news // fallback for string
        });
        setAudioUrl(res.data.audioUrl);
      } catch (err) {
        setError("Failed to generate podcast audio.");
      }
      setLoading(false);
    } else {
      try {
        // Stream voice using fetch and play as it arrives
        const response = await fetch("/api/voice-stream", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lang: selectedLang,
            text: news.map ? news.map(n => n.description).join(" ") : news // fallback for string
          })
        });
        if (!response.body) throw new Error("No stream");
        setAudioUrl("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3");

        const reader = response.body.getReader();
        let chunks = [];
        let done = false;
        while (!done) {
          const { value, done: readerDone } = await reader.read();
          if (value) chunks.push(value);
          done = readerDone;
        }
        // Combine chunks and create blob
       // const audioBlob = new Blob(chunks, { type: "audio/mpeg" });
        //const url = URL.createObjectURL(audioBlob);
      setAudioUrl("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3");

        // Play audio automatically
        setTimeout(() => {
          if (audioRef.current) audioRef.current.play();
        }, 300);
      } catch (err) {
        setError("Failed to stream podcast audio.");
      }
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🌍 Live News Podcast</h1>
        <div className="card">
          <label htmlFor="lang-select">Select Language:</label>
          <select id="lang-select" value={selectedLang} onChange={handleLanguageChange}>
            {LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>{lang.label}</option>
            ))}
          </select>
        </div>
        <div className="news-section">
          <h2>📰 Latest News</h2>
          <div className="news-text">
            {Array.isArray(news) && news.length > 0 ? (
              news.map((item, idx) => (
                <div key={idx} style={{marginBottom: '16px'}}>
                  <strong>{item.title}</strong>
                  <div>{item.description}</div>
                </div>
              ))
            ) : (
              <div>No news available.</div>
            )}
          </div>
        </div>
        <div style={{marginBottom: '12px'}}>
          <label style={{marginRight: '8px', fontWeight: 500}}>
            <input type="checkbox" checked={streamMode} onChange={e => setStreamMode(e.target.checked)} />
            Stream Voice (WebSocket)
          </label>
        </div>
        <button className="listen-btn" onClick={handleListen} disabled={loading}>
          {loading ? (streamMode ? "Streaming..." : "Loading...") : `Listen in ${selectedLang}`}
        </button>
        {audioUrl && (
          <div className="audio-section">
            <audio controls src={audioUrl} ref={audioRef} />
          </div>
        )}
        {error && <div style={{color: 'salmon', marginTop: '16px'}}>{error}</div>}

        <div className="motivation-section">
          <h2 style={{ color: '#2193b0', marginBottom: '18px' }}>Latest News In India</h2>
          <div className="motivation-list">
            <div className="motivation-card">
              <iframe width="320" height="180" src="https://www.youtube.com/embed/53fIRk2VFuc?si=S8gBDUHiZiGivCNL" title="Motivation 1" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
              <p>How Bad Do You Want It?</p>
            </div>
            <div className="motivation-card">
              <iframe width="320" height="180" src="https://www.youtube.com/embed/iDzZEIvKZWY?si=VpgCKnJQe3_b70Gb" title="Motivation 2" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
              <p>Unbroken - How Curated </p> 
            </div>
            <div className="motivation-card">
              <iframe width="320" height="180" src="https://www.youtube.com/embed/LCXkQRPYQG4?si=A8e7j33ZL04A4jN8" title="Motivation 3" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
              <p>Rise & Shine </p>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;