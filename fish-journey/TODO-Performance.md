# Performance Optimization TODO
Status: [ ] Not started | [x] Planned | [ ] In Progress | [ ] Done

## Priority 1: Critical Rendering Path
- [x] Update index.html (inline critical CSS, async resources, preconnect)
- [ ] Lazy load components in App.jsx (React.lazy/Suspense for Map/Leaderboard)
- [x] Enhance vite.config.js (terser minify, tree-shake, chunks)

## Priority 2: Image Optimization
- [ ] Compress/convert PNGs to WebP in public/images/
- [ ] Update flag sizes (w80/w40) + lazy loading in components
- [ ] Inline Leaflet icons

## Priority 3: JS/CSS Bundles
- [ ] Consolidate CSS into index.css + purge Tailwind
- [ ] Remove duplicate leaflet.css imports
- [ ] Remove/conditional public/js/script.js
- [ ] Memoize/virtualize heavy components

## Priority 4: Main-thread/LCP
- [ ] Optimize FancyFlagMap (lazy init, limit GeoJSON/polylines)
- [ ] Reduce animations (CSS-based)

## Post-Edit
- [x] Build & Lighthouse test
- [ ] Update server.js headers

Updated: Step 1 complete (TODO created)

