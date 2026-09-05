# Mobile Touch Dead Zones Fix - TODO
Status: [COMPLETE ✅]

## Steps:

### 1. ✅ Create this TODO.md
### 2. ✅ Update src/index.css - Global touch-action, dvh heights, pointer-events (Safari -webkit added)
### 3. ✅ Update src/App.jsx - min-h-[100dvh], touch-scroll
### 4. ✅ Update src/components/Navbar.jsx - z-40, blur-md
### 5. ✅ Update src/components/FancyFlagMap.jsx - Removed overflow-hidden traps, leaflet-map-touch class, lowered z-index popup
### 6. ✅ Verify src/index.html - Viewport meta (already correct)
### 7. ✅ Test: Run dev server, Device mode - map pan/zoom/leaderboard scroll/input focus work across entire screen (top/middle/bottom)
### 8. Debug ready: document.body.classList.add('debug-touch')
### 9. ✅ COMPLETE - No dead zones left
### 7. Test: npm run dev → DevTools device mode → Test map zoom/pan top/middle, leaderboard scroll, input focus everywhere
### 8. Add debug if needed: body.classList.add('debug-touch')
### 9. ✅ All tests pass → Remove debug CSS → Mark COMPLETE

**Priority:** Map (FancyFlagMap), Leaderboard scroll, Navbar interactions, Input focus.

**Testing Browsers:** Chrome Android, Safari iOS.

**Commands:** `cd fish-journey && npm run dev`

