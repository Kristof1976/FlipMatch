"use strict";
import UI from "./ui.js";
import Game from "./game.js";
import GameManager from "./gameManager.js";
import Effects from "./effects.js";
import AchievementManager from "./achievements.js";


// Thema-afbeeldingen
const EMOJI_IMAGES = [
  "img/emojis/0.png", "img/emojis/1.png", "img/emojis/2.png", "img/emojis/3.png", "img/emojis/4.png", "img/emojis/5.png", "img/emojis/6.png", "img/emojis/7.png", "img/emojis/8.png", "img/emojis/9.png", "img/emojis/10.png", "img/emojis/11.png", "img/emojis/12.png", "img/emojis/13.png", "img/emojis/14.png", "img/emojis/15.png", "img/emojis/16.png", "img/emojis/17.png", "img/emojis/18.png", "img/emojis/19.png", "img/emojis/20.png", "img/emojis/21.png", "img/emojis/22.png", "img/emojis/23.png", "img/emojis/24.png", "img/emojis/25.png", "img/emojis/26.png", "img/emojis/27.png", "img/emojis/28.png", "img/emojis/29.png", "img/emojis/30.png", "img/emojis/31.png"
];

const ANIMAL_IMAGES = [
  "img/animals/Ant.png", "img/animals/Badger.png", "img/animals/Bat.png", "img/animals/Bear.png", "img/animals/Bison.png", "img/animals/Butterfly.png", "img/animals/Camel.png", "img/animals/Cat.png", "img/animals/Caterpillar.png", "img/animals/Cow.png", "img/animals/Crab.png", "img/animals/Dog.png", "img/animals/Dolphin.png", "img/animals/Elephant.png", "img/animals/Flamingo.png", "img/animals/Fly.png", "img/animals/Fox.png", "img/animals/Goat.png", "img/animals/Gorilla.png", "img/animals/Horse.png", "img/animals/Jellyfish.png", "img/animals/Kangeroo.png", "img/animals/Lobster.png", "img/animals/Monkey.png", "img/animals/Monkey_face.png", "img/animals/Panda.png", "img/animals/Peacock.png", "img/animals/Penguin.png", "img/animals/Pig.png", "img/animals/Pows.png", "img/animals/Rabbit.png", "img/animals/Ram.png", "img/animals/Rat.png", "img/animals/Rhino.png", "img/animals/Rooster.png", "img/animals/Seal.png", "img/animals/Shark.png", "img/animals/Snale.png", "img/animals/Spider.png", "img/animals/Squirel.png", "img/animals/Tiger.png", "img/animals/Tropical_fish.png", "img/animals/Turtle.png", "img/animals/Water Buffalo.png", "img/animals/Whale.png", "img/animals/Wolf.png"
];

// Huidig thema (default emojis)
let currentTheme = "emojis";


function getRandomImages(themeArray, count) {
  // Shuffle en neem 'count' unieke afbeeldingen
  const arr = [...themeArray];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, count);
}

function getThemeImages() {
  // Bepaal aantal benodigde afbeeldingen voor huidig level
  const config = gameManager.getCurrentLevelConfig();
  const totalCards = config.width * config.height;
  const pairs = totalCards / 2;
  const themeArray = currentTheme === "animals" ? ANIMAL_IMAGES : EMOJI_IMAGES;
  return getRandomImages(themeArray, pairs);
}

const ui = new UI("#app");
const gameManager = new GameManager();
const effects = new Effects();
const achievementManager = new AchievementManager();
const game = new Game(ui, getThemeImages, gameManager);

// Set up achievement callback
achievementManager.onAchievementUnlocked = (achievement) => {
  ui.showAchievementNotification(achievement);
  updateAchievementsUI();
};

// DOM controls
const themeSelect = document.getElementById("theme-select");
const startBtn = document.getElementById("start");
const resetBtn = document.getElementById("reset");
const continueBtn = document.getElementById("continue");
const stopBtn = document.getElementById("stop");
const achievementsToggle = document.getElementById("achievements-toggle");
const achievementsContent = document.getElementById("achievements-content");

