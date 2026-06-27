const form = document.getElementById("search-form");
const cityInput = document.getElementById("city");
const statusText = document.getElementById("status");
const resultContainer = document.getElementById("result");

function renderWeather(payload) {
  statusText.textContent = `Showing current weather for ${payload.place.name}, ${payload.place.country}.`;
  resultContainer.innerHTML = `
    <section class="card">
      <article class="tile">
        <h2>${payload.place.name}</h2>
        <p class="label">Country</p>
        <p class="value">${payload.place.country}</p>
      </article>
      <article class="tile">
        <h3>Temperature</h3>
        <p class="value">${payload.current.temperature_2m} C</p>
      </article>
      <article class="tile">
        <h3>Feels like</h3>
        <p class="value">${payload.current.apparent_temperature} C</p>
      </article>
      <article class="tile">
        <h3>Wind speed</h3>
        <p class="value">${payload.current.wind_speed_10m} km/h</p>
      </article>
      <article class="tile">
        <h3>Latitude</h3>
        <p class="value">${payload.place.latitude}</p>
      </article>
      <article class="tile">
        <h3>Longitude</h3>
        <p class="value">${payload.place.longitude}</p>
      </article>
      <article class="tile">
        <h3>Time</h3>
        <p class="value">${payload.current.time}</p>
      </article>
      <article class="tile">
        <h3>Timezone</h3>
        <p class="value">${payload.place.timezone}</p>
      </article>
    </section>
  `;
}

async function loadWeather(city) {
  statusText.textContent = `Loading weather for "${city}"...`;
  resultContainer.innerHTML = "";

  try {
    const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.error || "Request failed.");
    }

    renderWeather(payload);
  } catch (error) {
    statusText.textContent = `Error: ${error.message}`;
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const city = cityInput.value.trim();

  if (!city) {
    statusText.textContent = "Write a city first.";
    return;
  }

  loadWeather(city);
});

loadWeather(cityInput.value.trim());
