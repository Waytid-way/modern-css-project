/**
 * Love Meter Component
 * Interactive slider with dynamic emoji reactions and messages
 */

class LoveMeter {
  constructor() {
    this.slider = document.getElementById('loveSlider');
    this.valueDisplay = document.getElementById('meterValue');
    this.messageDisplay = document.getElementById('meterMessage');
    this.emojis = document.querySelectorAll('.meter-emoji-scale .emoji');
    
    // Messages for different love levels
    this.messages = [
      { threshold: 0, text: "I know you still love me deep down... 💙", emoji: 0 },
      { threshold: 20, text: "Every bit of love counts! 🌱", emoji: 1 },
      { threshold: 40, text: "You're warming up! 💛", emoji: 2 },
      { threshold: 60, text: "You make my heart skip a beat! 💓", emoji: 2 },
      { threshold: 80, text: "I'm head over heels for you! 🌹", emoji: 3 },
      { threshold: 95, text: "My love for you is infinite! 💖", emoji: 4 }
    ];
    
    this.init();
  }
  
  init() {
    if (!this.slider) return;
    
    // Initial update
    this.update();
    
    // Event listeners
    this.slider.addEventListener('input', () => this.update());
    this.slider.addEventListener('change', () => this.onFinalValue());
    
    // Touch support for mobile
    let touchStartValue = 0;
    this.slider.addEventListener('touchstart', (e) => {
      touchStartValue = parseInt(this.slider.value);
    });
    
    this.slider.addEventListener('touchend', () => {
      const currentValue = parseInt(this.slider.value);
      if (currentValue !== touchStartValue) {
        this.onFinalValue();
      }
    });
  }
  
  update() {
    const value = parseInt(this.slider.value);
    
    // Update value display
    this.valueDisplay.textContent = `${value}%`;
    
    // Update value color based on level
    this.updateValueColor(value);
    
    // Update active emoji
    this.updateEmojis(value);
    
    // Update message
    this.updateMessage(value);
    
    // Update slider track background
    this.updateSliderTrack(value);
  }
  
  updateValueColor(value) {
    this.valueDisplay.classList.remove('love-level-low', 'love-level-medium', 'love-level-high', 'love-level-max');
    
    if (value < 25) {
      this.valueDisplay.classList.add('love-level-low');
    } else if (value < 50) {
      this.valueDisplay.classList.add('love-level-medium');
    } else if (value < 90) {
      this.valueDisplay.classList.add('love-level-high');
    } else {
      this.valueDisplay.classList.add('love-level-max');
    }
  }
  
  updateEmojis(value) {
    // Calculate which emoji should be active
    const emojiIndex = Math.floor((value / 100) * (this.emojis.length - 1));
    const clampedIndex = Math.min(emojiIndex, this.emojis.length - 1);
    
    this.emojis.forEach((emoji, i) => {
      emoji.classList.toggle('active', i === clampedIndex);
    });
  }
  
  updateMessage(value) {
    // Find appropriate message
    const message = this.messages
      .slice()
      .reverse()
      .find(m => value >= m.threshold) || this.messages[0];
    
    if (this.messageDisplay.textContent !== message.text) {
      this.messageDisplay.classList.add('update');
      this.messageDisplay.textContent = message.text;
      
      setTimeout(() => {
        this.messageDisplay.classList.remove('update');
      }, 300);
    }
  }
  
  updateSliderTrack(value) {
    // Update CSS custom property for gradient track
    this.slider.style.setProperty('--value', `${value}%`);
  }
  
  onFinalValue() {
    const value = parseInt(this.slider.value);
    
    // Trigger celebration at high values
    if (value >= 90) {
      this.celebrateHighLove();
    }
    
    // Save to localStorage
    localStorage.setItem('loveMeterValue', value.toString());
    
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate([50, 30, 50]);
    }
  }
  
  celebrateHighLove() {
    // Trigger heart animations
    if (window.HeartAnimations) {
      window.HeartAnimations.triggerLoveExplosion();
    }
    
    // Show celebration toast
    this.showToast("Maximum love achieved! 💖✨");
  }
  
  showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'love-meter-toast';
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 100px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--gradient-primary);
      color: white;
      padding: 12px 24px;
      border-radius: 24px;
      font-weight: 600;
      z-index: 1000;
      animation: slideInUp 0.3s ease;
      box-shadow: 0 4px 16px rgba(236, 72, 153, 0.4);
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.animation = 'slideOutDown 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }
  
  // Public method to restore saved value
  restoreSavedValue() {
    const saved = localStorage.getItem('loveMeterValue');
    if (saved !== null) {
      this.slider.value = saved;
      this.update();
    }
  }
  
  // Public method to set value programmatically
  setValue(value) {
    this.slider.value = Math.max(0, Math.min(100, value));
    this.update();
    this.onFinalValue();
  }
  
  // Public method to get current value
  getValue() {
    return parseInt(this.slider.value);
  }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('meterSection')) {
    window.loveMeter = new LoveMeter();
    // Restore saved value after a short delay to allow animations
    setTimeout(() => window.loveMeter.restoreSavedValue(), 500);
  }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LoveMeter;
}
