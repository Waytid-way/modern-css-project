// Love Website Features - Interactive romantic elements

class LoveFeatures {
    constructor() {
        this.config = CONFIG;
        this.kissCount = 0;
        this.currentQuoteIndex = 0;
        this.currentSlideIndex = 0;
        this.countdownInterval = null;
        this.quoteInterval = null;
        this.audioElement = null;
        this.init();
    }

    init() {
        this.createLoveContent();
        this.initializeEventListeners();
        this.startAnimations();
        this.initializeMusic();
    }

    createLoveContent() {
        const loveFeatures = document.getElementById('loveFeatures');
        if (!loveFeatures) return;

        let content = '';

        // Kiss Counter
        if (this.config.love.features.showKissCounter) {
            content += this.createKissCounter();
        }

        // Love Meter
        if (this.config.love.features.showLoveMeter) {
            content += this.createLoveMeter();
        }

        // Memory Gallery
        if (this.config.love.features.showMemories) {
            content += this.createMemoryGallery();
        }

        // Love Notes
        content += this.createLoveNotes();

        // Reasons List
        if (this.config.love.features.showReasons) {
            content += this.createReasonsList();
        }

        // Countdown Timer
        if (this.config.love.features.showCountdown) {
            content += this.createCountdownTimer();
        }

        // Photo Carousel
        if (this.config.love.features.showPhotos) {
            content += this.createPhotoCarousel();
        }

        // Love Quotes
        if (this.config.love.features.showQuotes) {
            content += this.createLoveQuotes();
        }

        loveFeatures.innerHTML = content;
    }

    createKissCounter() {
        return `
            <div class="love-section">
                <h2 class="love-section-title">Kiss Counter 💋</h2>
                <div class="kiss-counter">
                    <div class="kiss-display" id="kissDisplay">0 Kisses</div>
                    <button class="kiss-button" id="kissButton">Give Me a Kiss!</button>
                    <div class="kiss-milestone" id="kissMilestone"></div>
                </div>
            </div>
        `;
    }

    createLoveMeter() {
        return `
            <div class="love-section">
                <h2 class="love-section-title">Love Meter 💕</h2>
                <div class="love-meter">
                    <div class="love-meter-container">
                        <div class="love-meter-fill" id="loveMeterFill" style="width: 0%"></div>
                    </div>
                    <div class="love-meter-text" id="loveMeterText">Loading love...</div>
                </div>
            </div>
        `;
    }

    createMemoryGallery() {
        const memories = this.config.love.memories.map((memory, index) => `
            <div class="memory-card" data-index="${index}">
                <div class="memory-image">📷</div>
                <div class="memory-content">
                    <h3 class="memory-title">${memory.title}</h3>
                    <p class="memory-description">${memory.description}</p>
                    <p class="memory-date">${memory.date}</p>
                </div>
            </div>
        `).join('');

        return `
            <div class="love-section">
                <h2 class="love-section-title">Our Memories 📸</h2>
                <div class="memory-gallery">
                    <div class="memories-grid">
                        ${memories}
                    </div>
                </div>
            </div>
        `;
    }

    createLoveNotes() {
        const notes = [
            "You make every day special",
            "I love your smile",
            "You're my everything",
            "Forever grateful for you",
            "My heart belongs to you"
        ];

        const noteElements = notes.map((note, index) => `
            <div class="love-note" data-index="${index}">
                <p class="note-text">${note}</p>
            </div>
        `).join('');

        return `
            <div class="love-section">
                <h2 class="love-section-title">Love Notes 💌</h2>
                <div class="love-notes">
                    <div class="notes-container">
                        ${noteElements}
                    </div>
                </div>
            </div>
        `;
    }

