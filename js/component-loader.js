/**
 * Component Loader
 * Dynamically loads all components and initializes them
 */

class ComponentLoader {
  constructor() {
    this.container = document.getElementById('loveFeatures');
    this.componentsLoaded = 0;
    this.totalComponents = 6;
    
    this.componentFiles = [
      { name: 'hero', file: 'components/hero.html' },
      { name: 'kiss-counter', file: 'components/kiss-counter.html' },
      { name: 'love-meter', file: 'components/love-meter.html' },
      { name: 'countdown', file: 'components/countdown.html' },
      { name: 'music-player', file: 'components/music-player.html' },
      { name: 'game-cards', file: 'components/game-cards.html' }
    ];
    
    this.init();
  }
  
  async init() {
    if (!this.container) {
      console.warn('Component container not found');
      return;
    }
    
    try {
      await this.loadAllComponents();
      this.setupScrollAnimations();
      this.setupEntryAnimations();
      console.log('All components loaded successfully');
    } catch (error) {
      console.error('Error loading components:', error);
    }
  }
  
  async loadAllComponents() {
    // Load components sequentially to maintain order
    for (const component of this.componentFiles) {
      try {
        await this.loadComponent(component);
        this.componentsLoaded++;
      } catch (error) {
        console.warn(`Failed to load ${component.name}:`, error);
      }
    }
  }
  
  async loadComponent(component) {
    const response = await fetch(component.file);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const html = await response.text();
    
    // Create a wrapper to insert the component
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    
    // Add animation class to the section
    const section = wrapper.querySelector('section');
    if (section) {
      section.classList.add('animate-on-scroll');
    }
    
    // Append to container
    while (wrapper.firstChild) {
      this.container.appendChild(wrapper.firstChild);
    }
  }
  
  setupScrollAnimations() {
    // Use Intersection Observer for scroll-triggered animations
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -100px 0px',
      threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          
          // Add stagger animation to child cards
          const cards = entry.target.querySelectorAll('.card');
          cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
          });
          
          // Unobserve after animation
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    // Observe all animated sections
    document.querySelectorAll('.animate-on-scroll').forEach(section => {
      observer.observe(section);
    });
  }
  
  setupEntryAnimations() {
    // Add hero-specific entry animations
    const heroSection = document.getElementById('heroSection');
    if (heroSection) {
      heroSection.classList.add('animate-hero');
      
      // Trigger hero animations immediately
      setTimeout(() => {
        heroSection.classList.add('animated');
      }, 100);
    }
  }
  
  // Public method to manually refresh components
  refresh() {
    if (this.container) {
      this.container.innerHTML = '';
      this.init();
    }
  }
  
  // Public method to get load progress
  getProgress() {
    return {
      loaded: this.componentsLoaded,
      total: this.totalComponents,
      percentage: Math.round((this.componentsLoaded / this.totalComponents) * 100)
    };
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Check if we're on the love page
  const lovePage = document.getElementById('lovePage');
  if (lovePage && !lovePage.classList.contains('hidden')) {
    window.componentLoader = new ComponentLoader();
  }
});

// Also initialize when transition to love page happens
window.initComponentLoader = function() {
  const container = document.getElementById('loveFeatures');
  if (container && container.children.length === 0) {
    window.componentLoader = new ComponentLoader();
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ComponentLoader;
}
