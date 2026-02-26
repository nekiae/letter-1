# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A personalized "last personal letter" web app — a scrollable letter page with a photo gallery and embedded chat history. The project exists as three near-identical repos (`letter-1`, `letter-2`, `letter-3`), each customized for a different recipient.

**Stack:** React 18 + TypeScript + Vite + Tailwind CSS v3 + Framer Motion. No backend — all content is served as static JSON files from `public/data/`.

## Commands

```bash
npm run dev       # Start dev server (http://localhost:5173)
npm run build     # Type-check + build to dist/
npm run preview   # Preview the production build locally
```

There is no test suite in this project.

## Architecture

### Content Customization

The only edit point per letter is the `LETTER` constant at the top of [src/App.tsx](src/App.tsx) (within the clearly marked `РЕДАКТИРУЙ ТОЛЬКО ЭТУ СЕКЦИЮ` block). It controls: recipient ID, name, greeting, date/place, intro paragraphs, closing, and signature.

### Data Files (`public/data/`)

All content is fetched at runtime from static JSON:

| File | Purpose |
|------|---------|
| `gallery.json` | Array of `GalleryPhoto` objects (photos + videos) |
| `timlids.json` | Array of `Timlid` profiles |
| `chats/[timlidId].json` | Chat history for a specific person |

The `timlidId` in `LETTER` (e.g. `"person-1"`) maps to both the `timlids.json` entry and the filename `chats/person-1.json`.

### Component Tree

```
App
├── header           — date, title, greeting (inline in App.tsx)
├── GallerySection   — fetches gallery.json, masonry grid of PhotoCards, lightbox
├── ChatSection      — receives timlidId/timlidName, renders ChatWindow
│   └── ChatWindow   — uses useChatData() hook, renders MessageBubbles grouped by date
└── footer           — closing, signature, WaxSeal (inline in App.tsx)
```

### Key Hooks

- **`useChatData(timlidId)`** — fetches `/data/chats/[id].json`, returns `{ chatData, isLoading, error }`. Cancels stale requests on timlidId change.
- **`useTimlids()`** — fetches `/data/timlids.json`.
- **`useTypewriter()`** — typewriter animation helper.

### Types (`src/types/index.ts`)

- `GalleryPhoto` — `id`, `type` (`'photo'|'video'`), `src`, `poster?`, `caption`, `date`, `placeholderColor`, `rotation` (degrees), `aspect` (`'square'|'portrait'|'landscape'`)
- `ChatMessage` — `id`, `sender` (`'me'|'timlid'`), `text`, `timestamp` (ISO 8601), `isEmotional?` (renders in Great Vibes font, larger)
- `Timlid` — `id`, `name`, `shortName`, `role`, `avatarInitials`, `avatarColor`

### Styling Conventions

Custom Tailwind tokens (defined in [tailwind.config.ts](tailwind.config.ts)):

- **Colors:** `paper`, `paper-dark`, `ink-blue`, `ink-brown`, `gold`, `gold-light`, `stamp`
- **Fonts:** `font-handwritten` (Caveat), `font-elegant` (Great Vibes), `font-serif` (Playfair Display)
- **Custom utilities (CSS):** `.paper-grain`, `.vignette`, `.photo-masonry`, `.photo-card-wrap`, `.tape`, `.chat-scroll`

Animations use both Tailwind keyframes and Framer Motion `whileInView` (with `viewport={{ once: true }}`).

### Multi-Repo Structure

`letter-1`, `letter-2`, `letter-3` share identical code. The only differences are the letter number in comments, `timlidId`, `timlidName`, and `greeting` inside the `LETTER` constant in `App.tsx`. Each repo deploys independently (Railway, via `railway.json`).