    createReasonsList() {
        const reasons = this.config.love.reasons.map((reason, index) => `
            <div class="reason-item" data-index="${index}">
                <div class="reason-header">
                    <span class="reason-number">${index + 1}</span>
                    <span class="reason-text">${reason}</span>
                    <span class="reason-toggle">▼</span>
                </div>
                <div class="reason-detail">
                    This is just one of the many reasons why you mean the world to me. Every moment with you is precious and I cherish all the little things that make you so special.
                </div>
            </div>
        `).join('');

        return `
            <div class="love-section">
                <h2 class="love-section-title">Why I Love You 💖</h2>
                <div class="reasons-list">
                    <div class="reasons-container">
                        ${reasons}
                    </div>
                </div>
            </div>
        `;
    }

    createCountdownTimer() {
        return `
            <div class="love-section">
                <h2 class="love-section-title">Countdown to Our Special Day ⏰</h2>
                <div class="countdown-timer">
                    <div class="countdown-display" id="countdownDisplay">
                        <div class="countdown-item">
                            <span class="countdown-number" id="days">00</span>
                            <span class="countdown-label">Days</span>
                        </div>
                        <div class="countdown-item">
                            <span class="countdown-number" id="hours">00</span>
                            <span class="countdown-label">Hours</span>
                        </div>
                        <div class="countdown-item">
                            <span class="countdown-number" id="minutes">00</span>
                            <span class="countdown-label">Minutes</span>
                        </div>
                        <div class="countdown-item">
                            <span class="countdown-number" id="seconds">00</span>
                            <span class="countdown-label">Seconds</span>
                        </div>
                    </div>
                    <div class="countdown-message" id="countdownMessage">Until our next special moment...</div>
                </div>
            </div>
        `;
    }

