import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bell,
  Bookmark,
  BookmarkCheck,
  ChevronRight,
  Clock3,
  Home,
  Info,
  Library,
  ListVideo,
  Play,
  Search,
  Sparkles,
  Tv,
  X,
} from "lucide-react";
import { anime, genres, sampleVideo, schedule } from "./data.js";
import heroImage from "../assets/hero-anime-city.png";

const storageKey = "anipulse-react-state";

function readStoredState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(storageKey));
    if (!parsed) return null;
    return parsed;
  } catch {
    return null;
  }
}

function episodeLabel(episodeNumber) {
  return `Episode ${episodeNumber}`;
}

function clampEpisode(value, item) {
  return Math.min(Math.max(Number(value) || item.currentEpisode, 1), item.episodes);
}

function IconButton({ label, children, className = "icon-button", ...props }) {
  return (
    <button className={className} type="button" aria-label={label} title={label} {...props}>
      {children}
    </button>
  );
}

function Sidebar({ activeSection }) {
  const navItems = [
    ["watch", "Home", Home],
    ["discover", "Discover", Sparkles],
    ["continue", "Continue", Clock3],
    ["latest", "Latest", ListVideo],
    ["watchlist", "Saved", Library],
  ];

  return (
    <aside className="sidebar" aria-label="Primary navigation">
      <a className="brand" href="#watch">
        <span className="brand-mark">A</span>
        <span>AniPulse</span>
      </a>
      <nav className="nav-stack">
        {navItems.map(([id, label, Icon]) => (
          <a key={id} className={`nav-item ${activeSection === id ? "active" : ""}`} href={`#${id}`}>
            <Icon size={18} strokeWidth={2.2} />
            <span>{label}</span>
          </a>
        ))}
      </nav>
      <div className="side-panel">
        <p className="panel-kicker">Tonight</p>
        <strong>6 premieres</strong>
        <span>New episodes refresh every evening.</span>
      </div>
    </aside>
  );
}

function Topbar({ query, onQueryChange }) {
  return (
    <header className="topbar">
      <label className="search-wrap">
        <Search size={18} />
        <input
          type="search"
          placeholder="Search anime, genres, studios"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </label>
      <div className="top-actions">
        <IconButton label="Notifications">
          <Bell size={18} />
        </IconButton>
        <button className="profile-button" type="button" aria-label="Profile">
          PR
        </button>
      </div>
    </header>
  );
}

function Hero({ item, selectedEpisode, isSaved, onPlay, onSave, onDetails }) {
  return (
    <div className="hero-copy">
      <p className="eyebrow">Original streaming prototype</p>
      <h1>{item.title}</h1>
      <p>{item.description}</p>
      <div className="meta-row">
        {[item.genre, item.rating, item.year, item.studio, `${item.episodes} episodes`].map((value) => (
          <span className="meta-pill" key={value}>
            {value}
          </span>
        ))}
      </div>
      <div className="hero-actions">
        <button className="primary-button" type="button" onClick={() => onPlay(item.id, selectedEpisode, true)}>
          <Play size={18} fill="currentColor" />
          Watch now
        </button>
        <button className="secondary-button" type="button" onClick={() => onSave(item.id)}>
          {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
          {isSaved ? "Saved" : "Save"}
        </button>
        <button className="secondary-button" type="button" onClick={() => onDetails(item.id)}>
          <Info size={18} />
          Details
        </button>
      </div>
    </div>
  );
}

function Player({ item, selectedEpisode, shouldAutoPlay, onEpisodeSelect, onProgress }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const player = videoRef.current;
    if (!player) return;
    player.load();
    if (shouldAutoPlay) player.play().catch(() => {});
  }, [item.id, selectedEpisode, shouldAutoPlay]);

  function handleTimeUpdate(event) {
    const player = event.currentTarget;
    if (!player.duration) return;
    const watched = Math.min(99, Math.round((player.currentTime / player.duration) * 100));
    if (watched > 0) onProgress(item.id, selectedEpisode, watched);
  }

  return (
    <div className="player-panel" aria-label="Video player">
      <video ref={videoRef} controls poster={heroImage} onTimeUpdate={handleTimeUpdate}>
        <source src={sampleVideo} type="video/mp4" />
      </video>
      <div className="player-caption">
        <div>
          <span className="now-playing">Now playing</span>
          <strong>{`${item.title} - ${episodeLabel(selectedEpisode)}`}</strong>
        </div>
        <span>{item.duration}</span>
      </div>
      <div className="season-strip" aria-label="Episodes">
        {Array.from({ length: Math.min(item.episodes, 12) }, (_, index) => index + 1).map((episodeNumber) => (
          <button
            className={`episode-chip ${episodeNumber === selectedEpisode ? "active" : ""}`}
            key={episodeNumber}
            type="button"
            onClick={() => onEpisodeSelect(item.id, episodeNumber, true)}
          >
            E{episodeNumber}
          </button>
        ))}
      </div>
    </div>
  );
}

