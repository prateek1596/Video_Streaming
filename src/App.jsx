import React, { useEffect, useMemo, useRef, useState } from "react";
import Bell from "lucide-react/dist/esm/icons/bell.js";
import Bookmark from "lucide-react/dist/esm/icons/bookmark.js";
import BookmarkCheck from "lucide-react/dist/esm/icons/bookmark-check.js";
import CalendarDays from "lucide-react/dist/esm/icons/calendar-days.js";
import CheckCircle2 from "lucide-react/dist/esm/icons/check-circle-2.js";
import Captions from "lucide-react/dist/esm/icons/captions.js";
import CirclePlus from "lucide-react/dist/esm/icons/circle-plus.js";
import ChevronLeft from "lucide-react/dist/esm/icons/chevron-left.js";
import ChevronRight from "lucide-react/dist/esm/icons/chevron-right.js";
import Clock3 from "lucide-react/dist/esm/icons/clock-3.js";
import Gauge from "lucide-react/dist/esm/icons/gauge.js";
import Home from "lucide-react/dist/esm/icons/home.js";
import Info from "lucide-react/dist/esm/icons/info.js";
import Library from "lucide-react/dist/esm/icons/library.js";
import ListVideo from "lucide-react/dist/esm/icons/list-video.js";
import MessageCircle from "lucide-react/dist/esm/icons/message-circle.js";
import Play from "lucide-react/dist/esm/icons/play.js";
import RotateCcw from "lucide-react/dist/esm/icons/rotate-ccw.js";
import Search from "lucide-react/dist/esm/icons/search.js";
import Settings from "lucide-react/dist/esm/icons/settings.js";
import SendHorizontal from "lucide-react/dist/esm/icons/send-horizontal.js";
import ShieldCheck from "lucide-react/dist/esm/icons/shield-check.js";
import SkipForward from "lucide-react/dist/esm/icons/skip-forward.js";
import Share2 from "lucide-react/dist/esm/icons/share-2.js";
import Sparkles from "lucide-react/dist/esm/icons/sparkles.js";
import Star from "lucide-react/dist/esm/icons/star.js";
import TrendingUp from "lucide-react/dist/esm/icons/trending-up.js";
import TvMinimalPlay from "lucide-react/dist/esm/icons/tv-minimal-play.js";
import Trash2 from "lucide-react/dist/esm/icons/trash-2.js";
import WandSparkles from "lucide-react/dist/esm/icons/wand-sparkles.js";
import UsersRound from "lucide-react/dist/esm/icons/users-round.js";
import X from "lucide-react/dist/esm/icons/x.js";
import { anime, genres, sampleVideo, schedule } from "./data.js";
import heroImage from "../assets/hero-anime-city.png";

const storageKey = "anipulse-react-state";
const sortOptions = ["Trending", "Newest", "Episodes", "A-Z"];
const languageOptions = ["All audio", "Sub", "Sub / Dub"];
const speedOptions = ["0.75x", "1x", "1.25x", "1.5x", "2x"];
const defaultSessionQueue = ["signal-bloom", "cloud-atelier", "starfall-railway"];
const defaultPartyMessages = [
  { id: "party-1", animeId: "neon-ronin-zero", episode: 1, author: "Mika", text: "The city reveal still lands every time.", tone: "Hype" },
  { id: "party-2", animeId: "signal-bloom", episode: 7, author: "Rin", text: "That flower code has to be a map.", tone: "Theory" },
  { id: "party-3", animeId: "cloud-atelier", episode: 11, author: "Aya", text: "Weather painting is such a beautiful power system.", tone: "Vibe" },
];

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