    createPhotoCarousel() {
        const slides = [
            "Our First Adventure",
            "Beautiful Moments",
            "Together Forever",
            "Love in Bloom"
        ];

        const slideElements = slides.map((slide, index) => `
            <div class="carousel-slide ${index === 0 ? 'active' : ''}" data-index="${index}">
                ${slide}
            </div>
        `).join('');

        const indicators = slides.map((_, index) => `
            <span class="indicator ${index === 0 ? 'active' : ''}" data-index="${index}"></span>
        `).join('');

        return `
            <div class="love-section">
                <h2 class="love-section-title">Our Photo Gallery 🖼️</h2>
                <div class="photo-carousel">
                    <div class="carousel-container">
                        ${slideElements}
                        <div class="carousel-controls">
                            <button class="carousel-btn" id="prevBtn">❮</button>
                            <button class="carousel-btn" id="nextBtn">❯</button>
                        </div>
                        <div class="carousel-indicators">
                            ${indicators}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    createLoveQuotes() {
        return `
            <div class="love-section">
                <h2 class="love-section-title">Love Quotes 💝</h2>
                <div class="love-quotes">
                    <div class="quote-container">
                        <p class="quote-text" id="quoteText">Loading quote...</p>
                    </div>
                </div>
            </div>
        `;
    }

    initializeEventListeners() {
        // Kiss Counter
        const kissButton = document.getElementById('kissButton');
        if (kissButton) {
            kissButton.addEventListener('click', () => this.handleKiss());
        }

        // Memory Cards
        const memoryCards = document.querySelectorAll('.memory-card');
        memoryCards.forEach(card => {
            card.addEventListener('click', () => this.handleMemoryClick(card));
        });

        // Love Notes
        const loveNotes = document.querySelectorAll('.love-note');
        loveNotes.forEach(note => {
            note.addEventListener('click', () => this.handleNoteClick(note));
        });

        // Reasons List
        const reasonHeaders = document.querySelectorAll('.reason-header');
        reasonHeaders.forEach(header => {
            header.addEventListener('click', () => this.handleReasonToggle(header));
        });

        // Carousel Controls
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        if (prevBtn) prevBtn.addEventListener('click', () => this.previousSlide());
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextSlide());

        // Carousel Indicators
        const indicators = document.querySelectorAll('.indicator');
        indicators.forEach(indicator => {
            indicator.addEventListener('click', () => this.goToSlide(parseInt(indicator.dataset.index)));
        });
    }

    handleKiss() {
        this.kissCount++;
        const kissDisplay = document.getElementById('kissDisplay');
        const kissMilestone = document.getElementById('kissMilestone');
        
        if (kissDisplay) {
            kissDisplay.textContent = `${this.kissCount} Kiss${this.kissCount === 1 ? '' : 'es'}`;
            kissDisplay.style.animation = 'pulse 0.5s ease';
            setTimeout(() => {
                kissDisplay.style.animation = '';
            }, 500);
        }

        // Check milestones
        if (kissMilestone) {
            let message = '';
            if (this.kissCount === 1) {
                message = 'First kiss! 💕';
            } else if (this.kissCount === 10) {
                message = '10 kisses! You\'re amazing! 💖';
            } else if (this.kissCount === 50) {
                message = '50 kisses! I love you so much! 💝';
            } else if (this.kissCount === 100) {
                message = '100 kisses! You\'re my everything! 💗';
            } else if (this.kissCount % 25 === 0) {
                message = `${this.kissCount} kisses! Amazing! 💕`;
            }
            
            if (message) {
                kissMilestone.textContent = message;
                kissMilestone.style.animation = 'fadeIn 1s ease';
                setTimeout(() => {
                    kissMilestone.style.animation = '';
                }, 1000);
            }
        }

        // Create floating heart
        this.createFloatingHeart();
    }

    handleMemoryClick(card) {
        const index = card.dataset.index;
        const memory = this.config.love.memories[index];
        
        if (memory) {
            card.style.animation = 'cardFlip 0.6s ease';
            setTimeout(() => {
                card.style.animation = '';
            }, 600);
        }
    }

    handleNoteClick(note) {
        note.style.animation = 'wiggle 0.5s ease';
        setTimeout(() => {
            note.style.animation = '';
        }, 500);
    }

    handleReasonToggle(header) {
        const reasonItem = header.parentElement;
        reasonItem.classList.toggle('expanded');
    }

    previousSlide() {
        const slides = document.querySelectorAll('.carousel-slide');
        const indicators = document.querySelectorAll('.indicator');
        
        slides[this.currentSlideIndex].classList.remove('active');
        indicators[this.currentSlideIndex].classList.remove('active');
        
        this.currentSlideIndex = (this.currentSlideIndex - 1 + slides.length) % slides.length;
        
        slides[this.currentSlideIndex].classList.add('active');
        indicators[this.currentSlideIndex].classList.add('active');
    }

    nextSlide() {
        const slides = document.querySelectorAll('.carousel-slide');
        const indicators = document.querySelectorAll('.indicator');
        
        slides[this.currentSlideIndex].classList.remove('active');
        indicators[this.currentSlideIndex].classList.remove('active');
        
        this.currentSlideIndex = (this.currentSlideIndex + 1) % slides.length;
        
        slides[this.currentSlideIndex].classList.add('active');
        indicators[this.currentSlideIndex].classList.add('active');
    }

    goToSlide(index) {
        const slides = document.querySelectorAll('.carousel-slide');
        const indicators = document.querySelectorAll('.indicator');
        
        slides[this.currentSlideIndex].classList.remove('active');
        indicators[this.currentSlideIndex].classList.remove('active');
        
        this.currentSlideIndex = index;
        
        slides[this.currentSlideIndex].classList.add('active');
        indicators[this.currentSlideIndex].classList.add('active');
    }

    startAnimations() {
        // Love Meter Animation
        this.animateLoveMeter();
        
        // Countdown Timer
        if (this.config.love.features.showCountdown) {
            this.startCountdown();
        }
        
        // Quote Rotation
        if (this.config.love.features.showQuotes) {
            this.startQuoteRotation();
        }
        
        // Auto-advance carousel
        setInterval(() => {
            this.nextSlide();
        }, 5000);
    }

    animateLoveMeter() {
        const loveMeterFill = document.getElementById('loveMeterFill');
        const loveMeterText = document.getElementById('loveMeterText');
        
        if (loveMeterFill && loveMeterText) {
            setTimeout(() => {
                loveMeterFill.style.width = '100%';
                loveMeterText.textContent = 'Love Level: ∞% Infinite Love!';
            }, 1000);
        }
    }

    startCountdown() {
        const updateCountdown = () => {
            const now = new Date().getTime();
            const targetDate = new Date(this.config.love.specialDate).getTime();
            const distance = targetDate - now;

            if (distance > 0) {
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                const daysEl = document.getElementById('days');
                const hoursEl = document.getElementById('hours');
                const minutesEl = document.getElementById('minutes');
                const secondsEl = document.getElementById('seconds');

                if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
                if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
                if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
                if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
            } else {
                const countdownMessage = document.getElementById('countdownMessage');
                if (countdownMessage) {
                    countdownMessage.textContent = "Every day with you is special! 💕";
                }
            }
        };

        updateCountdown();
        this.countdownInterval = setInterval(updateCountdown, 1000);
    }

    startQuoteRotation() {
        const updateQuote = () => {
            const quotes = this.config.love.quotes;
            const quoteText = document.getElementById('quoteText');
            
            if (quoteText && quotes.length > 0) {
                quoteText.style.animation = 'fadeOut 0.5s ease';
                
                setTimeout(() => {
                    quoteText.textContent = quotes[this.currentQuoteIndex];
                    quoteText.style.animation = 'fadeIn 0.5s ease';
                    
                    this.currentQuoteIndex = (this.currentQuoteIndex + 1) % quotes.length;
                }, 500);
            }
        };

        updateQuote();
        this.quoteInterval = setInterval(updateQuote, this.config.love.animations.quoteRotationInterval);
    }

    initializeMusic() {
        if (!this.config.love.features.backgroundMusic) return;

        // Create music toggle button
        const musicToggle = document.createElement('button');
        musicToggle.className = 'music-toggle';
        musicToggle.innerHTML = '🎵';
        musicToggle.title = 'Toggle Music';
        
        document.body.appendChild(musicToggle);

        // Create audio element
        this.audioElement = new Audio(this.config.love.features.musicFile);
        this.audioElement.loop = true;
        this.audioElement.volume = 0.5;

        musicToggle.addEventListener('click', () => {
            if (this.audioElement.paused) {
                this.audioElement.play();
                musicToggle.innerHTML = '🎶';
                musicToggle.classList.add('playing');
            } else {
                this.audioElement.pause();
                musicToggle.innerHTML = '🎵';
                musicToggle.classList.remove('playing');
            }
        });

        // Auto-play if enabled
        if (this.config.love.features.musicAutoplay) {
            // Note: Most browsers block autoplay, so we'll handle it gracefully
            this.audioElement.play().catch(() => {
                console.log('Autoplay blocked - user interaction required');
            });
        }
    }

    createFloatingHeart() {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = '❤️';
        heart.style.left = Math.random() * window.innerWidth + 'px';
        heart.style.animationDuration = (Math.random() * 3 + 5) + 's';
        heart.style.fontSize = (Math.random() * 20 + 15) + 'px';
        
        document.body.appendChild(heart);
        
        setTimeout(() => {
            if (document.body.contains(heart)) {
                document.body.removeChild(heart);
            }
        }, 8000);
    }

    cleanup() {
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }
        if (this.quoteInterval) {
            clearInterval(this.quoteInterval);
        }
        if (this.audioElement) {
            this.audioElement.pause();
        }
    }
}

// Initialize love features globally
let loveFeatures;

document.addEventListener('DOMContentLoaded', () => {
    // Initialize when love page becomes visible
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const lovePage = document.getElementById('lovePage');
                if (lovePage && !lovePage.classList.contains('hidden') && !loveFeatures) {
                    loveFeatures = new LoveFeatures();
                }
            }
        });
    });

    const lovePage = document.getElementById('lovePage');
    if (lovePage) {
        observer.observe(lovePage, { attributes: true });
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LoveFeatures;
}