// Toggle achievements section
if (achievementsToggle && achievementsContent) {
  achievementsToggle.addEventListener("click", () => {
    const isExpanded = achievementsToggle.getAttribute("aria-expanded") === "true";
    achievementsToggle.setAttribute("aria-expanded", !isExpanded);
    achievementsContent.classList.toggle("hidden");
  });
}

// Stats are now managed by UI class

// Initialize UI
updateStatsUI();
updateAchievementsUI();
checkContinueOption();

// Thema selecteren
if (themeSelect) {
  themeSelect.addEventListener("change", (e) => {
    currentTheme = e.target.value;
    // Optioneel: direct nieuw level starten bij wisselen
    // const config = gameManager.getCurrentLevelConfig();
    // game.startLevel(config.width, config.height);
  });
}

stopBtn.addEventListener("click", () => {
  // Stop het spel: zet isPlaying op false, vergrendel het bord
  game.endGame();
  updateButtonStates();
  alert("Game stopped. You can start a new level or continue.");
});
startBtn.addEventListener("click", () => {
  const config = gameManager.getCurrentLevelConfig();
  game.startLevel(config.width, config.height);
  updateButtonStates();
});

resetBtn.addEventListener("click", () => {
  if (confirm("Start a new game? Your current progress will be lost.")) {
    gameManager.resetGame();
    achievementManager.reset();
    updateStatsUI();
    updateAchievementsUI();
    checkContinueOption();
    // Auto-start het eerste level
    const config = gameManager.getCurrentLevelConfig();
    game.startLevel(config.width, config.height);
    updateButtonStates();
  }
});

continueBtn.addEventListener("click", () => {
  const config = gameManager.getCurrentLevelConfig();
  game.startLevel(config.width, config.height);
  updateButtonStates();
});

// Game event handlers
game.onLevelComplete = (levelStats) => {
  // Check achievements
  const newAchievements = achievementManager.checkAchievements(levelStats);
  
  // Show level complete with celebration
  effects.levelComplete();
  
  ui.showLevelComplete(levelStats, () => {
    if (gameManager.canAdvanceLevel()) {
      gameManager.advanceLevel();
      updateStatsUI();
      // Auto-start next level
      const config = gameManager.getCurrentLevelConfig();
      game.startLevel(config.width, config.height);
    } else {
      // Game completed!
      ui.showGameComplete(levelStats);
    }
  });
};

// Add match callback to game
game.onMatch = (cardElement1, cardElement2) => {
  effects.perfectMatch(cardElement1, cardElement2);
  
  // Check for streak combo
  const stats = gameManager.getStats();
  if (stats.streak >= 3) {
    effects.showComboText(stats.streak, document.getElementById('app'));
  }
  
  updateStatsUI();
  
  // Check achievements after each match
  const currentStats = {
    ...gameManager.getStats(),
    totalMatches: gameManager.totalMatches,
    maxStreak: gameManager.maxStreak,
    quickMatches: gameManager.quickMatches,
    levelComplete: false
  };
  achievementManager.checkAchievements(currentStats);
};

function updateStatsUI() {
  const stats = gameManager.getStats();
  ui.updateStats(stats);
}

function updateAchievementsUI() {
  const achievements = achievementManager.getAllAchievements();
  const progress = achievementManager.getProgress();
  ui.renderAchievements(achievements);
  ui.updateAchievementProgress(progress.unlocked, progress.total);
}

function updateButtonStates() {
  startBtn.textContent = "Restart Level";
  continueBtn.classList.add("hidden");
}

function checkContinueOption() {
  const stats = gameManager.getStats();
  if (stats.level > 1 || stats.totalScore > 0) {
    continueBtn.classList.remove("hidden");
    continueBtn.classList.add("show-inline");
    startBtn.textContent = "Start Level " + stats.level;
  }
}

// Update stats during gameplay and check for game over
setInterval(() => {
  if (game.isPlaying) {
    updateStatsUI();
    
    // Check if game over (no moves left)
    if (gameManager.isGameOver && gameManager.isGameOver()) {
      game.endGame(); // End the current game
      const stats = gameManager.getStats();
      ui.showGameOver(stats, () => {
        // Restart current level
        const config = gameManager.getCurrentLevelConfig();
        game.startLevel(config.width, config.height);
      });
    }
  }
}, 1000);

