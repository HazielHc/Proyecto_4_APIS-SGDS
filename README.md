# API Integration and Service Architecture

This repository contains four independent mini projects built with Node.js. Each project consumes a different external API and covers one of the categories required by the assignment: Streaming, Social Media, Open Data, and Geolocation.

## Project Objective

The goal of this repository is to demonstrate:

- Consumption of external web services
- Handling of asynchronous API requests with JavaScript
- Clear project organization
- Separation of responsibilities across four independent solutions

## Technologies Used

- Node.js 18+
- Native `fetch`
- HTML, CSS, and JavaScript
- Public REST APIs

No external npm dependencies are required.

## Included Projects

### 1. `streaming-api`

- Category: Streaming
- API used: Deezer API
- Main purpose: Search songs by artist or keyword
- Local URL: `http://localhost:3000`
- Main endpoint consumed:
  - `https://api.deezer.com/search?q={query}`

This mini project displays:

- Song title
- Artist name
- Album name
- Album cover
- Direct Deezer link
- 30-second preview when available

### 2. `social-media-api`

- Category: Social Media
- API used: DEV.to API
- Main purpose: Search recent articles by tag
- Local URL: `http://localhost:3001`
- Main endpoint consumed:
  - `https://dev.to/api/articles?per_page=6&tag={tag}`

This mini project displays:

- Article title
- Author
- Publish date
- Estimated reading time
- Description
- Tags
- Link to the original article

### 3. `open-data-api`

- Category: Databases / Open Data
- API used: NASA APOD API
- Main purpose: Show Astronomy Picture of the Day
- Local URL: `http://localhost:3002`
- Main endpoint consumed:
  - `https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY`

This mini project displays:

- APOD title
- Date
- Media type
- Official NASA image or media link
- Explanation of the selected content

### 4. `geolocation-api`

- Category: Geolocation
- APIs used:
  - Open-Meteo Geocoding API
  - Open-Meteo Forecast API
- Main purpose: Search a city and display current weather data
- Local URL: `http://localhost:3003`
- Main endpoints consumed:
  - `https://geocoding-api.open-meteo.com/v1/search?name={city}`
  - `https://api.open-meteo.com/v1/forecast?...`

This mini project displays:

- City name
- Country
- Latitude and longitude
- Current temperature
- Apparent temperature
- Wind speed
- Local time
- Time zone

## Repository Structure

```text
Proyecto_4_APIS/
|-- streaming-api/
|-- social-media-api/
|-- open-data-api/
|-- geolocation-api/
|-- README.md
```

Each folder is an independent mini project with its own:

- `index.js`
- `package.json`
- `README.md`
- `public/` folder for the frontend

## Installation

1. Make sure Node.js 18 or newer is installed.
2. Open this repository in a terminal.
3. Enter the folder of the mini project you want to run.

Example:

```bash
cd streaming-api
```

## Execution Instructions

Each project runs independently. Start each one from its own folder with:

```bash
npm start
```

Then open the corresponding local URL in your browser.

### Run `streaming-api`

```bash
cd streaming-api
npm start
```

Open:

```text
http://localhost:3000
```

### Run `social-media-api`

```bash
cd social-media-api
npm start
```

Open:

```text
http://localhost:3001
```

### Run `open-data-api`

```bash
cd open-data-api
npm start
```

Open:

```text
http://localhost:3002
```

### Run `geolocation-api`

```bash
cd geolocation-api
npm start
```

Open:

```text
http://localhost:3003
```

## Notes

- All projects use asynchronous requests to consume live API data.
- Each mini project was kept independent to satisfy the repository structure requested in the assignment.
- The folders `work/` and `outputs/` are not part of the deliverable logic.

## Author

- Student project for API Integration and Service Architecture
