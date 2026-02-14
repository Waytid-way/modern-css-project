/**
 * Kiss Counter Component
 * Interactive kiss counter with localStorage persistence
 */

class KissCounter {
  constructor() {
    this.count = parseInt(localStorage.getItem('kissCount')) || 0;
    this.maxCount = 500;
    this.milestones = [10, 50, 100, 500];
    
    this.elements = {
      button: document.getElementById('kissBtn'),
      count: document.getElementById('kissCount'),
      progress: document.getElementById('kissProgress'),
      milestones: document.querySelectorAll('.milestone')
    };
    
    this.init();
  }
  
  init() {
    if (!this.elements.button) return;
    
    this.updateDisplay();
    this.checkMilestones();
    
    // Event listeners
    this.elements.button.addEventListener('click', () => this.addKiss());
    
    // Keyboard support
    this.elements.button.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.addKiss();
      }
    });
  }
  
  addKiss() {
    this.count++;
    localStorage.setItem('kissCount', this.count);
    
    this.updateDisplay();
    this.checkMilestones();
    this.triggerAnimation();
    
    // Trigger heart burst animation
    if (window.HeartAnimations) {
      const rect = this.elements.button.getBoundingClientRect();
      window.HeartAnimations.triggerHeartBurst(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2
      );
    }
    
    // Haptic feedback on mobile
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  }
  
  updateDisplay() {
    // Update count text
    const kissText = this.count === 1 ? 'kiss' : 'kisses';
    this.elements.count.textContent = `${this.count} ${kissText}`;
    
    // Update progress bar
    const progress = Math.min((this.count / this.maxCount) * 100, 100);
    this.elements.progress.style.width = `${progress}%`;
  }
  
  checkMilestones() {
    this.milestones.forEach((milestone, index) => {
      const milestoneEl = this.elements.milestones[index];
      if (milestoneEl && this.count >= milestone) {
        if (!milestoneEl.classList.contains('achieved')) {
          milestoneEl.classList.add('achieved');
          this.celebrateMilestone(milestone);
        }
      }
    });
  }
  
  celebrateMilestone(milestone) {
    // Show milestone celebration
    const messages = {
      10: "10 kisses! Keep it going! 💋",
      50: "50 kisses! You're amazing! 💕",
      100: "100 kisses! Century club! 💖",
      500: "500 kisses! Legendary love! 💗"
    };
    
    if (messages[milestone]) {
      this.showToast(messages[milestone]);
    }
  }
  
  showToast(message) {
    // Create toast notification
    const toast = document.createElement('div');
    toast.className = 'kiss-milestone-toast';
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
    }, 3000);
  }
  
  triggerAnimation() {
    // Add pressed animation class
    this.elements.button.classList.add('pressed');
    
    setTimeout(() => {
      this.elements.button.classList.remove('pressed');
    }, 300);
    
    // Animate count text
    this.elements.count.style.transform = 'scale(1.2)';
    setTimeout(() => {
      this.elements.count.style.transform = 'scale(1)';
    }, 200);
  }
  
  // Public method to reset counter
  reset() {
    this.count = 0;
    localStorage.setItem('kissCount', '0');
    this.updateDisplay();
    this.elements.milestones.forEach(el => el.classList.remove('achieved'));
  }
  
  // Public method to set specific count
  setCount(count) {
    this.count = Math.max(0, parseInt(count) || 0);
    localStorage.setItem('kissCount', this.count.toString());
    this.updateDisplay();
    this.checkMilestones();
  }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('kissSection')) {
    window.kissCounter = new KissCounter();
  }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = KissCounter;
}
