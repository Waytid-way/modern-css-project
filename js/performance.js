// Performance Optimization Utilities

class PerformanceManager {
    constructor() {
        this.config = CONFIG.performance;
        this.debounceTimers = new Map();
        this.intersectionObserver = null;
        this.resizeObserver = null;
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupResizeObserver();
        this.optimizeImages();
        this.setupEventDebouncing();
        this.setupPerformanceMonitoring();
    }

    setupIntersectionObserver() {
        // Lazy loading for images and heavy elements
        const options = {
            root: null,
            rootMargin: '50px',
            threshold: 0.1
        };

        this.intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadElement(entry.target);
                    this.intersectionObserver.unobserve(entry.target);
                }
            });
        }, options);

        // Observe elements that should be lazy loaded
        this.observeLazyElements();
    }

    setupResizeObserver() {
        // Optimize resize events
        this.resizeObserver = new ResizeObserver(
            this.debounce((entries) => {
                entries.forEach(entry => {
                    this.handleResize(entry.target);
                });
            }, this.config.debounceDelay)
        );
    }

    observeLazyElements() {
        // Memory cards
        const memoryCards = document.querySelectorAll('.memory-card');
        memoryCards.forEach(card => {
            card.classList.add('lazy-load');
            this.intersectionObserver.observe(card);
        });

        // Love sections
        const loveSections = document.querySelectorAll('.love-section');
        loveSections.forEach((section, index) => {
            section.classList.add('lazy-load');
            // Add staggered animation delay
            section.style.animationDelay = `${index * 0.1}s`;
            this.intersectionObserver.observe(section);
        });

        // Images (if any)
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => {
            this.intersectionObserver.observe(img);
        });
    }

    loadElement(element) {
        if (element.classList.contains('lazy-load')) {
            element.classList.remove('lazy-load');
            element.classList.add('animate-fade-in');
            
            // Add will-change for smooth animations
            if (this.config.enableWillChange) {
                element.style.willChange = 'transform, opacity';
                
                // Remove will-change after animation
                setTimeout(() => {
                    element.style.willChange = 'auto';
                }, 1000);
            }
        }

        // Load images with data-src
        if (element.dataset.src) {
            element.src = element.dataset.src;
            element.onload = () => {
                element.classList.add('loaded');
            };
        }
    }

    optimizeImages() {
        if (!this.config.lazyLoadImages) return;

        // Convert images to WebP if supported
        if (this.supportsWebP()) {
            const images = document.querySelectorAll('img[src$=".jpg"], img[src$=".png"]');
            images.forEach(img => {
                const webpSrc = img.src.replace(/\.(jpg|png)$/, '.webp');
                this.testImageLoad(webpSrc, () => {
                    img.src = webpSrc;
                });
            });
        }

        // Add loading="lazy" attribute to images
        const images = document.querySelectorAll('img:not([loading])');
        images.forEach(img => {
            img.loading = 'lazy';
        });
    }

    supportsWebP() {
        return new Promise(resolve => {
            const webP = new Image();
            webP.onload = webP.onerror = () => {
                resolve(webP.height === 2);
            };
            webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        });
    }

    testImageLoad(url, callback) {
        const img = new Image();
        img.onload = callback;
        img.onerror = () => {}; // Silently fail
        img.src = url;
    }

    setupEventDebouncing() {
        // Debounce scroll events
        let scrollTimer = null;
        window.addEventListener('scroll', () => {
            if (scrollTimer) return;
            
            scrollTimer = setTimeout(() => {
                this.handleScroll();
                scrollTimer = null;
            }, this.config.debounceDelay);
        }, { passive: true });

        // Debounce resize events
        window.addEventListener('resize', 
            this.debounce(() => {
                this.handleWindowResize();
            }, this.config.debounceDelay)
        );
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    handleScroll() {
        // Parallax effects for love page
        if (document.getElementById('lovePage').classList.contains('hidden')) return;

        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.love-section');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }

    handleWindowResize() {
        // Optimize for mobile
        if (this.config.optimizeForMobile && window.innerWidth <= 768) {
            this.optimizeForMobile();
        } else {
            this.optimizeForDesktop();
        }
    }

    handleResize(element) {
        // Handle individual element resize
        if (element.classList.contains('carousel-container')) {
            this.optimizeCarousel(element);
        }
    }

    optimizeForMobile() {
        // Reduce animations on mobile
        const animatedElements = document.querySelectorAll('.floating-heart, .sparkle');
        animatedElements.forEach(el => {
            if (Math.random() > 0.3) { // Keep 30% of animations
                el.style.display = 'none';
            }
        });

        // Simplify carousel
        const carouselSlides = document.querySelectorAll('.carousel-slide');
        carouselSlides.forEach(slide => {
            slide.style.height = '250px';
        });
    }

    optimizeForDesktop() {
        // Restore full animations
        const animatedElements = document.querySelectorAll('.floating-heart, .sparkle');
        animatedElements.forEach(el => {
            el.style.display = '';
        });

        // Restore carousel height
        const carouselSlides = document.querySelectorAll('.carousel-slide');
        carouselSlides.forEach(slide => {
            slide.style.height = '';
        });
    }

    optimizeCarousel(container) {
        const slides = container.querySelectorAll('.carousel-slide');
        const containerWidth = container.offsetWidth;
        
        slides.forEach(slide => {
            slide.style.width = containerWidth + 'px';
        });
    }

    setupPerformanceMonitoring() {
        // Monitor FPS
        let fps = 0;
        let lastTime = performance.now();
        let frames = 0;

        const measureFPS = () => {
            frames++;
            const currentTime = performance.now();
            
            if (currentTime >= lastTime + 1000) {
                fps = Math.round((frames * 1000) / (currentTime - lastTime));
                frames = 0;
                lastTime = currentTime;
                
                // Adjust quality if FPS is too low
                if (fps < 30) {
                    this.reduceQuality();
                } else if (fps > 50) {
                    this.increaseQuality();
                }
            }
            
            requestAnimationFrame(measureFPS);
        };

        requestAnimationFrame(measureFPS);

        // Monitor memory usage
        if (performance.memory) {
            setInterval(() => {
                const memoryUsage = performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit;
                if (memoryUsage > 0.8) {
                    this.cleanupMemory();
                }
            }, 10000);
        }
    }

    reduceQuality() {
        // Reduce animation quality
        document.documentElement.style.setProperty('--animation-duration', '0.3s');
        
        // Reduce particle effects
        const particles = document.querySelectorAll('.floating-heart, .sparkle');
        const maxParticles = Math.min(particles.length, this.config.maxConcurrentAnimations);
        
        particles.forEach((particle, index) => {
            if (index >= maxParticles) {
                particle.style.display = 'none';
            }
        });
    }

    increaseQuality() {
        // Increase animation quality
        document.documentElement.style.setProperty('--animation-duration', '0.5s');
        
        // Restore particle effects
        const particles = document.querySelectorAll('.floating-heart, .sparkle');
        particles.forEach(particle => {
            particle.style.display = '';
        });
    }

    cleanupMemory() {
        // Clean up unused elements
        const unusedElements = document.querySelectorAll('.floating-heart, .sparkle');
        unusedElements.forEach(el => {
            if (el.parentNode) {
                el.parentNode.removeChild(el);
            }
        });

        // Force garbage collection if available
        if (window.gc) {
            window.gc();
        }
    }

    // Performance measurement utilities
    measurePerformance(name, fn) {
        const start = performance.now();
        const result = fn();
        const end = performance.now();
        
        console.log(`${name} took ${end - start} milliseconds`);
        return result;
    }

    markPerformance(name) {
        if (performance.mark) {
            performance.mark(name);
        }
    }

    measurePerformanceMark(startMark, endMark, measureName) {
        if (performance.measure) {
            performance.measure(measureName, startMark, endMark);
            const measures = performance.getEntriesByName(measureName);
            console.log(`${measureName}: ${measures[0].duration}ms`);
        }
    }

    // Preload critical resources
    preloadResources() {
        const criticalResources = [
            'css/fake-style.css',
            'css/animations.css',
            'css/responsive.css',
            'js/config.js',
            'js/transition.js',
            'js/love-features.js'
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = resource.endsWith('.css') ? 'style' : 'script';
            document.head.appendChild(link);
        });
    }

    // Optimize font loading
    optimizeFontLoading() {
        const fontLink = document.createElement('link');
        fontLink.rel = 'preload';
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Great+Vibes&family=Cormorant+Garamond:wght@300;400;600;700&display=swap';
        fontLink.as = 'style';
        fontLink.onload = function() {
            this.rel = 'stylesheet';
        };
        document.head.appendChild(fontLink);
    }

    // Service Worker registration for offline support
    registerServiceWorker() {
        // Service worker disabled - file not available
        // To enable, create sw.js file and uncomment below:
        /*
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
        }
        */
    }

    // Cleanup method
    cleanup() {
        if (this.intersectionObserver) {
            this.intersectionObserver.disconnect();
        }
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
        this.debounceTimers.forEach(timer => clearTimeout(timer));
        this.debounceTimers.clear();
    }
}

// Initialize performance manager
let performanceManager;

document.addEventListener('DOMContentLoaded', () => {
    performanceManager = new PerformanceManager();
    
    // Preload resources
    performanceManager.preloadResources();
    
    // Optimize font loading
    performanceManager.optimizeFontLoading();
    
    // Register service worker
    performanceManager.registerServiceWorker();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceManager;
}
