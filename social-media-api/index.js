const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3001;
const PUBLIC_DIR = path.join(__dirname, "public");

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8"
  });
  response.end(JSON.stringify(payload));
}

function sendFile(response, filePath, contentType) {
  fs.readFile(filePath, (error, data) => {
    if (error) {
      sendJson(response, 500, { error: "Failed to load static file." });
      return;
    }

    response.writeHead(200, {
      "Content-Type": `${contentType}; charset=utf-8`
    });
    response.end(data);
  });
}

async function fetchArticles(tag) {
  const url = `https://dev.to/api/articles?per_page=6&tag=${encodeURIComponent(tag)}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`DEV.to request failed with status ${response.status}`);
  }

  const data = await response.json();
  const articles = Array.isArray(data) ? data : [];

  return articles.map((article) => ({
    id: article.id,
    title: article.title,
    description: article.description || "No description available.",
    url: article.url,
    cover: article.social_image || "",
    author: article.user?.name || "Unknown",
    readingTime: article.reading_time_minutes || 0,
    publishedAt: article.readable_publish_date || "Unknown",
    tags: Array.isArray(article.tag_list) ? article.tag_list : []
  }));
}

const server = http.createServer(async (request, response) => {
  const requestUrl = new URL(request.url, `http://${request.headers.host}`);

  if (requestUrl.pathname === "/") {
    sendFile(response, path.join(PUBLIC_DIR, "index.html"), "text/html");
    return;
  }

  if (requestUrl.pathname === "/styles.css") {
    sendFile(response, path.join(PUBLIC_DIR, "styles.css"), "text/css");
    return;
  }

  if (requestUrl.pathname === "/app.js") {
    sendFile(response, path.join(PUBLIC_DIR, "app.js"), "application/javascript");
    return;
  }

  if (requestUrl.pathname === "/api/articles") {
    const tag = requestUrl.searchParams.get("tag")?.trim() || "javascript";

    try {
      const articles = await fetchArticles(tag);
      sendJson(response, 200, { tag, articles });
    } catch (error) {
      sendJson(response, 500, { error: error.message });
    }
    return;
  }

  sendJson(response, 404, { error: "Route not found." });
});

server.listen(PORT, () => {
  console.log(`Social media app running at http://localhost:${PORT}`);
});
