# API Integration and Service Architecture

This repository contains 4 independent mini projects. Each one consumes a different public API category required by the assignment.

## Projects

1. `streaming-api`
   - Category: Streaming
   - API: Deezer API
   - Function: Runs a local web app that searches songs by artist or keyword.

2. `social-media-api`
   - Category: Social Media
   - API: DEV.to API
   - Function: Runs a local web app that shows recent articles for a tag.

3. `open-data-api`
   - Category: Databases / Open Data
   - API: NASA APOD API
   - Function: Runs a local web app that shows Astronomy Picture of the Day information.

4. `geolocation-api`
   - Category: Geolocation
   - API: Open-Meteo Geocoding + Forecast APIs
   - Function: Runs a local web app that looks up a city and shows current weather data.

## Requirements

- Node.js 18 or newer

## How to run

Each project is independent. Open a terminal inside the desired folder and run:

```bash
npm start
```

Then open these local URLs:

```bash
cd streaming-api
http://localhost:3000

cd social-media-api
http://localhost:3001

cd open-data-api
http://localhost:3002

cd geolocation-api
http://localhost:3003
```

## Installation

No external packages are required. The projects use the native `fetch` available in Node.js 18+.

## Folder structure

```text
/
|-- streaming-api/
|-- social-media-api/
|-- open-data-api/
|-- geolocation-api/
|-- README.md
```
