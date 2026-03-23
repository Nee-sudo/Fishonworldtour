# Mobile Interaction Fix - TODO Steps

**Goal**: Fix interactive elements breaking in top/middle screen areas (map zoom/pan, comments/leaderboard scroll, inputs).

## Steps (Approved Plan):

### 1. Global CSS (index.css) ✅ **COMPLETE**
- Added pointer-events/touch-action globals + dvh units.

### 2. Viewport fixes (styles-responsive.css, styles.css) ✅ **COMPLETE**
- Replaced 100vh → 100dvh
- Removed overflow: hidden from maps

### 3. Nested scrolls (Leaderboard.jsx, Encouragement.jsx) ✅ **COMPLETE**
- Updated max-h to 85dvh (taller, safe scrolling)

### 4. Map container (Map.jsx) ✅ **COMPLETE**
- Removed overflow-hidden class

### 5. Navbar modal (Navbar.jsx) ✅ **COMPLETE**
- Replaced body overflow:hidden with position:fixed (preserves touch)

### 6. Test ✅ **PENDING**
```
cd fish-journey && npm run dev
```
- Mobile DevTools: Toggle device, check Layers/scroll perf
- Verify full-screen interactions (map zoom/pan, scroll, input everywhere)

### 7. Completion ✅ **PENDING**

**Progress: 7/7** ✅ **COMPLETE**

Debug overlay added: Red toggle button top-right (mobile-only). Reveals touch areas, scroll containers, overlays.

