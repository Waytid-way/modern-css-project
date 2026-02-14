/**
 * Component Loader
 * Dynamically loads all components with error handling and loading states
 */

class ComponentLoader {
  constructor() {
    this.container = document.getElementById('loveFeatures');
    this.componentsLoaded = 0;
    this.totalComponents = 6;
    this.errors = [];
    this.loadingOverlay = null;
    
    this.componentFiles = [
      { name: 'hero', file: 'components/hero.html', critical: true },
      { name: 'kiss-counter', file: 'components/kiss-counter.html', critical: false },
      { name: 'love-meter', file: 'components/love-meter.html', critical: false },
      { name: 'countdown', file: 'components/countdown.html', critical: false },
      { name: 'music-player', file: 'components/music-player.html', critical: false },
      { name: 'game-cards', file: 'components/game-cards.html', critical: false }
    ];
    
    this.init();
  }
  
  async init() {
    if (!this.container) {
      console.error('Component container #loveFeatures not found');
      this.showError('Failed to initialize: Container not found');
      return;
    }
    
    // Show loading overlay
    this.showLoading();
    
    try {
      await this.loadAllComponents();
      this.setupScrollAnimations();
      this.setupEntryAnimations();
      
      // Log success
      if (this.errors.length === 0) {
        console.log(`All ${this.componentsLoaded} components loaded successfully`);
      } else {
        console.warn(`Loaded ${this.componentsLoaded}/${this.totalComponents} components with ${this.errors.length} errors:`, this.errors);
      }
    } catch (error) {
      console.error('Critical error loading components:', error);
      this.showError('Failed to load components. Please refresh the page.');
    } finally {
      // Hide loading overlay after a short delay
      setTimeout(() => {
        this.hideLoading();
      }, 500);
    }
  }
  
  showLoading() {
    this.loadingOverlay = document.getElementById('loadingOverlay');
    if (this.loadingOverlay) {
      this.loadingOverlay.classList.remove('hidden');
    }
  }
  
  hideLoading() {
    if (this.loadingOverlay) {
      this.loadingOverlay.classList.add('hidden');
    }
  }
  
  showError(message) {
    const errorBoundary = document.getElementById('errorBoundary');
    if (errorBoundary) {
      const errorContent = errorBoundary.querySelector('.error-content p');
      if (errorContent) {
        errorContent.textContent = message;
      }
      errorBoundary.classList.remove('hidden');
    }
    this.hideLoading();
  }
  
  async loadAllComponents() {
    // Load components sequentially to maintain order
    for (const component of this.componentFiles) {
      try {
        await this.loadComponent(component);
        this.componentsLoaded++;
      } catch (error) {
        this.errors.push({ file: component.file, error: error.message });
        console.warn(`Failed to load ${component.name}:`, error);
        
        // If critical component fails, throw error
        if (component.critical) {
          throw new Error(`Critical component ${component.name} failed to load: ${error.message}`);
        }
      }
    }
  }
  
  async loadComponent(component) {
    // Add timeout to fetch
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    try {
      const response = await fetch(component.file, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const html = await response.text();
      
      // Check if HTML is empty or just whitespace
      if (!html.trim()) {
        throw new Error('Empty component file');
      }
      
      // Create a wrapper to insert the component
      const wrapper = document.createElement('div');
      wrapper.innerHTML = html;
      
      // Add animation class to the section
      const section = wrapper.querySelector('section');
      if (section) {
        section.classList.add('animate-on-scroll');
        section.setAttribute('data-component', component.name);
      }
      
      // Append to container
      while (wrapper.firstChild) {
        this.container.appendChild(wrapper.firstChild);
      }
      
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('Loading timeout - component took too long to load');
      }
      
      throw error;
    }
  }
  
  setupScrollAnimations() {
    // Check if Intersection Observer is available
    if (!('IntersectionObserver' in window)) {
      // Fallback: show all components immediately
      document.querySelectorAll('.animate-on-scroll').forEach(section => {
        section.classList.add('animated');
      });
      return;
    }
    
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
      this.componentsLoaded = 0;
      this.errors = [];
      this.init();
    }
  }
  
  // Public method to get load progress
  getProgress() {
    return {
      loaded: this.componentsLoaded,
      total: this.totalComponents,
      percentage: Math.round((this.componentsLoaded / this.totalComponents) * 100),
      errors: this.errors
    };
  }
  
  // Public method to retry loading failed components
  async retryFailed() {
    if (this.errors.length === 0) return;
    
    const failedComponents = this.componentFiles.filter(cf => 
      this.errors.some(e => e.file === cf.file)
    );
    
    console.log(`Retrying ${failedComponents.length} failed components...`);
    
    for (const component of failedComponents) {
      try {
        await this.loadComponent(component);
        this.componentsLoaded++;
        // Remove from errors
        this.errors = this.errors.filter(e => e.file !== component.file);
      } catch (error) {
        console.warn(`Retry failed for ${component.name}:`, error);
      }
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Check if we're on the love page and it's visible
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
