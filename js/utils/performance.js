/**
 * PerformanceOptimizer - Utility for performance optimization
 * Debounce, throttle, lazy loading, and other performance utilities
 */

class PerformanceOptimizer {
  // Debounce utility - delays function execution until after wait milliseconds have elapsed
  static debounce(func, wait = 300, immediate = false) {
    let timeout;
    
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        if (!immediate) func.apply(this, args);
      };
      
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      
      if (callNow) func.apply(this, args);
    };
  }
  
  // Throttle utility - limits function execution to once per limit milliseconds
  static throttle(func, limit = 300) {
    let inThrottle;
    
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
  
  // RAF throttle - throttle using requestAnimationFrame for smooth animations
  static rafThrottle(func) {
    let ticking = false;
    
    return function(...args) {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          func.apply(this, args);
          ticking = false;
        });
        ticking = true;
      }
    };
  }
  
  // Lazy load images using Intersection Observer
  static lazyLoadImages(selector = 'img[data-src]') {
    const images = document.querySelectorAll(selector);
    
    if (!images.length) return;
    
    // Check if Intersection Observer is available
    if (!('IntersectionObserver' in window)) {
      // Fallback: load all images immediately
      images.forEach(img => {
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
      });
      return;
    }
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          
          // Load image
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            
            // Add loaded class for transition effects
            img.classList.add('loaded');
          }
          
          // Stop observing this image
          observer.unobserve(img);
        }
      });
    }, {
      root: null,
      rootMargin: '50px 0px', // Load slightly before they come into view
      threshold: 0.01
    });
    
    images.forEach(img => imageObserver.observe(img));
  }
  
  // Preload critical resources
  static preloadResources(urls) {
    if (!Array.isArray(urls)) return;
    
    urls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preload';
      
      // Determine resource type
      if (url.endsWith('.css')) {
        link.as = 'style';
      } else if (url.endsWith('.js')) {
        link.as = 'script';
      } else if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
        link.as = 'image';
      } else if (url.endsWith('.woff2') || url.endsWith('.woff')) {
        link.as = 'font';
        link.crossOrigin = 'anonymous';
      }
      
      link.href = url;
      document.head.appendChild(link);
    });
  }
  
  // Prefetch resources that will be needed soon
  static prefetchResources(urls) {
    if (!Array.isArray(urls)) return;
    
    urls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = url;
      document.head.appendChild(link);
    });
  }
  
  // Optimize animations by pausing when tab is hidden
  static optimizeAnimations(animationCallback, fps = 60) {
    let animationId = null;
    let isRunning = false;
    const fpsInterval = 1000 / fps;
    let then = performance.now();
    
    const loop = (now) => {
      if (!isRunning) return;
      
      animationId = requestAnimationFrame(loop);
      
      // Throttle to target FPS
      const elapsed = now - then;
      if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval);
        animationCallback();
      }
    };
    
    const start = () => {
      if (!isRunning) {
        isRunning = true;
        then = performance.now();
        animationId = requestAnimationFrame(loop);
      }
    };
    
    const stop = () => {
      isRunning = false;
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    };
    
    // Pause when tab is hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stop();
      } else {
        start();
      }
    });
    
    return { start, stop };
  }
  
  // Measure performance metrics
  static measurePerformance() {
    const metrics = {};
    
    // Navigation timing
    if (performance && performance.timing) {
      const timing = performance.timing;
      metrics.domReady = timing.domContentLoadedEventEnd - timing.navigationStart;
      metrics.loadComplete = timing.loadEventEnd - timing.navigationStart;
    }
    
    // First Contentful Paint
    if (performance && performance.getEntriesByType) {
      const paintEntries = performance.getEntriesByType('paint');
      paintEntries.forEach(entry => {
        if (entry.name === 'first-contentful-paint') {
          metrics.fcp = entry.startTime;
        }
      });
    }
    
    // Memory usage (if available)
    if (performance && performance.memory) {
      metrics.memory = {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit
      };
    }
    
    return metrics;
  }
  
  // Log performance metrics
  static logPerformance() {
    const metrics = this.measurePerformance();
    console.log('📊 Performance Metrics:', metrics);
    return metrics;
  }
  
  // Batch DOM updates for better performance
  static batchDOMUpdates(updates) {
    return new Promise((resolve) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          updates();
          resolve();
        });
      });
    });
  }
  
  // Clean up event listeners and observers
  static cleanup(target) {
    // Remove all event listeners (requires storing references)
    // This is a helper method for manual cleanup
    
    // Kill any running animations
    const animatedElements = target.querySelectorAll('.animating');
    animatedElements.forEach(el => {
      el.style.animation = 'none';
      el.classList.remove('animating');
    });
  }
}

// Auto-optimize images on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  PerformanceOptimizer.lazyLoadImages();
});

// Export
window.PerformanceOptimizer = PerformanceOptimizer;

// CommonJS export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PerformanceOptimizer;
}
