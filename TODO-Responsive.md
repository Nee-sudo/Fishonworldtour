🐟 Fish Journey - Responsive Implementation TODO

## STATUS: 🚀 IMPLEMENTATION IN PROGRESS (Updated by BLACKBOXAI)

### ✅ PLAN CONFIRMED & APPROVED BY USER
- [x] User reviewed & approved comprehensive responsive plan
- [x] Identified Tailwind already handles 80%+ requirements (mobile-first, fluid layouts)

### 📋 IMPLEMENTATION STEPS (File-level updates)

**1. Update Tailwind Config (EXACT BREAKPOINTS)**\n- [x] Edit `fish-journey/tailwind.config.js`\n  - Added custom screens: 480px, 768px, 1024px, 1280px\n  - Ready for npm run dev restart
  - Add `theme.screens: { '480': '480px', '768': '768px', '1024': '1024px', '1280': '1280px' }`
  - Restart `npm run dev`

**2. Fix Leaderboard Layout**\n- [x] Edit `fish-journey/src/components/Leaderboard.jsx`\n  - Changed lg:grid-cols-1 → lg:grid-cols-2 (better desktop 2-col layout)
  - Change `lg:grid-cols-1` → `lg:grid-cols-2` for desktop optimization

**3. Map Heights Optimization (Minor)**
- [ ] Check `fish-journey/src/components/FancyFlagMap.jsx`, `Map.jsx`, `FlagMap.jsx`
  - Ensure `h-[40vh] sm:h-[50vh] md:h-[450px] lg:h-[550px] min-h-[280px]`
  - Already good - confirm no fixed px overflows

**4. Legacy CSS Cleanup (Optional but recommended)**
- [ ] Rename/delete `fish-journey/public/css/styles.css` → `styles.css.legacy`
- [ ] Rename/delete `fish-journey/public/css/map-styles.css` → `map-styles.css.legacy`
  - (Not loaded by index.html, prevents future overrides)

**5. Global Polish**\n- [x] Add `overflow-x: hidden` to `fish-journey/src/index.css` body if missing
- [ ] Ensure all images have `max-w-full h-auto object-contain` (already mostly present)

### 🧪 TESTING CHECKLIST
- [ ] Test 320px (small phone): Stack layouts, hamburger nav, readable text
- [ ] Test 375px/414px (phones): No zoom, touch-friendly
- [ ] Test 480px (small mobile): First breakpoint scales up
- [ ] Test 768px (tablet): Grid emerges, nav horizontal
- [ ] Test 1024px (laptop): Optimized layouts
- [ ] Test 1440px+ (desktop): Full fluid experience
- [ ] Lighthouse Mobile: Score >90
- [ ] No horizontal scroll ANYWHERE
- [ ] Map pinch-zoom/touch works on mobile

### 🔄 COMMANDS TO RUN
```
cd fish-journey
npm run dev
```
- Open http://localhost:5173
- DevTools → Responsive mode

### 🚀 COMPLETION
- [ ] All steps checked
- [ ] User verified across devices
- [ ] attempt_completion called

**Current Step: 1/5 - tailwind.config.js**
