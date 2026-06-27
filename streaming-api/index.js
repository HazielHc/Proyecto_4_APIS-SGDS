const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
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

async function searchSongs(query) {
  const url = `https://api.deezer.com/search?q=${encodeURIComponent(query)}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Deezer request failed with status ${response.status}`);
  }

  const data = await response.json();
  const songs = Array.isArray(data.data) ? data.data.slice(0, 8) : [];

  return songs.map((song) => ({
    id: song.id,
    title: song.title,
    artist: song.artist?.name || "Unknown",
    album: song.album?.title || "Unknown",
    preview: song.preview || "",
    cover: song.album?.cover_medium || "",
    link: song.link || ""
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

  if (requestUrl.pathname === "/api/search") {
    const query = requestUrl.searchParams.get("q")?.trim() || "daft punk";

    try {
      const songs = await searchSongs(query);
      sendJson(response, 200, { query, songs });
    } catch (error) {
      sendJson(response, 500, { error: error.message });
    }
    return;
  }

  sendJson(response, 404, { error: "Route not found." });
});

server.listen(PORT, () => {
  console.log(`Streaming app running at http://localhost:${PORT}`);
});