function initialEpisodeMap(storedEpisodes) {
  return Object.fromEntries(anime.map((item) => [item.id, clampEpisode(storedEpisodes?.[item.id] || item.currentEpisode, item)]));
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

function Topbar({ query, onQueryChange, reminderItems, quality, captionsOn, onPlay, onReminderToggle, onQualityChange, onCaptionsToggle, onResetLibrary }) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

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
        <div className="notification-wrap">
          <IconButton
            label="Notifications"
            className={`icon-button notification-button ${isNotificationsOpen ? "active" : ""}`}
            aria-expanded={isNotificationsOpen}
            onClick={() => setIsNotificationsOpen((current) => !current)}
          >
            <Bell size={18} />
            {reminderItems.length > 0 && <span className="notification-badge">{reminderItems.length}</span>}
          </IconButton>
          {isNotificationsOpen && (
            <div className="notification-panel">
              <div className="notification-heading">
                <p className="eyebrow">Reminders</p>
                <strong>{reminderItems.length ? `${reminderItems.length} queued` : "All clear"}</strong>
              </div>
              <div className="notification-list">
                {reminderItems.length ? (
                  reminderItems.map((item) => (
                    <article className="notification-row" key={item.id}>
                      <button className="notification-art" style={{ "--poster": item.poster }} type="button" onClick={() => onPlay(item.id, item.currentEpisode, true)}>
                        E{item.currentEpisode}
                      </button>
                      <div>
                        <strong>{item.title}</strong>
                        <span>{item.nextRelease}</span>
                      </div>
                      <IconButton label={`Clear reminder for ${item.title}`} className="notification-clear" onClick={() => onReminderToggle(item.id)}>
                        <CheckCircle2 size={16} />
                      </IconButton>
                    </article>
                  ))
                ) : (
                  <div className="notification-empty">No release reminders are active.</div>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="profile-wrap">
          <button
            className={`profile-button ${isProfileOpen ? "active" : ""}`}
            type="button"
            aria-label="Profile preferences"
            aria-expanded={isProfileOpen}
            onClick={() => setIsProfileOpen((current) => !current)}
          >
            PR
          </button>
          {isProfileOpen && (
            <div className="profile-panel">
              <div className="profile-heading">
                <div>
                  <p className="eyebrow">Profile</p>
                  <strong>Prateek</strong>
                </div>
                <Settings size={18} />
              </div>
              <label className="profile-field">
                <span>Default quality</span>
                <select value={quality} onChange={(event) => onQualityChange(event.target.value)}>
                  <option>Auto</option>
                  <option>1080p</option>
                  <option>720p</option>
                  <option>480p</option>
                </select>
              </label>
              <button className={`profile-toggle ${captionsOn ? "active" : ""}`} type="button" onClick={onCaptionsToggle}>
                <Captions size={17} />
                {captionsOn ? "Captions enabled" : "Captions disabled"}
              </button>
              <button className="profile-reset" type="button" onClick={onResetLibrary}>
                <RotateCcw size={17} />
                Reset library state
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}


function NowPlayingStrip({ item, selectedEpisode, quality, captionsOn, progress }) {
  const completion = Math.min(100, Math.max(0, Number(progress) || 0));

  return (
    <section className="now-playing-strip" aria-label="Now playing summary">
      <div>
        <span className="pulse-dot" />
        <strong>{item.title}</strong>
        <span>{episodeLabel(selectedEpisode)}</span>
      </div>
      <div className="strip-meta">
        <span>{quality}</span>
        <span>{captionsOn ? "Captions on" : "Captions off"}</span>
        <span>{`${completion}% watched`}</span>
      </div>
      <a href="#watch">Jump to player</a>
    </section>
  );
}
function Hero({ item, selectedEpisode, isSaved, onPlay, onSave, onDetails }) {
  return (
    <div className="hero-copy">
      <p className="eyebrow">Original streaming prototype</p>
      <h1>{item.title}</h1>
      <p>{item.description}</p>
      <div className="meta-row">
        {[item.genre, item.rating, item.year, item.language, `${item.episodes} episodes`].map((value) => (
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

function Player({
  item,
  selectedEpisode,
  shouldAutoPlay,
  quality,
  captionsOn,
  playbackSpeed,
  autoplayNext,
  skipIntro,
  onEpisodeSelect,
  onProgress,
  onQualityChange,
  onCaptionsToggle,
  onSpeedChange,
  onSkipIntroToggle,
  onStepEpisode,
}) {
  const videoRef = useRef(null);

  useEffect(() => {
    const player = videoRef.current;
    if (!player) return;
    player.load();
    player.playbackRate = Number.parseFloat(playbackSpeed) || 1;
    if (shouldAutoPlay) player.play().catch(() => {});
  }, [item.id, selectedEpisode, playbackSpeed, shouldAutoPlay]);

  useEffect(() => {
    const player = videoRef.current;
    if (player) player.playbackRate = Number.parseFloat(playbackSpeed) || 1;
  }, [playbackSpeed]);

  function handleTimeUpdate(event) {
    const player = event.currentTarget;
    if (!player.duration) return;
    const watched = Math.min(99, Math.round((player.currentTime / player.duration) * 100));
    if (watched > 0) onProgress(item.id, selectedEpisode, watched);
  }

  function handleEnded() {
    onProgress(item.id, selectedEpisode, 100);
    if (autoplayNext && selectedEpisode < item.episodes) onStepEpisode(1, true);
  }

  function skipIntroAhead() {
    const player = videoRef.current;
    if (!player) return;
    player.currentTime = Math.min((player.duration || 100) - 1, player.currentTime + 85);
  }

  return (
    <div className="player-panel" aria-label="Video player">
      <video ref={videoRef} controls poster={heroImage} onTimeUpdate={handleTimeUpdate} onEnded={handleEnded}>
        <source src={sampleVideo} type="video/mp4" />
      </video>
      <div className="player-caption">
        <div>
          <span className="now-playing">Now playing</span>
          <strong>{`${item.title} - ${episodeLabel(selectedEpisode)}`}</strong>
        </div>
        <span>{item.duration}</span>
      </div>
      <div className="player-controls" aria-label="Playback options">
        <IconButton
          label="Previous episode"
          className="compact-icon-button"
          disabled={selectedEpisode <= 1}
          onClick={() => onStepEpisode(-1, true)}
        >
          <ChevronLeft size={18} />
        </IconButton>
        <IconButton
          label="Next episode"
          className="compact-icon-button"
          disabled={selectedEpisode >= item.episodes}
          onClick={() => onStepEpisode(1, true)}
        >
          <ChevronRight size={18} />
        </IconButton>
        <label className="select-control">
          <span>Quality</span>
          <select value={quality} onChange={(event) => onQualityChange(event.target.value)}>
            <option>Auto</option>
            <option>1080p</option>
            <option>720p</option>
            <option>480p</option>
          </select>
        </label>
        <label className="select-control">
          <span>Speed</span>
          <select value={playbackSpeed} onChange={(event) => onSpeedChange(event.target.value)}>
            {speedOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
        <button className={`caption-toggle ${captionsOn ? "active" : ""}`} type="button" onClick={onCaptionsToggle}>
          <Captions size={18} />
          <span>{captionsOn ? "Captions on" : "Captions off"}</span>
        </button>
        <button className={`caption-toggle ${skipIntro ? "active" : ""}`} type="button" onClick={onSkipIntroToggle}>
          <SkipForward size={18} />
          <span>{skipIntro ? "Skip intro on" : "Skip intro off"}</span>
        </button>
        {skipIntro && (
          <button className="caption-toggle" type="button" onClick={skipIntroAhead}>
            <SkipForward size={18} />
            <span>Jump intro</span>
          </button>
        )}
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


function WatchBrief({ item, selectedEpisode, progress }) {
  const nextEpisode = Math.min(selectedEpisode + 1, item.episodes);
  const completion = Math.min(100, Math.max(0, Number(progress) || 0));

  return (
    <aside className="watch-brief" aria-label="Watch session details">
      <div>
        <p className="eyebrow">Session</p>
        <h2>{item.mood}</h2>
      </div>
      <div className="brief-stats">
        <div>
          <Star size={17} fill="currentColor" />
          <span>{item.popularity}% match</span>
        </div>
        <div>
          <CalendarDays size={17} />
          <span>{item.nextRelease}</span>
        </div>
        <div>
          <TrendingUp size={17} />
          <span>{completion}% watched</span>
        </div>
      </div>
      <div className="brief-progress" aria-label={`${completion}% watched`}>
        <span style={{ width: `${completion}%` }} />
      </div>
      <div className="brief-next">
        <span>Up next</span>
        <strong>{`${episodeLabel(nextEpisode)} / ${item.duration}`}</strong>
      </div>
      <div className="tag-row">
        {item.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
    </aside>
  );
}

function PlaybackPreferences({ playbackSpeed, autoplayNext, ambientMode, skipIntro, onSpeedChange, onAutoplayToggle, onAmbientToggle, onSkipIntroToggle }) {
  return (
    <aside className="playback-preferences" aria-label="Playback preferences">
      <div className="preferences-heading">
        <div>
          <p className="eyebrow">Preferences</p>
          <h2>Playback setup</h2>
        </div>
        <Gauge size={18} />
      </div>
      <label className="preference-select">
        <span>Speed</span>
        <select value={playbackSpeed} onChange={(event) => onSpeedChange(event.target.value)}>
          {speedOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </label>
      <div className="preference-toggles">
        <button className={autoplayNext ? "active" : ""} type="button" onClick={onAutoplayToggle}>
          <Play size={16} fill="currentColor" />
          Autoplay next
        </button>
        <button className={skipIntro ? "active" : ""} type="button" onClick={onSkipIntroToggle}>
          <SkipForward size={16} />
          Skip intro
        </button>
        <button className={ambientMode ? "active" : ""} type="button" onClick={onAmbientToggle}>
          <WandSparkles size={16} />
          Ambient glow
        </button>
      </div>
    </aside>
  );
}
function EpisodeQueue({ item, selectedEpisode, progress, onEpisodeSelect }) {
  const completion = Math.min(100, Math.max(0, Number(progress) || 0));

  return (
    <aside className="episode-queue" aria-label="Episode queue">
      <div className="queue-heading">
        <div>
          <p className="eyebrow">Episodes</p>
          <h2>{item.title}</h2>
        </div>
        <span>{`${selectedEpisode}/${item.episodes}`}</span>
      </div>
      <div className="queue-list">
        {Array.from({ length: item.episodes }, (_, index) => {
          const episodeNumber = index + 1;
          const isActive = episodeNumber === selectedEpisode;
          const isWatched = episodeNumber < selectedEpisode || (isActive && completion >= 90);
          return (
            <button
              className={`queue-episode ${isActive ? "active" : ""} ${isWatched ? "watched" : ""}`}
              key={episodeNumber}
              type="button"
              onClick={() => onEpisodeSelect(item.id, episodeNumber, true)}
            >
              <span>{`E${episodeNumber}`}</span>
              <strong>{isActive ? `${completion}% watched` : isWatched ? "Watched" : "Ready"}</strong>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

function WatchNotes({ item, selectedEpisode, note, onNoteChange }) {
  const maxLength = 360;

  return (
    <aside className="watch-notes" aria-label="Episode notes">
      <div className="notes-heading">
        <div>
          <p className="eyebrow">Notes</p>
          <h2>{episodeLabel(selectedEpisode)}</h2>
        </div>
        <span>{item.title}</span>
      </div>
      <textarea
        maxLength={maxLength}
        placeholder="Scene, quote, reaction..."
        value={note}
        onChange={(event) => onNoteChange(event.target.value)}
      />
      <div className="notes-meta">
        <span>{`${note.length}/${maxLength}`}</span>
        <strong>Saved locally</strong>
      </div>
    </aside>
  );
}
function WatchParty({ item, selectedEpisode, messages, onSendMessage }) {
  const [draft, setDraft] = useState("");
  const activeMessages = messages.filter((message) => message.animeId === item.id && message.episode === selectedEpisode).slice(-5);
  const viewerCount = item.popularity + selectedEpisode * 3;
  const reactions = ["Hype", "Theory", "Wow"];

  function handleSubmit(event) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    onSendMessage({ animeId: item.id, episode: selectedEpisode, text });
    setDraft("");
  }

  function sendReaction(tone) {
    onSendMessage({ animeId: item.id, episode: selectedEpisode, text: `${tone} moment`, tone });
  }

  return (
    <aside className="watch-party" aria-label="Watch party">
      <div className="party-heading">
        <div>
          <p className="eyebrow">Watch party</p>
          <h2>{episodeLabel(selectedEpisode)}</h2>
        </div>
        <span>
          <UsersRound size={16} />
          {viewerCount}
        </span>
      </div>
      <div className="party-actions" aria-label="Watch party actions">
        <button type="button">
          <Share2 size={16} />
          Invite
        </button>
        {reactions.map((reaction) => (
          <button key={reaction} type="button" onClick={() => sendReaction(reaction)}>
            <MessageCircle size={16} />
            {reaction}
          </button>
        ))}
      </div>
      <div className="party-feed" aria-live="polite">
        {activeMessages.length ? (
          activeMessages.map((message) => (
            <article className="party-message" key={message.id}>
              <span>{message.author}</span>
              <p>{message.text}</p>
              <strong>{message.tone || "Live"}</strong>
            </article>
          ))
        ) : (
          <div className="party-empty">Start the episode chat for this watch session.</div>
        )}
      </div>
      <form className="party-form" onSubmit={handleSubmit}>
        <input
          maxLength={120}
          placeholder="Add a spoiler-free reaction"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
        />
        <IconButton label="Send reaction" className="party-send" type="submit">
          <SendHorizontal size={17} />
        </IconButton>
      </form>
    </aside>
  );
}
function SessionQueue({ items, currentEpisodes, selected, onPlay, onAddCurrent, onRemove, onClear }) {
  return (
    <aside className="session-queue" aria-label="Session queue">
      <div className="session-queue-heading">
        <div>
          <p className="eyebrow">Lineup</p>
          <h2>Session queue</h2>
        </div>
        <span>{`${items.length} queued`}</span>
      </div>
      <div className="session-queue-actions">
        <button type="button" onClick={() => onAddCurrent(selected.id)}>
          <CirclePlus size={16} />
          Add current
        </button>
        <button type="button" disabled={!items.length} onClick={onClear}>
          <Trash2 size={16} />
          Clear
        </button>
      </div>
      <div className="session-queue-list">
        {items.length ? (
          items.map((item) => {
            const episode = currentEpisodes[item.id] || item.currentEpisode;
            return (
              <article className="session-queue-row" key={item.id}>
                <button className="session-queue-art" style={{ "--poster": item.poster }} type="button" onClick={() => onPlay(item.id, episode, true)}>
                  E{episode}
                </button>
                <div>
                  <strong>{item.title}</strong>
                  <span>{`${episodeLabel(episode)} / ${item.duration}`}</span>
                </div>
                <div className="session-queue-row-actions">
                  <IconButton label={`Play ${item.title}`} className="session-queue-icon" onClick={() => onPlay(item.id, episode, true)}>
                    <Play size={16} fill="currentColor" />
                  </IconButton>
                  <IconButton label={`Remove ${item.title} from queue`} className="session-queue-icon" onClick={() => onRemove(item.id)}>
                    <X size={16} />
                  </IconButton>
                </div>
              </article>
            );
          })
        ) : (
          <div className="session-queue-empty">Add shows to build this watch session.</div>
        )}
      </div>
    </aside>
  );
}
function AnimeCard({ item, isSaved, isReminderOn, onPlay, onSave, onDetails, onReminderToggle }) {
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
          <div className="card-tags">
            {item.tags.slice(0, 2).map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
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
          <IconButton
            label={`${isReminderOn ? "Disable" : "Enable"} reminder for ${item.title}`}
            className={`save-button reminder-save ${isReminderOn ? "saved" : ""}`}
            onClick={() => onReminderToggle(item.id)}
          >
            {isReminderOn ? <CheckCircle2 size={17} /> : <Bell size={17} />}
          </IconButton>
        </div>
      </div>
    </article>
  );
}

function ContinueCard({ item, progress, onPlay, onMarkComplete, onResetProgress }) {
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
        <div className="progress-actions">
          <button type="button" onClick={() => onMarkComplete(item.id, item.currentEpisode)}>
            <CheckCircle2 size={16} />
            Complete
          </button>
          <button type="button" onClick={() => onResetProgress(item.id)}>
            <RotateCcw size={16} />
            Reset
          </button>
        </div>
      </div>
    </article>
  );
}

function ActivitySummary({ watchingCount, completedCount, nextUp }) {
  const stats = [
    [Clock3, "Watching", watchingCount],
    [CheckCircle2, "Completed", completedCount],
    [TvMinimalPlay, "Next up", nextUp || "Pick a show"],
  ];

  return (
    <div className="activity-summary" aria-label="Viewing activity summary">
      {stats.map(([Icon, label, value]) => (
        <div className="activity-stat" key={label}>
          <Icon size={18} />
          <span>{label}</span>
          <strong>{value}</strong>
        </div>
      ))}
    </div>
  );
}


function recommendationReason(item, selected) {
  if (item.genre === selected.genre) return `${selected.genre} pick`;
  if (item.language === selected.language) return item.language;
  if (item.year === selected.year) return `Fresh ${item.year}`;
  const sharedTag = item.tags.find((tag) => selected.tags.includes(tag));
  return sharedTag || item.mood;
}

function ForYouRail({ items, selected, saved, reminders, onPlay, onSave, onDetails, onReminderToggle }) {
  return (
    <section className="for-you-rail" aria-label="Personalized recommendations">
      <div className="section-heading compact-heading">
        <div>
          <p className="eyebrow">For you</p>
          <h2>Because you watched {selected.title}</h2>
        </div>
      </div>
      <div className="for-you-grid">
        {items.map((item) => {
          const isSaved = saved.has(item.id);
          const isReminderOn = reminders.has(item.id);
          return (
            <article className="for-you-card" key={item.id}>
              <button className="for-you-art" style={{ "--poster": item.poster }} type="button" onClick={() => onDetails(item.id)}>
                <span>{item.title}</span>
              </button>
              <div className="for-you-body">
                <div>
                  <span className="match-pill">{`${item.popularity}% match`}</span>
                  <strong>{item.title}</strong>
                  <p>{recommendationReason(item, selected)}</p>
                </div>
                <div className="for-you-actions">
                  <button className="watch-button" type="button" onClick={() => onPlay(item.id, item.currentEpisode, true)}>
                    <Play size={16} fill="currentColor" />
                    Play
                  </button>
                  <IconButton
                    label={`${isSaved ? "Remove" : "Save"} ${item.title}`}
                    className={`save-button ${isSaved ? "saved" : ""}`}
                    onClick={() => onSave(item.id)}
                  >
                    {isSaved ? <BookmarkCheck size={17} /> : <Bookmark size={17} />}
                  </IconButton>
                  <IconButton
                    label={`${isReminderOn ? "Disable" : "Enable"} reminder for ${item.title}`}
                    className={`save-button reminder-save ${isReminderOn ? "saved" : ""}`}
                    onClick={() => onReminderToggle(item.id)}
                  >
                    {isReminderOn ? <CheckCircle2 size={17} /> : <Bell size={17} />}
                  </IconButton>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
function LibraryStats({ savedCount, reminderCount, averageProgress, nextRelease }) {
  const stats = [
    [Library, "Saved", savedCount || "0"],
    [Bell, "Reminders", reminderCount || "0"],
    [TvMinimalPlay, "Progress", `${averageProgress}%`],
    [ShieldCheck, "Next release", nextRelease || "None"],
  ];

  return (
    <div className="library-stats" aria-label="Library stats">
      {stats.map(([Icon, label, value]) => (
        <div className="library-stat" key={label}>
          <Icon size={18} />
          <span>{label}</span>
          <strong>{value}</strong>
        </div>
      ))}
    </div>
  );
}


function CollectionShelf({ collections, onPlay, onDetails }) {
  return (
    <div className="collection-shelf" aria-label="Curated collections">
      {collections.map((collection) => (
        <section className="collection-card" key={collection.title}>
          <div>
            <p className="eyebrow">{collection.kicker}</p>
            <h3>{collection.title}</h3>
          </div>
          <div className="collection-items">
            {collection.items.map((item) => (
              <article className="collection-item" key={item.id}>
                <button className="collection-art" style={{ "--poster": item.poster }} type="button" onClick={() => onDetails(item.id)}>
                  {item.title}
                </button>
                <div>
                  <strong>{item.title}</strong>
                  <span>{`${item.genre} / ${item.mood}`}</span>
                </div>
                <button className="collection-play" type="button" onClick={() => onPlay(item.id, item.currentEpisode, true)}>
                  <Play size={15} fill="currentColor" />
                  Play
                </button>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function SeasonTracker({ items, progress, currentEpisodes, onPlay, onDetails }) {
  const trackerItems = items.length ? items : anime.slice(0, 4);

  return (
    <section className="season-tracker" aria-label="Season tracker">
      <div className="section-heading compact-heading">
        <div>
          <p className="eyebrow">Tracker</p>
          <h2>Season progress</h2>
        </div>
      </div>
      <div className="tracker-list">
        {trackerItems.map((item) => {
          const watched = Math.min(100, Math.max(0, Number(progress[item.id] ?? item.progress) || 0));
          const episode = currentEpisodes[item.id] || item.currentEpisode;
          return (
            <article className="tracker-row" key={item.id}>
              <button className="tracker-art" style={{ "--poster": item.poster }} type="button" onClick={() => onDetails(item.id)}>
                E{episode}
              </button>
              <div className="tracker-copy">
                <div>
                  <strong>{item.title}</strong>
                  <span>{`${item.nextRelease} / ${item.duration}`}</span>
                </div>
                <div className="tracker-progress" aria-label={`${watched}% watched`}>
                  <span style={{ width: `${watched}%` }} />
                </div>
              </div>
              <button className="watch-button" type="button" onClick={() => onPlay(item.id, episode, true)}>
                <Play size={16} fill="currentColor" />
                Resume
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
function ReminderQueue({ items, reminders, onReminderToggle, onPlay }) {
  return (
    <aside className="reminder-panel" aria-label="Release reminders">
      <div>
        <p className="eyebrow">Alerts</p>
        <h2>Release reminders</h2>
      </div>
      <div className="reminder-list">
        {items.length ? (
          items.map((item) => {
            const isReminderOn = reminders.has(item.id);
            return (
              <article className="reminder-row" key={item.id}>
                <button className="reminder-art" style={{ "--poster": item.poster }} type="button" onClick={() => onPlay(item.id, item.currentEpisode, true)}>
                  E{item.currentEpisode}
                </button>
                <div>
                  <strong>{item.title}</strong>
                  <span>{item.nextRelease}</span>
                </div>
                <IconButton
                  label={`${isReminderOn ? "Disable" : "Enable"} reminder for ${item.title}`}
                  className={`reminder-toggle ${isReminderOn ? "active" : ""}`}
                  onClick={() => onReminderToggle(item.id)}
                >
                  {isReminderOn ? <CheckCircle2 size={17} /> : <Bell size={17} />}
                </IconButton>
              </article>
            );
          })
        ) : (
          <div className="empty-state compact-empty">Save shows to build a reminder queue.</div>
        )}
      </div>
    </aside>
  );
}

function WeeklyPlanner({ scheduleItems, reminders, onReminderToggle, onPlay, onDetails }) {
  return (
    <aside className="schedule-panel weekly-planner" aria-label="Release schedule">
      <p className="eyebrow">Release schedule</p>
      <h2>This week</h2>
      <div className="planner-list">
        {scheduleItems.map(({ day, item }) => {
          const isReminderOn = reminders.has(item.id);
          return (
            <article className="planner-row" key={day}>
              <button className="planner-day" type="button" onClick={() => onDetails(item.id)}>
                {day}
              </button>
              <div className="planner-copy">
                <strong>{item.title}</strong>
                <span>{`${item.genre} / ${item.nextRelease}`}</span>
              </div>
              <div className="planner-actions">
                <IconButton
                  label={`${isReminderOn ? "Disable" : "Enable"} reminder for ${item.title}`}
                  className={`planner-icon ${isReminderOn ? "active" : ""}`}
                  onClick={() => onReminderToggle(item.id)}
                >
                  {isReminderOn ? <CheckCircle2 size={16} /> : <Bell size={16} />}
                </IconButton>
                <IconButton label={`Play ${item.title}`} className="planner-icon" onClick={() => onPlay(item.id, item.currentEpisode, true)}>
                  <Play size={16} fill="currentColor" />
                </IconButton>
              </div>
            </article>
          );
        })}
      </div>
    </aside>
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
              ["Language", item.language],
              ["Next", item.nextRelease],
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
          <div className="tag-row dialog-tags">
            {item.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
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
  const [currentEpisodes, setCurrentEpisodes] = useState(() => initialEpisodeMap(stored?.currentEpisodes));
  const [filter, setFilter] = useState("All");
  const [sortMode, setSortMode] = useState("Trending");
  const [languageFilter, setLanguageFilter] = useState("All audio");
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState(() => new Set(stored?.saved || ["signal-bloom", "cloud-atelier"]));
  const [reminders, setReminders] = useState(() => new Set(stored?.reminders || ["neon-ronin-zero", "signal-bloom"]));
  const [progress, setProgress] = useState(() => stored?.progress || Object.fromEntries(anime.map((item) => [item.id, item.progress])));
  const [detailsId, setDetailsId] = useState(null);
  const [activeSection, setActiveSection] = useState("watch");
  const [shouldAutoPlay, setShouldAutoPlay] = useState(false);
  const [quality, setQuality] = useState(stored?.quality || "Auto");
  const [captionsOn, setCaptionsOn] = useState(Boolean(stored?.captionsOn));
  const [notes, setNotes] = useState(() => stored?.notes || {});
  const [partyMessages, setPartyMessages] = useState(() => stored?.partyMessages || defaultPartyMessages);
  const [sessionQueue, setSessionQueue] = useState(() => stored?.sessionQueue || defaultSessionQueue);

  const selected = anime.find((item) => item.id === selectedId) || anime[0];
  const detailsItem = anime.find((item) => item.id === detailsId) || null;
  const activeNoteKey = `${selected.id}:${selectedEpisode}`;

  const filteredAnime = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const results = anime.filter((item) => {
      const searchable = `${item.title} ${item.genre} ${item.studio} ${item.year} ${item.tags.join(" ")}`.toLowerCase();
      const matchesFilter = filter === "All" || item.genre === filter;
      const matchesLanguage = languageFilter === "All audio" || item.language === languageFilter;
      const matchesQuery = searchable.includes(normalizedQuery);
      return matchesFilter && matchesLanguage && matchesQuery;
    });

    return [...results].sort((a, b) => {
      if (sortMode === "Newest") return Number(b.year) - Number(a.year) || b.popularity - a.popularity;
      if (sortMode === "Episodes") return b.episodes - a.episodes;
      if (sortMode === "A-Z") return a.title.localeCompare(b.title);
      return b.popularity - a.popularity;
    });
  }, [filter, languageFilter, query, sortMode]);

  const continueItems = useMemo(
    () => anime.filter((item) => Number(progress[item.id] ?? item.progress) > 0).slice(0, 4),
    [progress],
  );
  const completedCount = useMemo(() => anime.filter((item) => Number(progress[item.id] ?? 0) >= 100).length, [progress]);
  const nextContinueTitle = continueItems[0]
    ? `${continueItems[0].title} E${currentEpisodes[continueItems[0].id] || continueItems[0].currentEpisode}`
    : "Pick a show";

  const discoverCollections = useMemo(
    () => [
      {
        kicker: "Popular",
        title: "Top matches",
        items: [...anime].sort((a, b) => b.popularity - a.popularity).slice(0, 3),
      },
      {
        kicker: "Fresh",
        title: "New this year",
        items: anime.filter((item) => item.year === "2026").slice(0, 3),
      },
      {
        kicker: "Mood",
        title: "Comfort watches",
        items: anime.filter((item) => ["Cozy", "Wonder", "Dreamlike"].includes(item.mood)).slice(0, 3),
      },
    ],
    [],
  );


  const recommendedItems = useMemo(() => {
    return anime
      .filter((item) => item.id !== selected.id)
      .map((item) => {
        const sharedTags = item.tags.filter((tag) => selected.tags.includes(tag)).length;
        const score =
          item.popularity +
          (item.genre === selected.genre ? 18 : 0) +
          (item.language === selected.language ? 8 : 0) +
          (item.year === selected.year ? 6 : 0) +
          sharedTags * 7;
        return { ...item, recommendationScore: score };
      })
      .sort((a, b) => b.recommendationScore - a.recommendationScore)
      .slice(0, 4);
  }, [selected]);

  const scheduleItems = useMemo(
    () =>
      schedule.map(([day, title]) => ({
        day,
        item: anime.find((candidate) => candidate.title === title) || anime[0],
      })),
    [],
  );  const savedItems = useMemo(() => anime.filter((item) => saved.has(item.id)), [saved]);
  const reminderItems = useMemo(() => anime.filter((item) => reminders.has(item.id)), [reminders]);
  const libraryAverageProgress = useMemo(() => {
    if (!savedItems.length) return 0;
    const total = savedItems.reduce((sum, item) => sum + Number((progress[item.id] ?? item.progress) || 0), 0);
    return Math.round(total / savedItems.length);
  }, [progress, savedItems]);
  const nextSavedRelease = savedItems.find((item) => reminders.has(item.id))?.nextRelease || savedItems[0]?.nextRelease;
  const sessionQueueItems = useMemo(() => sessionQueue.map((id) => anime.find((item) => item.id === id)).filter(Boolean), [sessionQueue]);

  useEffect(() => {
    const payload = {
      selectedId,
      selectedEpisode,
      currentEpisodes,
      saved: Array.from(saved),
      reminders: Array.from(reminders),
      progress,
      quality,
      captionsOn,
      notes,
      partyMessages,
      sessionQueue,
    };
    localStorage.setItem(storageKey, JSON.stringify(payload));
  }, [selectedId, selectedEpisode, currentEpisodes, saved, reminders, progress, quality, captionsOn, notes, partyMessages, sessionQueue]);

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
    const nextEpisode = clampEpisode(episodeNumber || currentEpisodes[item.id], item);
    setSelectedId(item.id);
    setSelectedEpisode(nextEpisode);
    setCurrentEpisodes((current) => ({ ...current, [item.id]: nextEpisode }));
    setShouldAutoPlay(autoPlay);
    setDetailsId(null);
    document.getElementById("watch")?.scrollIntoView({ behavior: "smooth" });
  }

  function stepEpisode(direction, autoPlay = false) {
    playSelection(selected.id, selectedEpisode + direction, autoPlay);
  }

  function toggleSave(id) {
    setSaved((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }


  function toggleReminder(id) {
    setReminders((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function markComplete(id, episodeNumber) {
    setProgress((current) => ({ ...current, [id]: 100 }));
    setCurrentEpisodes((current) => ({ ...current, [id]: episodeNumber }));
  }

  function resetProgress(id) {
    const item = anime.find((candidate) => candidate.id === id) || anime[0];
    setProgress((current) => ({ ...current, [id]: 0 }));
    setCurrentEpisodes((current) => ({ ...current, [id]: item.currentEpisode }));
    if (selectedId === id) setSelectedEpisode(item.currentEpisode);
  }

  function resetLibraryState() {
    setSelectedId(anime[0].id);
    setSelectedEpisode(anime[0].currentEpisode);
    setCurrentEpisodes(initialEpisodeMap());
    setSaved(new Set(["signal-bloom", "cloud-atelier"]));
    setReminders(new Set(["neon-ronin-zero", "signal-bloom"]));
    setProgress(Object.fromEntries(anime.map((item) => [item.id, item.progress])));
    setQuality("Auto");
    setCaptionsOn(false);
    setNotes({});
    setPartyMessages(defaultPartyMessages);
    setSessionQueue(defaultSessionQueue);
    setDetailsId(null);
    setShouldAutoPlay(false);
  }


  function updateNote(value) {
    setNotes((current) => ({ ...current, [activeNoteKey]: value }));
  }

  function sendPartyMessage(message) {
    setPartyMessages((current) => [
      ...current.slice(-24),
      {
        id: `party-${Date.now()}`,
        author: "You",
        tone: message.tone || "Live",
        ...message,
      },
    ]);
  }


  function addToSessionQueue(id) {
    setSessionQueue((current) => (current.includes(id) ? current : [...current, id]));
  }

  function removeFromSessionQueue(id) {
    setSessionQueue((current) => current.filter((itemId) => itemId !== id));
  }

  function clearSessionQueue() {
    setSessionQueue([]);
  }

  function updateProgress(id, episodeNumber, watched) {
    setProgress((current) => ({ ...current, [id]: Math.max(current[id] || 0, watched) }));
    setCurrentEpisodes((current) => ({ ...current, [id]: episodeNumber }));
  }

  return (
    <div className="app-shell">
      <Sidebar activeSection={activeSection} />
      <main className="main-area">
        <Topbar query={query} onQueryChange={setQuery} reminderItems={reminderItems} quality={quality} captionsOn={captionsOn} onPlay={playSelection} onReminderToggle={toggleReminder} onQualityChange={setQuality} onCaptionsToggle={() => setCaptionsOn((current) => !current)} onResetLibrary={resetLibraryState} />
        <NowPlayingStrip item={selected} selectedEpisode={selectedEpisode} quality={quality} captionsOn={captionsOn} progress={progress[selected.id]} />

        <section className="watch-stage" id="watch">
          <Hero
            item={selected}
            selectedEpisode={selectedEpisode}
            isSaved={saved.has(selected.id)}
            onPlay={playSelection}
            onSave={toggleSave}
            onDetails={setDetailsId}
          />
          <div className="watch-stack">
            <Player
              item={selected}
              selectedEpisode={selectedEpisode}
              shouldAutoPlay={shouldAutoPlay}
              quality={quality}
              captionsOn={captionsOn}
              onEpisodeSelect={playSelection}
              onProgress={updateProgress}
              onQualityChange={setQuality}
              onCaptionsToggle={() => setCaptionsOn((current) => !current)}
              onStepEpisode={stepEpisode}
            />
            <WatchBrief item={selected} selectedEpisode={selectedEpisode} progress={progress[selected.id]} />
            <EpisodeQueue item={selected} selectedEpisode={selectedEpisode} progress={progress[selected.id]} onEpisodeSelect={playSelection} />
            <WatchNotes
              item={selected}
              selectedEpisode={selectedEpisode}
              note={notes[activeNoteKey] || ""}
              onNoteChange={updateNote}
            />
            <WatchParty
              item={selected}
              selectedEpisode={selectedEpisode}
              messages={partyMessages}
              onSendMessage={sendPartyMessage}
            />
            <SessionQueue
              items={sessionQueueItems}
              currentEpisodes={currentEpisodes}
              selected={selected}
              onPlay={playSelection}
              onAddCurrent={addToSessionQueue}
              onRemove={removeFromSessionQueue}
              onClear={clearSessionQueue}
            />
          </div>
        </section>

        <section className="content-band" id="continue">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Resume</p>
              <h2>Continue watching</h2>
            </div>
          </div>
          <ActivitySummary watchingCount={continueItems.length} completedCount={completedCount} nextUp={nextContinueTitle} />
          <div className="continue-grid">
            {continueItems.map((item) => (
              <ContinueCard
                key={item.id}
                item={{ ...item, currentEpisode: currentEpisodes[item.id] || item.currentEpisode }}
                progress={progress[item.id] ?? item.progress}
                onPlay={playSelection}
                onMarkComplete={markComplete}
                onResetProgress={resetProgress}
              />
            ))}
          </div>
        </section>


        <ForYouRail
          items={recommendedItems}
          selected={selected}
          saved={saved}
          reminders={reminders}
          onPlay={playSelection}
          onSave={toggleSave}
          onDetails={setDetailsId}
          onReminderToggle={toggleReminder}
        />
        <section className="content-band" id="discover">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Browse</p>
              <h2>Explore anime</h2>
            </div>
            <div className="browse-tools">
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
              <label className="sort-control">
                <span>Audio</span>
                <select value={languageFilter} onChange={(event) => setLanguageFilter(event.target.value)}>
                  {languageOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </label>
              <label className="sort-control">
                <span>Sort</span>
                <select value={sortMode} onChange={(event) => setSortMode(event.target.value)}>
                  {sortOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>
          <CollectionShelf collections={discoverCollections} onPlay={playSelection} onDetails={setDetailsId} />
          <div className="anime-grid" aria-live="polite">
            {filteredAnime.length ? (
              filteredAnime.map((item) => (
                <AnimeCard
                  key={item.id}
                  item={item}
                  isSaved={saved.has(item.id)}
                  isReminderOn={reminders.has(item.id)}
                  onPlay={playSelection}
                  onSave={toggleSave}
                  onDetails={setDetailsId}
                  onReminderToggle={toggleReminder}
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
                    <div className="episode-meta">{`${episodeLabel(item.currentEpisode)} / ${item.genre} / ${item.nextRelease}`}</div>
                  </div>
                  <button className="watch-button" type="button" onClick={() => playSelection(item.id, item.currentEpisode, true)}>
                    <Play size={16} fill="currentColor" />
                    Play
                  </button>
                </article>
              ))}
            </div>
          </div>
          <WeeklyPlanner
            scheduleItems={scheduleItems}
            reminders={reminders}
            onReminderToggle={toggleReminder}
            onPlay={playSelection}
            onDetails={setDetailsId}
          />
        </section>

        <section className="content-band" id="watchlist">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Library</p>
              <h2>Saved anime</h2>
            </div>
          </div>
          <LibraryStats
            savedCount={savedItems.length}
            reminderCount={reminderItems.length}
            averageProgress={libraryAverageProgress}
            nextRelease={nextSavedRelease}
          />
          <SeasonTracker
            items={savedItems}
            progress={progress}
            currentEpisodes={currentEpisodes}
            onPlay={playSelection}
            onDetails={setDetailsId}
          />
          <div className="library-layout">
            <div className="anime-grid">
              {savedItems.length ? (
                savedItems.map((item) => (
                  <AnimeCard
                    key={item.id}
                    item={item}
                    isSaved={saved.has(item.id)}
                    isReminderOn={reminders.has(item.id)}
                    onPlay={playSelection}
                    onSave={toggleSave}
                    onDetails={setDetailsId}
                    onReminderToggle={toggleReminder}
                  />
                ))
              ) : (
                <div className="empty-state">Your saved list is empty.</div>
              )}
            </div>
            <ReminderQueue items={savedItems.length ? savedItems : anime.slice(0, 3)} reminders={reminders} onReminderToggle={toggleReminder} onPlay={playSelection} />
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













