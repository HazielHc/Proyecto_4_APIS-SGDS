const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3002;
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

async function fetchApod(date) {
  const query = new URLSearchParams({
    api_key: "DEMO_KEY"
  });

  if (date) {
    query.set("date", date);
  }

  const response = await fetch(`https://api.nasa.gov/planetary/apod?${query.toString()}`);

  if (!response.ok) {
    throw new Error(`NASA request failed with status ${response.status}`);
  }

  return response.json();
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

  if (requestUrl.pathname === "/api/apod") {
    const date = requestUrl.searchParams.get("date")?.trim() || "";

    try {
      const apod = await fetchApod(date);
      sendJson(response, 200, apod);
    } catch (error) {
      sendJson(response, 500, { error: error.message });
    }
    return;
  }

  sendJson(response, 404, { error: "Route not found." });
});

server.listen(PORT, () => {
  console.log(`Open data app running at http://localhost:${PORT}`);
});
