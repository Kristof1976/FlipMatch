
## 🎓 About This Project

This FlipMatch game was created as part of JavaScript programming exercises, showcasing:
// ...existing code...
**Built with:** Vanilla JavaScript • No frameworks • Pure CSS3 • PWA features

## 🖼️ Emoji Licentie

De emoji’s gebruikt in deze game zijn afkomstig van **Twemoji** (Twitter) en **OpenMoji**.

- Twemoji valt onder de **CC BY-SA 4.0-licentie**. Je mag deze gratis gebruiken, kopiëren en aanpassen, ook voor commercieel gebruik, **mits** je de bron vermeldt en eventuele afgeleide werken onder dezelfde licentie beschikbaar stelt. Meer info: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)
- OpenMoji valt onder de **Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)** licentie. Meer info: [openmoji.org/license](https://openmoji.org/license/)

Bronvermelding:
- Twemoji (Twitter), CC BY-SA 4.0
- OpenMoji, CC BY-SA 4.0

## 📞 Contact

Created by **Kristof1976** - Feel free to reach out for questions or feedback!

---

**Enjoy the challenge! 🧠💪**

# 🎮 FlipMatch - Progressive Challenge

A modern, progressive web app (PWA) version of the classic card matching game built with vanilla JavaScript, featuring 11 challenging levels and a sophisticated scoring system.

## 🌐 Live Demo


**Play Online or install for offline gaming:** https://kristof1976.github.io/FlipMatch/


The game is hosted on GitHub Pages and works on all devices - mobile, tablet, and desktop!

## 🌟 Features

### 🎯 Game Mechanics
- **11 Progressive Levels**: From 2×2 grid to challenging 8×8 (64 cards)
- **Smart Scoring System**: Points based on level, time, streaks, and move efficiency
- **Moves Limit Challenge**: Strategic gameplay with limited moves per level
- **Game Over Conditions**: Fail if you exceed move limits
- **Progress Persistence**: Your game progress is automatically saved

### 🎨 Modern Design
- **Dark Theme**: Easy on the eyes with green accent colors
- **Mobile-First**: Responsive design optimized for all devices
- **Smooth Animations**: Card flip animations with CSS 3D transforms
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support

### 📱 Progressive Web App
- **Installable**: Add to home screen on any device
- **Offline Play**: Full game functionality without internet
- **Fast Loading**: Service worker caching for instant startup
- **Native Feel**: Standalone app experience

## 🚀 Tech Stack

- **Frontend**: Vanilla JavaScript (ES6 modules)
- **Styling**: CSS3 with custom properties and flexbox/grid
- **Architecture**: Object-oriented design with clean separation of concerns
- **PWA**: Service Worker, Web App Manifest, offline caching
- **Storage**: Local Storage for game progress persistence

## 📂 Project Structure

```
flipmatch/
├── index.html              # Main game page
├── manifest.json           # PWA manifest
├── sw.js                  # Service worker
├── browserconfig.xml      # Windows tile configuration
├── css/
│   └── main.css           # All game styling
├── js/
│   ├── main.js            # App initialization & coordination
│   ├── game.js            # Core game logic
│   ├── gameManager.js     # Level progression & scoring
│   ├── board.js           # Game board management
│   ├── card.js            # Card component
│   ├── ui.js              # DOM manipulation & rendering
│   ├── config.js          # Game configuration & levels
│   └── pwa.js             # PWA installation & updates
├── img/                   # Game card images (themed images)
├── icons/                 # PWA app icons
└── screenshots/           # App store screenshots
```

## 🎮 How to Play

1. **Objective**: Match all pairs of cards in each level
2. **Gameplay**: Click cards to flip and reveal images
3. **Matching**: Find two cards with identical images
4. **Strategy**: Complete levels within the move limit
5. **Progression**: Unlock higher levels by completing previous ones

## 📊 Scoring System

- **Base Points**: 10 + (level × 15)
- **Time Bonus**: Up to 100 points for fast completion
- **Streak Bonus**: 10 points per consecutive match
- **Move Penalty**: -2 points per move above optimal

## 🏆 Levels & Difficulty

| Level | Grid Size | Total Cards | Pairs | Move Limit* |
|-------|-----------|-------------|--------|-------------|
| 1     | 2×2       | 4          | 2      | 7           |
| 2     | 3×2       | 6          | 3      | 10          |
| 3     | 4×2       | 8          | 4      | 14          |
| 4     | 2×3       | 6          | 3      | 10          |
| 5     | 4×3       | 12         | 6      | 25          |
| 6     | 4×4       | 16         | 8      | 32          |
| 7     | 5×4       | 20         | 10     | 39          |
| 8     | 6×4       | 24         | 12     | 46          |
| 9     | 6×6       | 36         | 18     | 63          |
| 10    | 8×6       | 48         | 24     | 80          |
| 11    | 8×8       | 64         | 32     | 102         |

*Move limits calculated as: (pairs × 2.5) + (level × 2)

## 🛠️ Installation & Setup

### Local Development
1. Clone or download this repository
2. Serve files through a local web server (required for PWA features)
3. Open `index.html` in your browser

### Web Server Options
```bash
# Python 3
python -m http.server 8000

# Node.js (http-server)
npx http-server

# PHP
php -S localhost:8000

# Live Server (VS Code extension)
```

### PWA Installation
- **Desktop**: Look for install icon in browser address bar
- **Android**: "Add to Home Screen" prompt will appear
- **iOS**: Share menu → "Add to Home Screen"

## 🧩 Architecture Highlights

### Object-Oriented Design
- **Game**: Controls game flow and card interactions
- **GameManager**: Handles level progression, scoring, and persistence
- **Board**: Manages card layout and game state
- **Card**: Individual card component with flip states
- **UI**: DOM rendering and user interface management

### Modern JavaScript Features
- ES6 modules for clean imports/exports
- Classes with private methods
- Arrow functions and destructuring
- LocalStorage for persistence
- Service Worker for PWA functionality

### CSS Best Practices
- CSS custom properties for theming
- Mobile-first responsive design
- CSS Grid and Flexbox layouts
- CSS 3D transforms for animations
- Semantic HTML with ARIA accessibility

## 🌐 Browser Support

- **Modern browsers**: Chrome 60+, Firefox 55+, Safari 12+, Edge 79+
- **PWA features**: Chrome, Edge, Samsung Internet, Firefox (limited)
- **Mobile**: iOS Safari 12+, Chrome Mobile, Samsung Internet

## 📝 Validation & Quality

- ✅ **W3C HTML Validator**: No errors
- ✅ **W3C CSS Validator**: CSS3 + SVG compliant
- ✅ **Lighthouse PWA**: All criteria met
- ✅ **Accessibility**: WCAG guidelines followed
- ✅ **Mobile-First**: Responsive breakpoint @640px

## 🎯 Future Enhancements

- [ ] Difficulty customization options
- [ ] Multiplayer support
- [ ] Achievement system
- [ ] Leaderboard with cloud sync
- [ ] Custom card themes
- [ ] Sound effects and music
- [ ] Haptic feedback on mobile

## 🎓 About This Project

This Memory Game was created as part of JavaScript programming exercises, showcasing:
- Modern ES6+ JavaScript development
- Progressive Web App implementation  
- Object-oriented programming principles
- Mobile-first responsive design
- W3C compliant code standards

**Built with:** Vanilla JavaScript • No frameworks • Pure CSS3 • PWA features

## 📞 Contact

Created by **Kristof1976** - Feel free to reach out for questions or feedback!

---

**Enjoy the challenge! 🧠💪**