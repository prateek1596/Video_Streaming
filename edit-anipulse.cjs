const fs = require("fs");
const path = "src/App.jsx";
let text = fs.readFileSync(path, "utf8");
if (!text.includes("function initialEpisodeMap")) {
  text = text.replace(
`function clampEpisode(value, item) {
  return Math.min(Math.max(Number(value) || item.currentEpisode, 1), item.episodes);
}`,
`function clampEpisode(value, item) {
  return Math.min(Math.max(Number(value) || item.currentEpisode, 1), item.episodes);
}

function initialEpisodeMap(storedEpisodes) {
  return Object.fromEntries(anime.map((item) => [item.id, clampEpisode(storedEpisodes?.[item.id] || item.currentEpisode, item)]));
}`);
}
const playerBlock = `function Player({
  item,
  selectedEpisode,
  shouldAutoPlay,
  quality,
  captionsOn,
  onEpisodeSelect,
  onProgress,
  onQualityChange,
  onCaptionsToggle,
  onStepEpisode,
}) {
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

  function handleEnded() {
    onProgress(item.id, selectedEpisode, 100);
    if (selectedEpisode < item.episodes) onStepEpisode(1, true);
  }

  return (
    <div className="player-panel" aria-label="Video player">
      <video ref={videoRef} controls poster={heroImage} onTimeUpdate={handleTimeUpdate} onEnded={handleEnded}>
        <source src={sampleVideo} type="video/mp4" />
      </video>
      <div className="player-caption">
        <div>
          <span className="now-playing">Now playing</span>
          <strong>{\`\${item.title} - \${episodeLabel(selectedEpisode)}\`}</strong>
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
        <button className={\`caption-toggle \${captionsOn ? "active" : ""}\`} type="button" onClick={onCaptionsToggle}>
          <Captions size={18} />
          <span>{captionsOn ? "Captions on" : "Captions off"}</span>
        </button>
      </div>
      <div className="season-strip" aria-label="Episodes">
        {Array.from({ length: Math.min(item.episodes, 12) }, (_, index) => index + 1).map((episodeNumber) => (
          <button
            className={\`episode-chip \${episodeNumber === selectedEpisode ? "active" : ""}\`}
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
}`;
text = text.replace(/function Player\([\s\S]*?\n}\r?\n\r?\nfunction AnimeCard/, `${playerBlock}\n\nfunction AnimeCard`);
text = text.replace("  const [selectedEpisode, setSelectedEpisode] = useState(stored?.selectedEpisode || anime[0].currentEpisode);", "  const [selectedEpisode, setSelectedEpisode] = useState(stored?.selectedEpisode || anime[0].currentEpisode);\n  const [currentEpisodes, setCurrentEpisodes] = useState(() => initialEpisodeMap(stored?.currentEpisodes));");
text = text.replace("  const [shouldAutoPlay, setShouldAutoPlay] = useState(false);", "  const [shouldAutoPlay, setShouldAutoPlay] = useState(false);\n  const [quality, setQuality] = useState(stored?.quality || \"Auto\");\n  const [captionsOn, setCaptionsOn] = useState(Boolean(stored?.captionsOn));");
text = text.replace("      selectedEpisode,\n      saved: Array.from(saved),\n      progress,", "      selectedEpisode,\n      currentEpisodes,\n      saved: Array.from(saved),\n      progress,\n      quality,\n      captionsOn,");
text = text.replace("  }, [selectedId, selectedEpisode, saved, progress]);", "  }, [selectedId, selectedEpisode, currentEpisodes, saved, progress, quality, captionsOn]);");
text = text.replace(`  function playSelection(id, episodeNumber, autoPlay = false) {
    const item = anime.find((candidate) => candidate.id === id) || anime[0];
    setSelectedId(item.id);
    setSelectedEpisode(clampEpisode(episodeNumber, item));
    setShouldAutoPlay(autoPlay);
    setDetailsId(null);
    document.getElementById("watch")?.scrollIntoView({ behavior: "smooth" });
  }`, `  function playSelection(id, episodeNumber, autoPlay = false) {
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
  }`);
text = text.replace(`  function updateProgress(id, episodeNumber, watched) {
    setProgress((current) => ({ ...current, [id]: Math.max(current[id] || 0, watched) }));
    const item = anime.find((candidate) => candidate.id === id);
  }`, `  function updateProgress(id, episodeNumber, watched) {
    setProgress((current) => ({ ...current, [id]: Math.max(current[id] || 0, watched) }));
    setCurrentEpisodes((current) => ({ ...current, [id]: episodeNumber }));
  }`);
text = text.replace(`            shouldAutoPlay={shouldAutoPlay}
            onEpisodeSelect={playSelection}
            onProgress={updateProgress}`, `            shouldAutoPlay={shouldAutoPlay}
            quality={quality}
            captionsOn={captionsOn}
            onEpisodeSelect={playSelection}
            onProgress={updateProgress}
            onQualityChange={setQuality}
            onCaptionsToggle={() => setCaptionsOn((current) => !current)}
            onStepEpisode={stepEpisode}`);
text = text.replace("              <ContinueCard key={item.id} item={item} progress={progress[item.id] || item.progress} onPlay={playSelection} />", `              <ContinueCard
                key={item.id}
                item={{ ...item, currentEpisode: currentEpisodes[item.id] || item.currentEpisode }}
                progress={progress[item.id] || item.progress}
                onPlay={playSelection}
              />`);
fs.writeFileSync(path, text);

