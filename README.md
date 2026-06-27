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
- Featured watch area with video player
- Episode selector in the player
- Search and genre filters
- Anime catalog cards
- Continue-watching progress row
- Persistent watchlist and progress state via localStorage
- Show details modal with episode buttons
- Latest episode queue
- Weekly release schedule
- Responsive desktop and mobile layout

## Next Backend Steps

- Add user accounts and server-backed watch progress
- Store catalog data in a database
- Replace the sample MP4 with licensed video assets or a legal streaming provider
- Add subtitles, quality selection, and episode pages
