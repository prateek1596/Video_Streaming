# AniPulse Streaming React App

AniPulse is a React/Vite anime streaming platform prototype. It uses original sample anime titles, a local hero image, and a safe public sample video instead of scraped or unauthorized streams.

## Run

Install dependencies once:

```powershell
npm.cmd install
```

Start the React dev server:

```powershell
npm.cmd run dev
```

Then visit `http://127.0.0.1:5173/`.

## Build

```powershell
npm.cmd run build
```

The production output is generated in `dist/`.

## Included

- React component-based streaming interface
- Featured watch area with video player, episode toolkit, chapter markers, timed transcript, episode recap, session details, and now-playing status strip
- Episode selector and full episode queue in the player
- Search, genre/audio filters, catalog sorting, discovery lens, browse pulse, studio spotlight, and curated discovery rails
- Anime catalog cards
- Continue-watching progress row with resume coach and complete/reset controls
- Persistent watchlist, session queue, queue mixer, resume coach, watch goals, library insights, playback preferences, maturity guard, reminders, profile preferences, progress, notes, episode feedback, and watch-party messages via localStorage
- Show details modal with metadata, tags, and episode buttons
- Latest episode queue, premiere radar, release board, release reminders, notification center, and profile menu
- Weekly release schedule, premiere radar, release board, discovery lens, browse pulse, studio spotlight, maturity-limited browsing, library stats, watch goals, library insights, taste profile, queue mixer, session queue controls, episode toolkit, chapter jumps, transcript jumps, episode recap, playback setup, episode notes, feedback, and watch-party reactions
- Responsive desktop and mobile layout

## Next Backend Steps

- Add user accounts and server-backed watch progress
- Store catalog data in a database
- Replace the sample MP4 with licensed video assets or a legal streaming provider
- Add subtitles, quality selection, and episode pages


















