const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3003;
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

async function getCoordinates(cityName) {
  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`;
  const geoResponse = await fetch(geoUrl);

  if (!geoResponse.ok) {
    throw new Error(`Geocoding failed with status ${geoResponse.status}`);
  }

  const geoData = await geoResponse.json();
  const place = geoData?.results?.[0];

  if (!place) {
    throw new Error(`No coordinates found for "${cityName}"`);
  }

  return place;
}

async function getWeather(latitude, longitude) {
  const weatherUrl =
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
    `&current=temperature_2m,apparent_temperature,wind_speed_10m&timezone=auto`;
  const weatherResponse = await fetch(weatherUrl);

  if (!weatherResponse.ok) {
    throw new Error(`Forecast failed with status ${weatherResponse.status}`);
  }

  return weatherResponse.json();
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

  if (requestUrl.pathname === "/api/weather") {
    const city = requestUrl.searchParams.get("city")?.trim() || "Monterrey";

    try {
      const place = await getCoordinates(city);
      const forecast = await getWeather(place.latitude, place.longitude);
      sendJson(response, 200, {
        city,
        place,
        current: forecast.current
      });
    } catch (error) {
      sendJson(response, 500, { error: error.message });
    }
    return;
  }

  sendJson(response, 404, { error: "Route not found." });
});

server.listen(PORT, () => {
  console.log(`Geolocation app running at http://localhost:${PORT}`);
});
