// Visual effects system for FlipMatch
export default class Effects {
  constructor() {
    this.particleContainer = null;
    this.init();
  }

  init() {
    // Create particle container if it doesn't exist
    if (!this.particleContainer) {
      this.particleContainer = document.createElement('div');
      this.particleContainer.id = 'particle-container';
      this.particleContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9999;
      `;
      document.body.appendChild(this.particleContainer);
    }
  }

  // Create particle effect at a specific element
  createParticles(element, type = 'match') {
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const particleCount = type === 'match' ? 12 : 6;
    const colors = type === 'match' 
      ? ['#0ea5a4', '#22c55e', '#3b82f6', '#f59e0b', '#ef4444']
      : ['#9ca3af', '#6b7280'];

    for (let i = 0; i < particleCount; i++) {
      this.createParticle(centerX, centerY, colors, type);
    }
  }

  createParticle(x, y, colors, type) {
    const particle = document.createElement('div');
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.random() * 8 + 4; // 4-12px
    
    // Random velocity
    const angle = (Math.random() * Math.PI * 2);
    const velocity = Math.random() * 150 + 50; // 50-200px
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity - 100; // Add upward bias

    particle.style.cssText = `
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border-radius: ${type === 'match' ? '50%' : '2px'};
      pointer-events: none;
      transform: translate(-50%, -50%);
      box-shadow: 0 0 ${size}px ${color}44;
    `;

    this.particleContainer.appendChild(particle);

    // Animate particle
    const duration = 800 + Math.random() * 400; // 800-1200ms
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = elapsed / duration;

      if (progress >= 1) {
        particle.remove();
        return;
      }

      // Physics: x = x0 + vx*t, y = y0 + vy*t + 0.5*g*t^2
      const t = progress;
      const gravity = 300;
      const currentX = x + vx * t;
      const currentY = y + vy * t + 0.5 * gravity * t * t;
      const opacity = 1 - progress;
      const scale = 1 - progress * 0.5;

      particle.style.left = currentX + 'px';
      particle.style.top = currentY + 'px';
      particle.style.opacity = opacity;
      particle.style.transform = `translate(-50%, -50%) scale(${scale})`;

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }

  // Screen shake effect
  screenShake(duration = 300) {
    const app = document.getElementById('app');
    if (!app) return;

    app.style.animation = 'none';
    // Force reflow
    app.offsetHeight;
    app.style.animation = `shake ${duration}ms ease-in-out`;

    setTimeout(() => {
      app.style.animation = '';
    }, duration);
  }

  // Flash effect for streak
  flashStreak(element) {
    if (!element) return;
    
    element.style.animation = 'none';
    element.offsetHeight;
    element.style.animation = 'pulse-glow 0.5s ease-out';
    
    setTimeout(() => {
      element.style.animation = '';
    }, 500);
  }

  // Card match glow effect
  cardMatchGlow(cardElement) {
    if (!cardElement) return;

    cardElement.classList.add('match-glow');
    setTimeout(() => {
      cardElement.classList.remove('match-glow');
    }, 600);
  }

  // Perfect match effect (both cards matched quickly)
  perfectMatch(element1, element2) {
    this.createParticles(element1, 'match');
    this.createParticles(element2, 'match');
    this.cardMatchGlow(element1);
    this.cardMatchGlow(element2);
  }

  // Combo effect with text
  showComboText(multiplier, container) {
    if (!container || multiplier <= 1) return;

    const comboText = document.createElement('div');
    comboText.className = 'combo-text';
    comboText.textContent = `${multiplier}x COMBO!`;
    
    container.appendChild(comboText);

    setTimeout(() => {
      comboText.remove();
    }, 2000);
  }

  // Level complete celebration
  levelComplete() {
    // Create confetti burst from multiple points
    const points = [
      { x: window.innerWidth * 0.25, y: window.innerHeight * 0.3 },
      { x: window.innerWidth * 0.5, y: window.innerHeight * 0.2 },
      { x: window.innerWidth * 0.75, y: window.innerHeight * 0.3 }
    ];

    points.forEach(point => {
      for (let i = 0; i < 20; i++) {
        setTimeout(() => {
          this.createConfetti(point.x, point.y);
        }, i * 30);
      }
    });

    this.screenShake(400);
  }

  createConfetti(x, y) {
    const shapes = ['▲', '●', '■', '★', '♦'];
    const colors = ['#0ea5a4', '#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];
    
    const confetti = document.createElement('div');
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.random() * 20 + 15;
    
    confetti.textContent = shape;
    confetti.style.cssText = `
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      font-size: ${size}px;
      color: ${color};
      pointer-events: none;
      user-select: none;
    `;

    this.particleContainer.appendChild(confetti);

    const angle = (Math.random() * Math.PI * 2);
    const velocity = Math.random() * 200 + 100;
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity - 150;
    const rotation = Math.random() * 720 - 360;

    const duration = 2000 + Math.random() * 1000;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = elapsed / duration;

      if (progress >= 1) {
        confetti.remove();
        return;
      }

      const t = progress;
      const gravity = 400;
      const currentX = x + vx * t;
      const currentY = y + vy * t + 0.5 * gravity * t * t;
      const opacity = 1 - progress;
      const currentRotation = rotation * progress;

      confetti.style.left = currentX + 'px';
      confetti.style.top = currentY + 'px';
      confetti.style.opacity = opacity;
      confetti.style.transform = `rotate(${currentRotation}deg)`;

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }

  // Clean up
  destroy() {
    if (this.particleContainer) {
      this.particleContainer.remove();
      this.particleContainer = null;
    }
  }
}