function AnimeCard({ item, isSaved, onPlay, onSave, onDetails }) {
  return (
    <article className="anime-card">
      <button
        className="poster"
        style={{ "--poster": item.poster }}
        type="button"
        onClick={() => onDetails(item.id)}
        aria-label={`View ${item.title} details`}
      >
        <span className="poster-title">{item.title}</span>
      </button>
      <div className="anime-card-body">
        <div>
          <strong>{item.title}</strong>
          <div className="anime-card-meta">{`${item.genre} / ${item.rating} / ${item.episodes} eps`}</div>
        </div>
        <div className="card-actions">
          <button className="watch-button" type="button" onClick={() => onPlay(item.id, item.currentEpisode, true)}>
            <Play size={16} fill="currentColor" />
            Watch
          </button>
          <IconButton
            label={`${isSaved ? "Remove" : "Save"} ${item.title}`}
            className={`save-button ${isSaved ? "saved" : ""}`}
            onClick={() => onSave(item.id)}
          >
            {isSaved ? <BookmarkCheck size={17} /> : <Bookmark size={17} />}
          </IconButton>
        </div>
      </div>
    </article>
  );
}

function ContinueCard({ item, progress, onPlay }) {
  return (
    <article className="continue-card">
      <button
        className="continue-art"
        style={{ "--poster": item.poster }}
        type="button"
        onClick={() => onPlay(item.id, item.currentEpisode, true)}
      >
        <span>{item.title}</span>
      </button>
      <div className="continue-body">
        <div>
          <strong>{item.title}</strong>
          <span>{`${episodeLabel(item.currentEpisode)} / ${item.duration}`}</span>
        </div>
        <div className="progress-track" aria-label={`${progress}% watched`}>
          <span style={{ width: `${progress}%` }} />
        </div>
      </div>
    </article>
  );
}

