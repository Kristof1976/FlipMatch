import { LEVEL_CONFIG, SCORING, GAME_RULES } from './config.js';

export default class GameManager {
  constructor() {
    this.currentLevel = 1;
    this.score = 0;
    this.totalScore = 0;
    this.streak = 0;
    this.maxStreak = 0;
    this.startTime = null;
    this.moves = 0;
    this.mismatches = 0;
    this.totalMatches = 0;
    this.levelsCompletedInSession = 0;
    this.quickMatches = 0;
    this.lastMatchTime = null;
    this.loadProgress();
  }

  getCurrentLevelConfig() {
    return LEVEL_CONFIG.find(config => config.level === this.currentLevel) || LEVEL_CONFIG[0];
  }

  getMaxLevel() {
    return LEVEL_CONFIG.length;
  }

  canAdvanceLevel() {
    return this.currentLevel < this.getMaxLevel();
  }

  advanceLevel() {
    if (this.canAdvanceLevel()) {
      this.currentLevel++;
      this.saveProgress();
      return true;
    }
    return false;
  }

  startLevel() {
    this.startTime = Date.now();
    this.moves = 0;
    this.score = 0;
    this.mismatches = 0;
    this.quickMatches = 0;
    this.lastMatchTime = null;
    
    const config = this.getCurrentLevelConfig();
    const totalCards = config.width * config.height;
    const pairs = totalCards / 2;
    
    // Calculate max moves: (pairs × 2.5) + level bonus
    this.maxMoves = Math.round(pairs * GAME_RULES.MOVES_MULTIPLIER) + 
                   (config.level * GAME_RULES.LEVEL_BONUS_MOVES);
  }

  getMaxMoves() {
    return this.maxMoves;
  }

  getRemainingMoves() {
    return Math.max(0, this.maxMoves - this.moves);
  }

  isGameOver() {
    return this.moves >= this.maxMoves;
  }

  shouldShowWarning() {
    return this.moves >= (this.maxMoves * GAME_RULES.WARNING_THRESHOLD);
  }

  recordMove() {
    this.moves++;
  }

  recordMatch() {
    this.streak++;
    this.maxStreak = Math.max(this.maxStreak, this.streak);
    this.totalMatches++;
    
    // Track quick matches (within 10 seconds)
    const now = Date.now();
    if (this.lastMatchTime && (now - this.lastMatchTime) < 10000) {
      this.quickMatches++;
    }
    this.lastMatchTime = now;
    
    this.calculateScore();
  }

  recordMismatch() {
    this.streak = 0;
    this.mismatches++;
  }

  calculateScore() {
    const config = this.getCurrentLevelConfig();
    const baseScore = SCORING.BASE_POINTS + (config.level * SCORING.LEVEL_MULTIPLIER);
    
    // Time bonus: sneller = meer punten
    const timeElapsed = (Date.now() - this.startTime) / 1000;
    const timeBonus = Math.max(0, SCORING.TIME_BONUS_MAX - (timeElapsed * 2));

    // Streak bonus: opeenvolgende matches
    const streakBonus = this.streak * SCORING.STREAK_BONUS;
    
    // Move penalty: teveel moves = punten verlies
    const optimalMoves = (config.width * config.height) / 2; // Perfect spel
    const excessMoves = Math.max(0, this.moves - optimalMoves);
    const movePenalty = excessMoves * SCORING.PENALTY_PER_MOVE;
    
    this.score = Math.max(1, Math.round(baseScore + timeBonus + streakBonus - movePenalty));
    this.totalScore += this.score;
  }

  completeLevel() {
    this.calculateScore();
    this.levelsCompletedInSession++;
    this.saveProgress();
    
    const config = this.getCurrentLevelConfig();
    const levelTime = Math.round((Date.now() - this.startTime) / 1000);
    
    return {
      score: this.score,
      totalScore: this.totalScore,
      moves: this.moves,
      time: levelTime,
      level: this.currentLevel,
      canAdvance: this.canAdvanceLevel(),
      // Achievement tracking stats
      levelTime: levelTime,
      levelComplete: true,
      mismatches: this.mismatches,
      maxStreak: this.maxStreak,
      totalCards: config.width * config.height,
      remainingMoves: this.getRemainingMoves(),
      levelsCompletedInSession: this.levelsCompletedInSession,
      quickMatches: this.quickMatches,
      totalMatches: this.totalMatches
    };
  }

  resetGame() {
    this.currentLevel = 1;
    this.score = 0;
    this.totalScore = 0;
    this.streak = 0;
    this.maxStreak = 0;
    this.moves = 0;
    this.mismatches = 0;
    this.totalMatches = 0;
    this.levelsCompletedInSession = 0;
    this.quickMatches = 0;
    this.saveProgress();
  }

  saveProgress() {
    const progress = {
      currentLevel: this.currentLevel,
      totalScore: this.totalScore,
      lastPlayed: Date.now()
    };
    localStorage.setItem('memoryGameProgress', JSON.stringify(progress));
  }

  loadProgress() {
    try {
      const saved = localStorage.getItem('memoryGameProgress');
      if (saved) {
        const progress = JSON.parse(saved);
        this.currentLevel = progress.currentLevel || 1;
        this.totalScore = progress.totalScore || 0;
      }
    } catch (error) {
      console.warn('Could not load saved progress:', error);
      this.resetGame();
    }
  }

  getStats() {
    const config = this.getCurrentLevelConfig();
    return {
      level: this.currentLevel,
      maxLevel: this.getMaxLevel(),
      levelName: config.name,
      score: this.score,
      totalScore: this.totalScore,
      moves: this.moves,
      maxMoves: this.maxMoves || 0,
      remainingMoves: this.getRemainingMoves ? this.getRemainingMoves() : 0,
      streak: this.streak,
      gridSize: `${config.width}×${config.height}`,
      isWarning: this.shouldShowWarning ? this.shouldShowWarning() : false
    };
  }
}