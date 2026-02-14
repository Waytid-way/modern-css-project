/**
 * Countdown Timer Component
 * Real-time countdown with flip animations
 */

class CountdownTimer {
  constructor(targetDate) {
    // Default target: Valentine's Day next year or custom date
    this.targetDate = targetDate || this.getDefaultTargetDate();
    
    this.elements = {
      days: document.getElementById('days'),
      hours: document.getElementById('hours'),
      minutes: document.getElementById('minutes'),
      seconds: document.getElementById('seconds'),
      target: document.getElementById('countdownTarget'),
      card: document.querySelector('.countdown-card')
    };
    
    this.previousValues = {
      days: '00',
      hours: '00',
      minutes: '00',
      seconds: '00'
    };
    
    this.init();
  }
  
  getDefaultTargetDate() {
    const now = new Date();
    const currentYear = now.getFullYear();
    let target = new Date(`February 14, ${currentYear} 00:00:00`);
    
    // If Valentine's Day has passed this year, target next year
    if (target < now) {
      target = new Date(`February 14, ${currentYear + 1} 00:00:00`);
    }
    
    return target;
  }
  
  init() {
    if (!this.elements.days) return;
    
    // Display target date
    this.displayTargetDate();
    
    // Initial update
    this.update();
    
    // Start interval
    this.intervalId = setInterval(() => this.update(), 1000);
  }
  
  update() {
    const now = new Date();
    const diff = this.targetDate - now;
    
    if (diff <= 0) {
      this.onComplete();
      return;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    this.updateDisplay(days, hours, minutes, seconds);
  }
  
  updateDisplay(days, hours, minutes, seconds) {
    const values = {
      days: String(days).padStart(2, '0'),
      hours: String(hours).padStart(2, '0'),
      minutes: String(minutes).padStart(2, '0'),
      seconds: String(seconds).padStart(2, '0')
    };
    
    // Update each unit with animation if changed
    Object.keys(values).forEach(unit => {
      if (values[unit] !== this.previousValues[unit]) {
        this.animateUnit(unit, values[unit]);
        this.previousValues[unit] = values[unit];
      }
    });
  }
  
  animateUnit(unit, value) {
    const element = this.elements[unit];
    if (!element) return;
    
    // Add flip animation
    element.classList.add('flip');
    
    // Update value mid-animation
    setTimeout(() => {
      element.textContent = value;
    }, 300);
    
    // Remove animation class
    setTimeout(() => {
      element.classList.remove('flip');
    }, 600);
  }
  
  onComplete() {
    // Clear interval
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    
    // Display zeros
    this.updateDisplay(0, 0, 0, 0);
    
    // Add complete class for celebration styling
    if (this.elements.card) {
      this.elements.card.classList.add('countdown-complete');
    }
    
    // Update message
    const message = document.querySelector('.countdown-message');
    if (message) {
      message.textContent = "Time to meet! 💕✨";
    }
    
    // Trigger celebration
    this.celebrate();
  }
  
  celebrate() {
    if (window.HeartAnimations) {
      window.HeartAnimations.triggerLoveExplosion();
    }
    
    // Play sound if music player exists
    if (window.musicPlayer && typeof window.musicPlayer.play === 'function') {
      window.musicPlayer.play();
    }
  }
  
  displayTargetDate() {
    if (this.elements.target) {
      const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      this.elements.target.textContent = `Target: ${this.targetDate.toLocaleDateString('en-US', options)}`;
    }
  }
  
  // Public method to set new target date
  setTargetDate(date) {
    this.targetDate = new Date(date);
    this.previousValues = { days: '00', hours: '00', minutes: '00', seconds: '00' };
    
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    
    if (this.elements.card) {
      this.elements.card.classList.remove('countdown-complete');
    }
    
    this.displayTargetDate();
    this.update();
    this.intervalId = setInterval(() => this.update(), 1000);
  }
  
  // Public method to get time remaining in milliseconds
  getTimeRemaining() {
    return Math.max(0, this.targetDate - new Date());
  }
  
  // Cleanup method
  destroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('countdownSection')) {
    // Check for saved target date in config or localStorage
    let targetDate = null;
    
    // Try to get from config if available
    if (window.CONFIG && window.CONFIG.countdown && window.CONFIG.countdown.targetDate) {
      targetDate = new Date(window.CONFIG.countdown.targetDate);
    }
    
    // Try to get from localStorage
    const savedDate = localStorage.getItem('countdownTargetDate');
    if (savedDate) {
      targetDate = new Date(savedDate);
    }
    
    window.countdownTimer = new CountdownTimer(targetDate);
  }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CountdownTimer;
}
