const anime = [
  { id: "neon-ronin-zero", title: "Neon Ronin Zero", genre: "Action", studio: "Northline Works", rating: "PG-13", year: "2026", episodes: 12, duration: "24m", progress: 38, currentEpisode: 1, description: "A fugitive swordswoman and an exiled broadcast engineer race through a city where memories are bought as entertainment.", poster: "linear-gradient(145deg, #17213a, #ff4f67 48%, #2ce6d3)" },
  { id: "signal-bloom", title: "Signal Bloom", genre: "Sci-Fi", studio: "Glass Harbor", rating: "TV-14", year: "2025", episodes: 10, duration: "23m", progress: 72, currentEpisode: 7, description: "Students decode flowers that transmit messages from a vanished orbital garden.", poster: "linear-gradient(145deg, #11131b, #8d7cff 48%, #7be495)" },
  { id: "moonlit-bento-club", title: "Moonlit Bento Club", genre: "Slice of Life", studio: "Soft Rail", rating: "TV-PG", year: "2026", episodes: 8, duration: "22m", progress: 44, currentEpisode: 3, description: "A midnight cooking club turns quiet meals into tiny acts of courage.", poster: "linear-gradient(145deg, #2b1d35, #f6c85f 52%, #ff8f5a)" },
  { id: "cloud-atelier", title: "Cloud Atelier", genre: "Fantasy", studio: "Mira Frame", rating: "TV-PG", year: "2024", episodes: 24, duration: "25m", progress: 51, currentEpisode: 11, description: "A weather painter apprentices under an impatient sky architect above the floating provinces.", poster: "linear-gradient(145deg, #1f4a5a, #f4f7fb 42%, #8d7cff)" },
  { id: "after-school-orbit", title: "After School Orbit", genre: "Sci-Fi", studio: "Copper Lens", rating: "TV-14", year: "2025", episodes: 13, duration: "24m", progress: 18, currentEpisode: 2, description: "A school astronomy team discovers their observatory has been steering a hidden satellite.", poster: "linear-gradient(145deg, #071014, #2ce6d3 44%, #f6c85f)" },
  { id: "iron-kitsune-court", title: "Iron Kitsune Court", genre: "Action", studio: "Red Gate Motion", rating: "TV-14", year: "2026", episodes: 16, duration: "24m", progress: 29, currentEpisode: 5, description: "A disgraced guard protects a mechanical shrine through tournament season.", poster: "linear-gradient(145deg, #241318, #ff4f67 45%, #f6c85f)" },
  { id: "paper-lantern-files", title: "Paper Lantern Files", genre: "Mystery", studio: "Indigo Desk", rating: "TV-14", year: "2026", episodes: 9, duration: "24m", progress: 8, currentEpisode: 1, description: "A junior archivist investigates impossible case files hidden in festival lanterns.", poster: "linear-gradient(145deg, #14171f, #b9d96d 42%, #ff4f67)" },
  { id: "starfall-railway", title: "Starfall Railway", genre: "Fantasy", studio: "Harbor Nine", rating: "TV-PG", year: "2025", episodes: 18, duration: "25m", progress: 63, currentEpisode: 9, description: "A conductor-in-training guides a night train that collects fallen stars before dawn.", poster: "linear-gradient(145deg, #0a1020, #2ce6d3 38%, #8d7cff)" },
];

const sampleVideo = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
const state = { selectedId: anime[0].id, selectedEpisode: anime[0].currentEpisode, filter: "All", query: "", saved: new Set(["signal-bloom", "cloud-atelier"]) };

