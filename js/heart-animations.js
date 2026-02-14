// heart-animations.js - PNG Version
class HeartAnimations {
  constructor() {
    // กำหนด path ของรูปหัวใจ
    this.heartImages = {
      red: 'assets/images/hearts/heart-red.png',
      pink: 'assets/images/hearts/heart-pink.png',
      gradient: 'assets/images/hearts/heart-gradient.png',
      sparkle: 'assets/images/hearts/heart-sparkle.png',
      outline: 'assets/images/hearts/heart-outline.png'
    };

    this.init();
  }

  init() {
    // Preload images
    this.preloadImages();
    // Create containers
    this.createFloatingHearts();
    this.setupMouseTrail();
  }

  // Preload heart images
  preloadImages() {
    Object.values(this.heartImages).forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }

  // Helper: Create heart image element
  createHeartImage(type = 'red') {
    const img = document.createElement('img');
    img.src = this.heartImages[type] || this.heartImages.red;
    img.alt = 'Heart';
    img.loading = 'lazy';
    return img;
  }

  // 1. Floating Hearts Background
  createFloatingHearts() {
    const container = document.createElement('div');
    container.className = 'floating-hearts-container';
    document.body.appendChild(container);

    const types = ['red', 'pink', 'gradient', 'sparkle', 'outline', 'red'];

    for (let i = 0; i < 6; i++) {
      const heart = document.createElement('div');
      heart.className = 'floating-heart';
      heart.appendChild(this.createHeartImage(types[i]));
      container.appendChild(heart);
    }
  }

  // 2. Heart Burst Effect
  triggerHeartBurst(x, y) {
    const container = document.createElement('div');
    container.className = 'heart-burst-container';
    container.style.left = `${x}px`;
    container.style.top = `${y}px`;
    document.body.appendChild(container);

    const types = ['red', 'pink', 'gradient', 'sparkle', 'outline', 'red', 'pink', 'gradient'];

    types.forEach((type, i) => {
      const heartEl = document.createElement('div');
      heartEl.className = 'heart-burst';
      heartEl.appendChild(this.createHeartImage(type));
      container.appendChild(heartEl);
    });

    // Remove after animation
    setTimeout(() => container.remove(), 1500);
  }

  // 3. Heart Rain Effect
  startHeartRain(duration = 10000) {
    const container = document.createElement('div');
    container.className = 'heart-rain-container';
    document.body.appendChild(container);

    const types = ['red', 'pink', 'gradient', 'sparkle', 'outline'];

    for (let i = 0; i < 10; i++) {
      const heart = document.createElement('div');
      heart.className = 'heart-rain';
      const randomType = types[Math.floor(Math.random() * types.length)];
      heart.appendChild(this.createHeartImage(randomType));
      container.appendChild(heart);
    }

    // Stop after duration
    setTimeout(() => container.remove(), duration);
  }

  // 4. Mouse Trail Hearts
  setupMouseTrail() {
    let lastX = 0, lastY = 0;
    let throttle = false;
    let colorIndex = 0;
    const types = ['pink', 'red', 'gradient', 'sparkle'];

    document.addEventListener('mousemove', (e) => {
      if (throttle) return;

      const distance = Math.sqrt(
        Math.pow(e.clientX - lastX, 2) +
        Math.pow(e.clientY - lastY, 2)
      );

      if (distance > 30) {
        this.createTrailHeart(e.clientX, e.clientY, types[colorIndex % types.length]);
        colorIndex++;
        lastX = e.clientX;
        lastY = e.clientY;

        throttle = true;
        setTimeout(() => throttle = false, 100);
      }
    });
  }

  createTrailHeart(x, y, type = 'pink') {
    const heart = document.createElement('div');
    heart.className = 'heart-trail';
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    heart.appendChild(this.createHeartImage(type));
    document.body.appendChild(heart);

    setTimeout(() => heart.remove(), 1000);
  }

  // 5. Love Explosion (for transition)
  triggerLoveExplosion() {
    const container = document.createElement('div');
    container.className = 'love-explosion-container';
    document.body.appendChild(container);

    const types = ['red', 'pink', 'gradient', 'sparkle', 'outline', 'red', 'pink', 'gradient'];

    types.forEach((type, i) => {
      const el = document.createElement('div');
      el.className = 'love-particle';
      el.appendChild(this.createHeartImage(type));
      container.appendChild(el);
    });

    setTimeout(() => container.remove(), 2000);
  }

  // 6. Transition Heart
  showTransitionHeart() {
    const heart = document.createElement('div');
    heart.className = 'transition-heart';
    heart.appendChild(this.createHeartImage('gradient'));
    document.body.appendChild(heart);

    setTimeout(() => heart.remove(), 2000);
  }

  // 7. Stop all animations
  stopAll() {
    document.querySelectorAll('.floating-hearts-container, .heart-rain-container, .heart-burst-container, .love-explosion-container').forEach(el => el.remove());
  }
}

// Initialize
const heartAnimations = new HeartAnimations();

// Export for use in other scripts
window.HeartAnimations = heartAnimations;
