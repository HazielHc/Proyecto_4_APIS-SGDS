const form = document.getElementById("search-form");
const tagInput = document.getElementById("tag");
const statusText = document.getElementById("status");
const resultsContainer = document.getElementById("results");

function renderArticles(tag, articles) {
  if (articles.length === 0) {
    statusText.textContent = `No articles found for "${tag}".`;
    resultsContainer.innerHTML = "";
    return;
  }

  statusText.textContent = `Showing ${articles.length} article(s) for "${tag}".`;
  resultsContainer.innerHTML = articles
    .map(
      (article) => `
        <article class="card">
          <img src="${article.cover}" alt="Cover for ${article.title}" />
          <div class="card-body">
            <h2>${article.title}</h2>
            <p class="meta">Author: ${article.author}</p>
            <p class="meta">Published: ${article.publishedAt}</p>
            <p class="meta">Reading time: ${article.readingTime} min</p>
            <p class="description">${article.description}</p>
            <div class="tags">${article.tags.map((tagName) => `<span>${tagName}</span>`).join("")}</div>
            <a href="${article.url}" target="_blank" rel="noreferrer">Open article</a>
          </div>
        </article>
      `
    )
    .join("");
}

async function loadArticles(tag) {
  statusText.textContent = `Loading articles for "${tag}"...`;
  resultsContainer.innerHTML = "";

  try {
    const response = await fetch(`/api/articles?tag=${encodeURIComponent(tag)}`);
    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.error || "Request failed.");
    }

    renderArticles(payload.tag, payload.articles);
  } catch (error) {
    statusText.textContent = `Error: ${error.message}`;
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const tag = tagInput.value.trim();

  if (!tag) {
    statusText.textContent = "Write a tag first.";
    return;
  }

  loadArticles(tag);
});

loadArticles(tagInput.value.trim());