const $ = (selector) => document.querySelector(selector);
const animeGrid = $("#animeGrid");
const continueGrid = $("#continueGrid");
const episodeList = $("#episodeList");
const watchlistGrid = $("#watchlistGrid");
const searchInput = $("#searchInput");
const filterTabs = document.querySelectorAll(".filter-tab");
const featuredTitle = $("#featuredTitle");
const featuredDescription = $("#featuredDescription");
const featuredMeta = $("#featuredMeta");
const playerTitle = $("#playerTitle");
const playerDuration = $("#playerDuration");
const seasonStrip = $("#seasonStrip");
const videoPlayer = $("#videoPlayer");
const playFeatured = $("#playFeatured");
const saveFeatured = $("#saveFeatured");
const openDetails = $("#openDetails");
const detailsDialog = $("#detailsDialog");
const closeDetails = $("#closeDetails");
const dialogPoster = $("#dialogPoster");
const dialogGenre = $("#dialogGenre");
const dialogTitle = $("#dialogTitle");
const dialogDescription = $("#dialogDescription");
const dialogStats = $("#dialogStats");
const dialogEpisodes = $("#dialogEpisodes");

function currentAnime() {
  return anime.find((item) => item.id === state.selectedId) || anime[0];
}

function matchesSearch(item) {
  return `${item.title} ${item.genre} ${item.studio} ${item.year}`.toLowerCase().includes(state.query.trim().toLowerCase());
}

function filteredAnime() {
  return anime.filter((item) => (state.filter === "All" || item.genre === state.filter) && matchesSearch(item));
}

function episodeLabel(episodeNumber) {
  return `Episode ${episodeNumber}`;
}

function playSelection(id, episodeNumber, shouldPlay = false) {
  state.selectedId = id;
  const item = currentAnime();
  state.selectedEpisode = Math.min(Math.max(Number(episodeNumber) || item.currentEpisode, 1), item.episodes);
  featuredTitle.textContent = item.title;
  featuredDescription.textContent = item.description;
  featuredMeta.innerHTML = [item.genre, item.rating, item.year, item.studio, `${item.episodes} episodes`].map((value) => `<span class="meta-pill">${value}</span>`).join("");
  playerTitle.textContent = `${item.title} - ${episodeLabel(state.selectedEpisode)}`;
  playerDuration.textContent = item.duration;
  saveFeatured.innerHTML = `<span>${state.saved.has(item.id) ? "-" : "+"}</span>${state.saved.has(item.id) ? "Saved" : "Save"}`;
  videoPlayer.src = sampleVideo;
  if (shouldPlay) videoPlayer.play().catch(() => {});
  renderAll();
}

function toggleSave(id) {
  state.saved.has(id) ? state.saved.delete(id) : state.saved.add(id);
  playSelection(state.selectedId, state.selectedEpisode);
}

function cardMarkup(item) {
  return `<article class="anime-card"><button class="poster" style="--poster: ${item.poster}" type="button" data-details="${item.id}" aria-label="View ${item.title} details"><span class="poster-title">${item.title}</span></button><div class="anime-card-body"><div><strong>${item.title}</strong><div class="anime-card-meta">${item.genre} / ${item.rating} / ${item.episodes} eps</div></div><div class="card-actions"><button class="watch-button" type="button" data-watch="${item.id}" data-episode="${item.currentEpisode}"><span>&gt;</span>Watch</button><button class="save-button ${state.saved.has(item.id) ? "saved" : ""}" type="button" data-save="${item.id}" aria-label="Save ${item.title}">${state.saved.has(item.id) ? "-" : "+"}</button></div></div></article>`;
}

function renderGrid() {
  const items = filteredAnime();
  animeGrid.innerHTML = items.length ? items.map(cardMarkup).join("") : `<div class="empty-state">No anime matched your search.</div>`;
}

function renderContinue() {
  continueGrid.innerHTML = anime.filter((item) => item.progress > 0).slice(0, 4).map((item) => `<article class="continue-card"><button class="continue-art" style="--poster: ${item.poster}" type="button" data-watch="${item.id}" data-episode="${item.currentEpisode}"><span>${item.title}</span></button><div class="continue-body"><div><strong>${item.title}</strong><span>${episodeLabel(item.currentEpisode)} / ${item.duration}</span></div><div class="progress-track" aria-label="${item.progress}% watched"><span style="width: ${item.progress}%"></span></div></div></article>`).join("");
}

