# AniPulse Streaming Prototype

AniPulse is a static anime streaming platform prototype inspired by modern catalog sites. It uses original sample anime titles and a safe public sample video instead of scraped or unauthorized streams.

## Run

Open `index.html` directly in a browser, or serve the folder locally:

```powershell
python -m http.server 5173
```

Then visit `http://localhost:5173`.

## Included

- Featured watch area with video player
- Episode selector in the player
- Search and genre filters
- Anime catalog cards
- Continue-watching progress row
- Watchlist save toggles and saved-anime section
- Show details modal with episode buttons
- Latest episode queue
- Weekly release schedule
- Responsive desktop and mobile layout

## Next Backend Steps

- Add user accounts and watch progress
- Store catalog data in a database
- Replace the sample MP4 with licensed video assets or a legal streaming provider
- Add subtitles, quality selection, and episode pages
