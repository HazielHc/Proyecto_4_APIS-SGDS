const form = document.getElementById("search-form");
const queryInput = document.getElementById("query");
const statusText = document.getElementById("status");
const resultsContainer = document.getElementById("results");

function renderSongs(query, songs) {
  if (songs.length === 0) {
    resultsContainer.innerHTML = "";
    statusText.textContent = `No results found for "${query}".`;
    return;
  }

  statusText.textContent = `Showing ${songs.length} result(s) for "${query}".`;
  resultsContainer.innerHTML = songs
    .map(
      (song) => `
        <article class="card">
          <img src="${song.cover}" alt="Album cover for ${song.album}" />
          <div class="card-body">
            <h2>${song.title}</h2>
            <p class="meta">Artist: ${song.artist}</p>
            <p class="meta">Album: ${song.album}</p>
            <a href="${song.link}" target="_blank" rel="noreferrer">Open in Deezer</a>
            ${song.preview ? `<audio controls src="${song.preview}"></audio>` : ""}
          </div>
        </article>
      `
    )
    .join("");
}

async function loadSongs(query) {
  statusText.textContent = `Searching for "${query}"...`;
  resultsContainer.innerHTML = "";

  try {
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.error || "Request failed.");
    }

    renderSongs(payload.query, payload.songs);
  } catch (error) {
    statusText.textContent = `Error: ${error.message}`;
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const query = queryInput.value.trim();

  if (!query) {
    statusText.textContent = "Write an artist or song name first.";
    return;
  }

  loadSongs(query);
});

loadSongs(queryInput.value.trim());
