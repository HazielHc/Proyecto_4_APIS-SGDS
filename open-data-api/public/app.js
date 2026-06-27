const form = document.getElementById("date-form");
const dateInput = document.getElementById("date");
const statusText = document.getElementById("status");
const resultContainer = document.getElementById("result");

function renderApod(data) {
  statusText.textContent = `Loaded APOD for ${data.date}.`;

  const media =
    data.media_type === "image"
      ? `<img class="media" src="${data.url}" alt="${data.title}" />`
      : `<div class="fallback"><p>This APOD is a video.</p><a href="${data.url}" target="_blank" rel="noreferrer">Open media</a></div>`;

  resultContainer.innerHTML = `
    <article class="card">
      ${media}
      <div class="copy">
        <h2>${data.title}</h2>
        <p class="meta">Date: ${data.date}</p>
        <p class="meta">Media type: ${data.media_type}</p>
        <p>${data.explanation}</p>
        <a href="${data.url}" target="_blank" rel="noreferrer">Open original resource</a>
      </div>
    </article>
  `;
}

async function loadApod(date) {
  statusText.textContent = date ? `Loading APOD for ${date}...` : "Loading APOD...";
  resultContainer.innerHTML = "";

  const query = date ? `?date=${encodeURIComponent(date)}` : "";

  try {
    const response = await fetch(`/api/apod${query}`);
    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.error || "Request failed.");
    }

    renderApod(payload);
  } catch (error) {
    statusText.textContent = `Error: ${error.message}`;
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  loadApod(dateInput.value.trim());
});

loadApod("");