function renderSeasonStrip() {
  const item = currentAnime();
  seasonStrip.innerHTML = Array.from({ length: Math.min(item.episodes, 12) }, (_, index) => index + 1).map((episodeNumber) => `<button class="episode-chip ${episodeNumber === state.selectedEpisode ? "active" : ""}" type="button" data-watch="${item.id}" data-episode="${episodeNumber}">E${episodeNumber}</button>`).join("");
}

function renderEpisodes() {
  episodeList.innerHTML = anime.slice(0, 6).map((item) => `<article class="episode-row"><button class="episode-thumb" style="--poster: ${item.poster}" type="button" data-details="${item.id}">E${item.currentEpisode}</button><div><p class="episode-title">${item.title}</p><div class="episode-meta">${episodeLabel(item.currentEpisode)} / ${item.genre} / ${item.duration}</div></div><button class="watch-button" type="button" data-watch="${item.id}" data-episode="${item.currentEpisode}"><span>&gt;</span>Play</button></article>`).join("");
}

function renderWatchlist() {
  const savedItems = anime.filter((item) => state.saved.has(item.id));
  watchlistGrid.innerHTML = savedItems.length ? savedItems.map(cardMarkup).join("") : `<div class="empty-state">Your saved list is empty.</div>`;
}

function renderDetails(id = state.selectedId) {
  const item = anime.find((candidate) => candidate.id === id) || currentAnime();
  dialogPoster.style.setProperty("--poster", item.poster);
  dialogPoster.textContent = item.title;
  dialogGenre.textContent = `${item.genre} / ${item.studio}`;
  dialogTitle.textContent = item.title;
  dialogDescription.textContent = item.description;
  dialogStats.innerHTML = [["Rating", item.rating], ["Year", item.year], ["Episodes", item.episodes], ["Runtime", item.duration]].map(([label, value]) => `<div><span>${label}</span><strong>${value}</strong></div>`).join("");
  dialogEpisodes.innerHTML = Array.from({ length: item.episodes }, (_, index) => index + 1).map((episodeNumber) => `<button class="episode-chip" type="button" data-watch="${item.id}" data-episode="${episodeNumber}">E${episodeNumber}</button>`).join("");
}

function openDetailsFor(id) {
  renderDetails(id);
  if (typeof detailsDialog.showModal === "function") detailsDialog.showModal();
  else detailsDialog.setAttribute("open", "");
}

function renderAll() {
  renderGrid();
  renderContinue();
  renderSeasonStrip();
  renderEpisodes();
  renderWatchlist();
}

document.body.addEventListener("click", (event) => {
  const watchTarget = event.target.closest("[data-watch]");
  const saveTarget = event.target.closest("[data-save]");
  const detailTarget = event.target.closest("[data-details]");
  if (watchTarget) {
    playSelection(watchTarget.dataset.watch, watchTarget.dataset.episode, true);
    document.querySelector("#watch").scrollIntoView({ behavior: "smooth" });
    if (detailsDialog.open) detailsDialog.close();
  }
  if (saveTarget) toggleSave(saveTarget.dataset.save);
  if (detailTarget) openDetailsFor(detailTarget.dataset.details);
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

playFeatured.addEventListener("click", () => playSelection(state.selectedId, state.selectedEpisode, true));
saveFeatured.addEventListener("click", () => toggleSave(state.selectedId));
openDetails.addEventListener("click", () => openDetailsFor(state.selectedId));
closeDetails.addEventListener("click", () => detailsDialog.close());
detailsDialog.addEventListener("click", (event) => { if (event.target === detailsDialog) detailsDialog.close(); });

playSelection(state.selectedId, state.selectedEpisode);
