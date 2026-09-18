# Toonhub Hero Carousel

React + TypeScript + Vite + Tailwind CSS implementation of the Toonhub
full-viewport hero carousel spec.

## Setup

```bash
npm install
npm run dev
```

Then open the printed local URL (defaults to http://localhost:5173).

## Build

```bash
npm run build
npm run preview
```

## Structure

- `src/components/HeroCarousel.tsx` — the carousel itself: state
  (`activeIndex`, `isAnimating`, `isMobile`), role derivation
  (center/left/right/back), navigation, and all six layout pieces from
  the spec (grain overlay, ghost text, brand label, carousel, bottom-left
  copy + nav buttons, bottom-right discover link).
- `src/App.tsx` — mounts the carousel.
- `src/index.css` — Tailwind directives.
- `index.html` — loads the Anton + Inter fonts.

## Notes

- Images are loaded directly from the URLs given in the spec and
  preloaded on mount via `new Image()`.
- Icons come from `lucide-react` (`ArrowLeft`, `ArrowRight`).
- All role transitions animate `transform`, `filter`, `opacity`, and
  `left` together over 650ms with `cubic-bezier(0.4, 0, 0.2, 1)`, and
  navigation is locked (`isAnimating`) for the duration of the
  transition to prevent overlapping animations.
