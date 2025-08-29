import axios from "axios";

const NEWS_API = "https://newsapi.org/v2/top-headlines?country=us&apiKey=bf70eb8dc7684ddf817a2bfab5cf1d79";

export async function getLatestNews() {
try {
    const res = await axios.get(NEWS_API);
    const articles = res.data.articles.slice(0, 3);
    return articles.map(a => `${a.title}. ${a.description}`).join("\n\n");
} catch (err) {
    console.error("Error fetching news:", err.message);
    return "Unable to fetch news at the moment.";
}
}
