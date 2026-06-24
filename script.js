const anime = [
  {
    id: "neon-ronin-zero",
    title: "Neon Ronin Zero",
    genre: "Action",
    rating: "PG-13",
    year: "2026",
    episodes: 12,
    duration: "24m",
    progress: "Ep 1",
    description:
      "A fugitive swordswoman and an exiled broadcast engineer race through a city where memories are bought as entertainment.",
    poster: "linear-gradient(145deg, #17213a, #ff4f67 48%, #2ce6d3)",
  },
  {
    id: "signal-bloom",
    title: "Signal Bloom",
    genre: "Sci-Fi",
    rating: "TV-14",
    year: "2025",
    episodes: 10,
    duration: "23m",
    progress: "Ep 7",
    description:
      "Students decode flowers that transmit messages from a vanished orbital garden.",
    poster: "linear-gradient(145deg, #11131b, #8d7cff 48%, #7be495)",
  },
  {
    id: "moonlit-bento-club",
    title: "Moonlit Bento Club",
    genre: "Slice of Life",
    rating: "TV-PG",
    year: "2026",
    episodes: 8,
    duration: "22m",
    progress: "Ep 3",
    description:
      "A midnight cooking club turns quiet meals into tiny acts of courage.",
    poster: "linear-gradient(145deg, #2b1d35, #f6c85f 52%, #ff8f5a)",
  },
  {
    id: "cloud-atelier",
    title: "Cloud Atelier",
    genre: "Fantasy",
    rating: "TV-PG",
    year: "2024",
    episodes: 24,
    duration: "25m",
    progress: "Ep 11",
    description:
      "A weather painter apprentices under an impatient sky architect above the floating provinces.",
    poster: "linear-gradient(145deg, #1f4a5a, #f4f7fb 42%, #8d7cff)",
  },
  {
    id: "after-school-orbit",
    title: "After School Orbit",
    genre: "Sci-Fi",
    rating: "TV-14",
    year: "2025",
    episodes: 13,
    duration: "24m",
    progress: "Ep 2",
    description:
      "A school astronomy team discovers their observatory has been steering a hidden satellite.",
    poster: "linear-gradient(145deg, #071014, #2ce6d3 44%, #f6c85f)",
  },
  {
    id: "iron-kitsune-court",
    title: "Iron Kitsune Court",
    genre: "Action",
    rating: "TV-14",
    year: "2026",
    episodes: 16,
    duration: "24m",
    progress: "Ep 5",
    description:
      "A disgraced guard protects a mechanical shrine through tournament season.",
    poster: "linear-gradient(145deg, #241318, #ff4f67 45%, #f6c85f)",
  },
];

const sampleVideo =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

const state = {
  selectedId: anime[0].id,
  filter: "All",
  query: "",
  saved: new Set(["signal-bloom"]),
};

const animeGrid = document.querySelector("#animeGrid");
const episodeList = document.querySelector("#episodeList");
const searchInput = document.querySelector("#searchInput");
const filterTabs = document.querySelectorAll(".filter-tab");
const featuredTitle = document.querySelector("#featuredTitle");
const featuredDescription = document.querySelector("#featuredDescription");
const featuredMeta = document.querySelector("#featuredMeta");
const playerTitle = document.querySelector("#playerTitle");
const playerDuration = document.querySelector("#playerDuration");
const videoPlayer = document.querySelector("#videoPlayer");
const playFeatured = document.querySelector("#playFeatured");
const saveFeatured = document.querySelector("#saveFeatured");

function currentAnime() {
  return anime.find((item) => item.id === state.selectedId) || anime[0];
}

function matchesSearch(item) {
  const haystack = `${item.title} ${item.genre} ${item.year}`.toLowerCase();
  return haystack.includes(state.query.trim().toLowerCase());
}

function filteredAnime() {
  return anime.filter((item) => {
    const filterMatch = state.filter === "All" || item.genre === state.filter;
    return filterMatch && matchesSearch(item);
  });
}

