// Transition System - Handles fake page to love page transitions

class TransitionManager {
    constructor() {
        this.config = CONFIG;
        this.isTransitioning = false;
        this.clickCount = 0;
        this.konamiIndex = 0;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupMobileMenu();
    }

    setupEventListeners() {
        const triggerType = this.config.fake.secretTrigger;
        
        switch (triggerType) {
            case 'click':
                this.setupClickTrigger();
                break;
            case 'password':
                this.setupPasswordTrigger();
                break;
            case 'konami':
                this.setupKonamiTrigger();
                break;
            default:
                console.warn('Unknown trigger type:', triggerType);
        }

        // Contact form trigger (secret)
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactFormSubmit();
            });
        }
    }

    setupClickTrigger() {
        const triggerElement = document.querySelector(this.config.fake.triggerElement);
        if (!triggerElement) {
            console.error('Trigger element not found:', this.config.fake.triggerElement);
            return;
        }

        triggerElement.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleClickTrigger();
        });

        // Add visual feedback
        triggerElement.style.cursor = 'pointer';
        triggerElement.title = `Click ${this.config.fake.clickCount} times to reveal surprise`;
    }

    handleClickTrigger() {
        this.clickCount++;
        const requiredClicks = this.config.fake.clickCount;
        
        // Visual feedback
        const triggerElement = document.querySelector(this.config.fake.triggerElement);
        if (triggerElement) {
            triggerElement.style.transform = 'scale(0.95)';
            setTimeout(() => {
                triggerElement.style.transform = 'scale(1)';
            }, 100);
        }

        if (this.clickCount >= requiredClicks) {
            this.startTransition();
            this.clickCount = 0; // Reset counter
        } else {
            this.showClickFeedback(requiredClicks - this.clickCount);
        }
    }

    showClickFeedback(remainingClicks) {
        // Create temporary feedback element
        const feedback = document.createElement('div');
        feedback.className = 'click-feedback';
        feedback.textContent = `${remainingClicks} more clicks...`;
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            z-index: 10000;
            font-size: 1.1rem;
            animation: fadeIn 0.3s ease-in-out;
        `;
        
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            feedback.style.animation = 'fadeOut 0.3s ease-in-out';
            setTimeout(() => {
                document.body.removeChild(feedback);
            }, 300);
        }, 1000);
    }

    setupPasswordTrigger() {
        // Create password input (hidden by default)
        const passwordInput = document.createElement('input');
        passwordInput.type = 'password';
        passwordInput.placeholder = 'Enter password...';
        passwordInput.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 0.5rem 1rem;
            border: 1px solid #ccc;
            border-radius: 4px;
            z-index: 1000;
            display: none;
        `;
        
        document.body.appendChild(passwordInput);

        // Add password toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = '🔐';
        toggleBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border: none;
            border-radius: 50%;
            background: #2563eb;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            z-index: 1000;
        `;
        
        document.body.appendChild(toggleBtn);

        toggleBtn.addEventListener('click', () => {
            passwordInput.style.display = passwordInput.style.display === 'none' ? 'block' : 'none';
            if (passwordInput.style.display === 'block') {
                passwordInput.focus();
            }
        });

        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                if (e.target.value === this.config.fake.triggerPassword) {
                    this.startTransition();
                } else {
                    this.showError('Incorrect password');
                    e.target.value = '';
                }
            }
        });
    }

    setupKonamiTrigger() {
        let konamiCode = [];
        
        document.addEventListener('keydown', (e) => {
            konamiCode.push(e.key);
            
            // Keep only the last 10 keys
            if (konamiCode.length > 10) {
                konamiCode.shift();
            }
            
            // Check if the sequence matches
            const sequence = konamiCode.join(',');
            const targetSequence = this.config.fake.konamiCode.join(',');
            
            if (sequence === targetSequence) {
                this.startTransition();
                konamiCode = []; // Reset
            }
        });
    }

    setupMobileMenu() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
            });

            // Close menu when clicking on links
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    navToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });
        }
    }

    handleContactFormSubmit() {
        const formData = new FormData(document.getElementById('contactForm'));
        const message = formData.get('message');
        
        // Check if message contains secret code
        if (message && message.toLowerCase().includes('love')) {
            this.startTransition();
        } else {
            this.showThankYouMessage();
        }
    }

    showThankYouMessage() {
        const form = document.getElementById('contactForm');
        const originalContent = form.innerHTML;
        
        form.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <h3>Thank you for your message!</h3>
                <p>We'll get back to you soon.</p>
                <button type="button" class="btn btn-primary" onclick="location.reload()">Send Another</button>
            </div>
        `;
    }

    showError(message) {
        const error = document.createElement('div');
        error.className = 'error-message';
        error.textContent = message;
        error.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ef4444;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
        `;
        
        document.body.appendChild(error);
        
        setTimeout(() => {
            error.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                document.body.removeChild(error);
            }, 300);
        }, 3000);
    }

    async startTransition() {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        
        try {
            // Show transition overlay
            await this.showTransitionOverlay();
            
            // Create heart burst effect
            this.createHeartBurst();
            
            // Change background gradient
            await this.animateBackgroundTransition();
            
            // Load love content
            await this.loadLoveContent();
            
            // Hide fake page, show love page
            await this.switchPages();
            
            // Initialize love features
            this.initializeLoveFeatures();
            
            // Hide transition overlay
            await this.hideTransitionOverlay();
            
        } catch (error) {
            console.error('Transition error:', error);
            this.showError('Something went wrong during transition');
        } finally {
            this.isTransitioning = false;
        }
    }

    async showTransitionOverlay() {
        const overlay = document.getElementById('transitionOverlay');
        overlay.classList.remove('hidden');
        overlay.style.animation = 'fadeIn 0.5s ease-in-out';
        
        return new Promise(resolve => setTimeout(resolve, 500));
    }

    createHeartBurst() {
        const overlay = document.getElementById('transitionOverlay');
        const heartsCount = this.config.love.animations.heartBurstCount;
        
        for (let i = 0; i < heartsCount; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.className = 'heart-burst';
                heart.textContent = '❤️';
                heart.style.left = '50%';
                heart.style.top = '50%';
                heart.style.animationDelay = `${Math.random() * 0.5}s`;
                
                overlay.appendChild(heart);
                
                setTimeout(() => {
                    if (overlay.contains(heart)) {
                        overlay.removeChild(heart);
                    }
                }, 1000);
            }, i * 50);
        }
    }

    async animateBackgroundTransition() {
        const overlay = document.getElementById('transitionOverlay');
        const duration = this.config.love.animations.transitionDuration;
        
        // Animate background from dark to romantic gradient
        overlay.style.background = `linear-gradient(45deg, #ff6b9d, #feca57, #48dbfb, #ff9ff3)`;
        overlay.style.backgroundSize = '400% 400%';
        overlay.style.animation = `gradientShift ${duration}ms ease-in-out`;
        
        return new Promise(resolve => setTimeout(resolve, duration));
    }

    async loadLoveContent() {
        // This would load dynamic content if needed
        // For now, we'll just prepare the love page
        const lovePage = document.getElementById('lovePage');
        lovePage.classList.remove('hidden');
        
        return new Promise(resolve => setTimeout(resolve, 500));
    }

    async switchPages() {
        const fakePage = document.getElementById('fakePage');
        const lovePage = document.getElementById('lovePage');
        
        // Fade out fake page
        fakePage.style.animation = 'fadeOut 0.5s ease-in-out';
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Hide fake page, show love page
        fakePage.classList.add('hidden');
        lovePage.classList.remove('hidden');
        
        // Fade in love page
        lovePage.style.animation = 'fadeIn 0.5s ease-in-out';
        
        return new Promise(resolve => setTimeout(resolve, 500));
    }

    initializeLoveFeatures() {
        // Initialize love features if the module is available
        if (typeof loveFeatures !== 'undefined') {
            loveFeatures.init();
        }
        
        // Start floating hearts
        if (this.config.love.features.floatingHearts) {
            this.startFloatingHearts();
        }
        
        // Start sparkles
        if (this.config.love.features.sparkleEffects) {
            this.startSparkles();
        }
    }

    async hideTransitionOverlay() {
        const overlay = document.getElementById('transitionOverlay');
        overlay.style.animation = 'fadeOut 0.5s ease-in-out';
        
        return new Promise(resolve => setTimeout(resolve, 500));
    }

    startFloatingHearts() {
        const interval = this.config.love.animations.floatingHeartInterval;
        
        setInterval(() => {
            if (document.getElementById('lovePage').classList.contains('hidden')) {
                return;
            }
            
            const heart = document.createElement('div');
            heart.className = 'floating-heart';
            heart.textContent = '❤️';
            heart.style.left = Math.random() * window.innerWidth + 'px';
            heart.style.animationDuration = (Math.random() * 3 + 5) + 's';
            heart.style.fontSize = (Math.random() * 20 + 15) + 'px';
            
            document.body.appendChild(heart);
            
            // Remove heart after animation
            setTimeout(() => {
                if (document.body.contains(heart)) {
                    document.body.removeChild(heart);
                }
            }, 8000);
        }, interval);
    }

    startSparkles() {
        const interval = this.config.love.animations.sparkleInterval;
        
        setInterval(() => {
            if (document.getElementById('lovePage').classList.contains('hidden')) {
                return;
            }
            
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.left = Math.random() * window.innerWidth + 'px';
            sparkle.style.top = Math.random() * window.innerHeight + 'px';
            sparkle.style.animationDelay = Math.random() * 2 + 's';
            
            document.body.appendChild(sparkle);
            
            // Remove sparkle after animation
            setTimeout(() => {
                if (document.body.contains(sparkle)) {
                    document.body.removeChild(sparkle);
                }
            }, 2000);
        }, interval);
    }
}

// Initialize transition manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.transitionManager = new TransitionManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TransitionManager;
}
