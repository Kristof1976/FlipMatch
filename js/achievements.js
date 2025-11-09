// Achievement system for FlipMatch
export default class AchievementManager {
  constructor() {
    this.achievements = this.defineAchievements();
    this.unlockedAchievements = this.loadUnlockedAchievements();
    this.onAchievementUnlocked = null; // callback
  }

  defineAchievements() {
    return {
      first_match: {
        id: 'first_match',
        name: 'First Steps',
        description: 'Find your first match',
        icon: '🎯',
        condition: (stats) => stats.totalMatches >= 1
      },
      speed_demon: {
        id: 'speed_demon',
        name: 'Speed Demon',
        description: 'Complete a level in under 30 seconds',
        icon: '⚡',
        condition: (stats) => stats.levelTime <= 30 && stats.levelComplete
      },
      perfectionist: {
        id: 'perfectionist',
        name: 'Perfectionist',
        description: 'Complete a level without any mistakes',
        icon: '💎',
        condition: (stats) => stats.mismatches === 0 && stats.levelComplete && stats.level >= 3
      },
      streak_master: {
        id: 'streak_master',
        name: 'Streak Master',
        description: 'Get a 5-match streak',
        icon: '🔥',
        condition: (stats) => stats.maxStreak >= 5
      },
      level_5: {
        id: 'level_5',
        name: 'Intermediate',
        description: 'Reach level 5',
        icon: '🎓',
        condition: (stats) => stats.level >= 5
      },
      level_10: {
        id: 'level_10',
        name: 'Expert',
        description: 'Reach level 10',
        icon: '👑',
        condition: (stats) => stats.level >= 10
      },
      master: {
        id: 'master',
        name: 'Master',
        description: 'Complete all levels',
        icon: '🏆',
        condition: (stats) => stats.level === 11 && stats.levelComplete
      },
      efficient: {
        id: 'efficient',
        name: 'Efficient',
        description: 'Complete a level using minimum moves',
        icon: '🎯',
        condition: (stats) => {
          const optimalMoves = stats.totalCards / 2;
          return stats.moves <= optimalMoves && stats.levelComplete && stats.level >= 4;
        }
      },
      marathon: {
        id: 'marathon',
        name: 'Marathon',
        description: 'Complete 5 levels in one session',
        icon: '🏃',
        condition: (stats) => stats.levelsCompletedInSession >= 5
      },
      comeback: {
        id: 'comeback',
        name: 'Comeback',
        description: 'Complete a level with less than 3 moves remaining',
        icon: '💪',
        condition: (stats) => stats.remainingMoves <= 2 && stats.remainingMoves >= 0 && stats.levelComplete
      },
      quick_thinker: {
        id: 'quick_thinker',
        name: 'Quick Thinker',
        description: 'Make 3 matches in under 10 seconds',
        icon: '🧠',
        condition: (stats) => stats.quickMatches >= 3
      },
      collector: {
        id: 'collector',
        name: 'Collector',
        description: 'Unlock 5 achievements',
        icon: '🌟',
        condition: (stats) => stats.achievementCount >= 5
      }
    };
  }

  loadUnlockedAchievements() {
    try {
      const saved = localStorage.getItem('flipmatch_achievements');
      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      console.warn('Could not load achievements:', error);
      return {};
    }
  }

  saveUnlockedAchievements() {
    try {
      localStorage.setItem('flipmatch_achievements', JSON.stringify(this.unlockedAchievements));
    } catch (error) {
      console.warn('Could not save achievements:', error);
    }
  }

  checkAchievements(stats) {
    // Add achievement count to stats
    stats.achievementCount = Object.keys(this.unlockedAchievements).length;

    const newlyUnlocked = [];

    for (const [id, achievement] of Object.entries(this.achievements)) {
      // Skip already unlocked achievements
      if (this.unlockedAchievements[id]) continue;

      // Check if condition is met
      if (achievement.condition(stats)) {
        this.unlockAchievement(id);
        newlyUnlocked.push(achievement);
      }
    }

    return newlyUnlocked;
  }

  unlockAchievement(achievementId) {
    if (this.unlockedAchievements[achievementId]) return false;

    this.unlockedAchievements[achievementId] = {
      unlockedAt: Date.now()
    };

    this.saveUnlockedAchievements();

    const achievement = this.achievements[achievementId];
    if (this.onAchievementUnlocked && achievement) {
      this.onAchievementUnlocked(achievement);
    }

    return true;
  }

  isUnlocked(achievementId) {
    return !!this.unlockedAchievements[achievementId];
  }

  getUnlockedCount() {
    return Object.keys(this.unlockedAchievements).length;
  }

  getTotalCount() {
    return Object.keys(this.achievements).length;
  }

  getAllAchievements() {
    return Object.values(this.achievements).map(achievement => ({
      ...achievement,
      unlocked: this.isUnlocked(achievement.id),
      unlockedAt: this.unlockedAchievements[achievement.id]?.unlockedAt
    }));
  }

  getProgress() {
    return {
      unlocked: this.getUnlockedCount(),
      total: this.getTotalCount(),
      percentage: Math.round((this.getUnlockedCount() / this.getTotalCount()) * 100)
    };
  }

  reset() {
    this.unlockedAchievements = {};
    this.saveUnlockedAchievements();
  }
}