function DetailsDialog({ item, isSaved, onClose, onPlay, onSave }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (item && !dialog.open) dialog.showModal();
    if (!item && dialog.open) dialog.close();
  }, [item]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return undefined;
    const handleClose = () => onClose();
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  if (!item) return <dialog className="details-dialog" ref={dialogRef} />;

  return (
    <dialog className="details-dialog" ref={dialogRef} onClick={(event) => event.target === dialogRef.current && onClose()}>
      <div className="dialog-shell">
        <IconButton label="Close details" className="dialog-close" onClick={onClose}>
          <X size={18} />
        </IconButton>
        <div className="dialog-poster" style={{ "--poster": item.poster }}>
          {item.title}
        </div>
        <div className="dialog-content">
          <p className="eyebrow">{`${item.genre} / ${item.studio}`}</p>
          <h2>{item.title}</h2>
          <p>{item.description}</p>
          <div className="stat-grid">
            {[
              ["Rating", item.rating],
              ["Year", item.year],
              ["Episodes", item.episodes],
              ["Runtime", item.duration],
            ].map(([label, value]) => (
              <div key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
          <div className="dialog-actions">
            <button className="primary-button" type="button" onClick={() => onPlay(item.id, item.currentEpisode, true)}>
              <Play size={18} fill="currentColor" />
              Play episode {item.currentEpisode}
            </button>
            <button className="secondary-button" type="button" onClick={() => onSave(item.id)}>
              {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
              {isSaved ? "Saved" : "Save"}
            </button>
          </div>
          <h3>Episodes</h3>
          <div className="dialog-episodes">
            {Array.from({ length: item.episodes }, (_, index) => index + 1).map((episodeNumber) => (
              <button className="episode-chip" key={episodeNumber} type="button" onClick={() => onPlay(item.id, episodeNumber, true)}>
                E{episodeNumber}
              </button>
            ))}
          </div>
        </div>
      </div>
    </dialog>
  );
}

function App() {
  const stored = readStoredState();
  const [selectedId, setSelectedId] = useState(stored?.selectedId || anime[0].id);
  const [selectedEpisode, setSelectedEpisode] = useState(stored?.selectedEpisode || anime[0].currentEpisode);
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState(() => new Set(stored?.saved || ["signal-bloom", "cloud-atelier"]));
  const [progress, setProgress] = useState(() => stored?.progress || Object.fromEntries(anime.map((item) => [item.id, item.progress])));
  const [detailsId, setDetailsId] = useState(null);
  const [activeSection, setActiveSection] = useState("watch");
  const [shouldAutoPlay, setShouldAutoPlay] = useState(false);

  const selected = anime.find((item) => item.id === selectedId) || anime[0];
  const detailsItem = anime.find((item) => item.id === detailsId) || null;

  const filteredAnime = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return anime.filter((item) => {
      const matchesFilter = filter === "All" || item.genre === filter;
      const matchesQuery = `${item.title} ${item.genre} ${item.studio} ${item.year}`.toLowerCase().includes(normalizedQuery);
      return matchesFilter && matchesQuery;
    });
  }, [filter, query]);

  const continueItems = useMemo(
    () => anime.filter((item) => Number(progress[item.id] || item.progress) > 0).slice(0, 4),
    [progress],
  );

  const savedItems = useMemo(() => anime.filter((item) => saved.has(item.id)), [saved]);

  useEffect(() => {
    const payload = {
      selectedId,
      selectedEpisode,
      saved: Array.from(saved),
      progress,
    };
    localStorage.setItem(storageKey, JSON.stringify(payload));
  }, [selectedId, selectedEpisode, saved, progress]);

  useEffect(() => {
    const sections = ["watch", "continue", "discover", "latest", "watchlist"]
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0.05, 0.2, 0.45] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  function playSelection(id, episodeNumber, autoPlay = false) {
    const item = anime.find((candidate) => candidate.id === id) || anime[0];
    setSelectedId(item.id);
    setSelectedEpisode(clampEpisode(episodeNumber, item));
    setShouldAutoPlay(autoPlay);
    setDetailsId(null);
    document.getElementById("watch")?.scrollIntoView({ behavior: "smooth" });
  }

  function toggleSave(id) {
    setSaved((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function updateProgress(id, episodeNumber, watched) {
    setProgress((current) => ({ ...current, [id]: Math.max(current[id] || 0, watched) }));
    const item = anime.find((candidate) => candidate.id === id);
  }

  return (
    <div className="app-shell">
      <Sidebar activeSection={activeSection} />
      <main className="main-area">
        <Topbar query={query} onQueryChange={setQuery} />

        <section className="watch-stage" id="watch">
          <Hero
            item={selected}
            selectedEpisode={selectedEpisode}
            isSaved={saved.has(selected.id)}
            onPlay={playSelection}
            onSave={toggleSave}
            onDetails={setDetailsId}
          />
          <Player
            item={selected}
            selectedEpisode={selectedEpisode}
            shouldAutoPlay={shouldAutoPlay}
            onEpisodeSelect={playSelection}
            onProgress={updateProgress}
          />
        </section>

        <section className="content-band" id="continue">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Resume</p>
              <h2>Continue watching</h2>
            </div>
          </div>
          <div className="continue-grid">
            {continueItems.map((item) => (
              <ContinueCard key={item.id} item={item} progress={progress[item.id] || item.progress} onPlay={playSelection} />
            ))}
          </div>
        </section>

        <section className="content-band" id="discover">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Browse</p>
              <h2>Explore anime</h2>
            </div>
            <div className="filter-tabs" role="tablist" aria-label="Genre filters">
              {genres.map((genre) => (
                <button
                  className={`filter-tab ${filter === genre ? "active" : ""}`}
                  key={genre}
                  type="button"
                  role="tab"
                  aria-selected={filter === genre}
                  onClick={() => setFilter(genre)}
                >
                  {genre === "Slice of Life" ? "Slice" : genre}
                </button>
              ))}
            </div>
          </div>
          <div className="anime-grid" aria-live="polite">
            {filteredAnime.length ? (
              filteredAnime.map((item) => (
                <AnimeCard
                  key={item.id}
                  item={item}
                  isSaved={saved.has(item.id)}
                  onPlay={playSelection}
                  onSave={toggleSave}
                  onDetails={setDetailsId}
                />
              ))
            ) : (
              <div className="empty-state">No anime matched your search.</div>
            )}
          </div>
        </section>

        <section className="content-band split-layout" id="latest">
          <div>
            <div className="section-heading compact-heading">
              <div>
                <p className="eyebrow">Queue</p>
                <h2>Latest episodes</h2>
              </div>
            </div>
            <div className="episode-list">
              {anime.slice(0, 6).map((item) => (
                <article className="episode-row" key={item.id}>
                  <button className="episode-thumb" style={{ "--poster": item.poster }} type="button" onClick={() => setDetailsId(item.id)}>
                    E{item.currentEpisode}
                  </button>
                  <div>
                    <p className="episode-title">{item.title}</p>
                    <div className="episode-meta">{`${episodeLabel(item.currentEpisode)} / ${item.genre} / ${item.duration}`}</div>
                  </div>
                  <button className="watch-button" type="button" onClick={() => playSelection(item.id, item.currentEpisode, true)}>
                    <Play size={16} fill="currentColor" />
                    Play
                  </button>
                </article>
              ))}
            </div>
          </div>
          <aside className="schedule-panel" aria-label="Release schedule">
            <p className="eyebrow">Release schedule</p>
            <h2>This week</h2>
            {schedule.map(([day, title]) => (
              <div className="schedule-row" key={day}>
                <span>{day}</span>
                <strong>{title}</strong>
              </div>
            ))}
          </aside>
        </section>

        <section className="content-band" id="watchlist">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Library</p>
              <h2>Saved anime</h2>
            </div>
          </div>
          <div className="anime-grid">
            {savedItems.length ? (
              savedItems.map((item) => (
                <AnimeCard
                  key={item.id}
                  item={item}
                  isSaved={saved.has(item.id)}
                  onPlay={playSelection}
                  onSave={toggleSave}
                  onDetails={setDetailsId}
                />
              ))
            ) : (
              <div className="empty-state">Your saved list is empty.</div>
            )}
          </div>
        </section>
      </main>

      <DetailsDialog
        item={detailsItem}
        isSaved={detailsItem ? saved.has(detailsItem.id) : false}
        onClose={() => setDetailsId(null)}
        onPlay={playSelection}
        onSave={toggleSave}
      />
    </div>
  );
}

export default App;

