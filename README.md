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
- Featured watch area with video player, session details, and now-playing status strip
- Episode selector and full episode queue in the player
- Search, genre/audio filters, catalog sorting, and curated discovery rails
- Anime catalog cards
- Continue-watching progress row with complete/reset controls
- Persistent watchlist, reminders, profile preferences, and progress state via localStorage
- Show details modal with metadata, tags, and episode buttons
- Latest episode queue, release reminders, notification center, and profile menu
- Weekly release schedule and library stats
- Responsive desktop and mobile layout

## Next Backend Steps

- Add user accounts and server-backed watch progress
- Store catalog data in a database
- Replace the sample MP4 with licensed video assets or a legal streaming provider
- Add subtitles, quality selection, and episode pages
