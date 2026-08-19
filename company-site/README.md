# EVEX Company Site

The EVEX Digital Company homepage — a React/Vite app. This is the central hub that
links all EVEX products together.

## Local dev

```bash
npm install
npm run dev     # http://localhost:3001
```

## Production build

```bash
npm run build   # outputs to dist/
```

## Linking products

All external product links live in one file: `src/config.js`

```js
export const LINKS = {
    businessPlatform: 'https://evex-ecommerce.onrender.com', // live store
    superApp: '#coming-soon',   // Phase 2
    learningHub: '#coming-soon',// Phase 3
};
```

Update these values when a product goes live and every card/link updates automatically.

## Deploy

Deploy as a static site (Render blueprint: `render.yaml` at repo root).
Build command: `npm install && npm run build`, publish path: `dist`.

## Notes

- Uses `lucide-react` for icons (no icon CDN).
- Canvas animations (constellation), scroll-reveal, and hero parallax are ported
  into React hooks in `src/hooks/`.
- The hero constellation was fixed during the React port (a `ReferenceError` on `n`
  in the original inline JS that would have crashed the animation loop).