function setFeatured(id, shouldPlay = false) {
  state.selectedId = id;
  const item = currentAnime();
  featuredTitle.textContent = item.title;
  featuredDescription.textContent = item.description;
  featuredMeta.innerHTML = [
    item.genre,
    item.rating,
    item.year,
    `${item.episodes} episodes`,
  ]
    .map((value) => `<span class="meta-pill">${value}</span>`)
    .join("");
  playerTitle.textContent = `${item.title} - ${item.progress}`;
  playerDuration.textContent = item.duration;
  saveFeatured.innerHTML = `<span aria-hidden="true">${state.saved.has(item.id) ? "★" : "☆"}</span> ${
    state.saved.has(item.id) ? "Saved" : "Save"
  }`;
  videoPlayer.src = sampleVideo;
  if (shouldPlay) {
    videoPlayer.play().catch(() => {});
  }
  renderGrid();
  renderEpisodes();
}

function toggleSave(id) {
  if (state.saved.has(id)) {
    state.saved.delete(id);
  } else {
    state.saved.add(id);
  }
  setFeatured(state.selectedId);
}

function renderGrid() {
  const items = filteredAnime();
  if (!items.length) {
    animeGrid.innerHTML = `<div class="empty-state">No anime matched your search.</div>`;
    return;
  }

  animeGrid.innerHTML = items
    .map(
      (item) => `
        <article class="anime-card">
          <div class="poster" style="--poster: ${item.poster}">
            <span class="poster-title">${item.title}</span>
          </div>
          <div class="anime-card-body">
            <div>
              <strong>${item.title}</strong>
              <div class="anime-card-meta">${item.genre} · ${item.rating} · ${item.episodes} eps</div>
            </div>
            <div class="card-actions">
              <button class="watch-button" type="button" data-watch="${item.id}">
                <span aria-hidden="true">▶</span>
                Watch
              </button>
              <button class="save-button ${state.saved.has(item.id) ? "saved" : ""}" type="button" data-save="${
                item.id
              }" aria-label="Save ${item.title}">
                ${state.saved.has(item.id) ? "★" : "☆"}
              </button>
            </div>
          </div>
        </article>
      `,
    )
    .join("");
}

function renderEpisodes() {
  episodeList.innerHTML = anime
    .slice(0, 5)
    .map(
      (item, index) => `
        <article class="episode-row">
          <div class="episode-thumb" style="--poster: ${item.poster}">E${index + 1}</div>
          <div>
            <p class="episode-title">${item.title}</p>
            <div class="episode-meta">${item.progress} · ${item.genre} · ${item.duration}</div>
          </div>
          <button class="watch-button" type="button" data-watch="${item.id}">
            <span aria-hidden="true">▶</span>
            Play
          </button>
        </article>
      `,
    )
    .join("");
}

animeGrid.addEventListener("click", (event) => {
  const watchId = event.target.closest("[data-watch]")?.dataset.watch;
  const saveId = event.target.closest("[data-save]")?.dataset.save;
  if (watchId) {
    setFeatured(watchId, true);
    document.querySelector("#watch").scrollIntoView({ behavior: "smooth" });
  }
  if (saveId) {
    toggleSave(saveId);
  }
});

episodeList.addEventListener("click", (event) => {
  const watchId = event.target.closest("[data-watch]")?.dataset.watch;
  if (watchId) {
    setFeatured(watchId, true);
    document.querySelector("#watch").scrollIntoView({ behavior: "smooth" });
  }
});

filterTabs.forEach((button) => {
  button.addEventListener("click", () => {
    filterTabs.forEach((tab) => tab.classList.remove("active"));
    button.classList.add("active");
    state.filter = button.dataset.filter;
    renderGrid();
  });
});

searchInput.addEventListener("input", (event) => {
  state.query = event.target.value;
  renderGrid();
});

playFeatured.addEventListener("click", () => {
  setFeatured(state.selectedId, true);
});

saveFeatured.addEventListener("click", () => {
  toggleSave(state.selectedId);
});

setFeatured(state.selectedId);
