// Configuration file for Love Website Generator
// Customize all settings here

const CONFIG = {
    // Fake Page Settings
    fake: {
        title: "Interactive Web Design Project",
        description: "A study of modern CSS animations and JavaScript interactions",
        author: "Your Name",
        secretTrigger: "click", // options: "password", "click", "konami"
        triggerPassword: "iloveyou", // used if secretTrigger is "password"
        triggerElement: "#secretTrigger", // element to click for trigger
        clickCount: 3, // number of clicks needed if using "click" trigger
        konamiCode: ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"] // Konami code sequence
    },
    
    // Real Love Page Settings
    love: {
        partnerName: "Baby",
        yourName: "Your Name",
        anniversaryDate: "2024-02-14",
        specialDate: "2026-02-14",
        
        messages: {
            subtitle: "you light up my world ✨",
            loveNote: "Every moment with you is magical...",
            welcomeMessage: "Welcome to our special place",
            transitionMessage: "Preparing something beautiful for you...",
            reasonsIntro: "Reasons why I love you:",
            goodbyeMessage: "Forever yours 💕"
        },
        
        memories: [
            {
                title: "First Date",
                description: "The day everything changed",
                image: "assets/images/memory1.jpg",
                date: "2024-01-15"
            },
            {
                title: "First Kiss",
                description: "Magical moment under the stars",
                image: "assets/images/memory2.jpg", 
                date: "2024-02-14"
            },
            {
                title: "Our Adventure",
                description: "Exploring the world together",
                image: "assets/images/memory3.jpg",
                date: "2024-06-20"
            },
            {
                title: "Perfect Day",
                description: "Simply being with you",
                image: "assets/images/memory4.jpg",
                date: "2024-12-25"
            }
        ],
        
        reasons: [
            "Your beautiful smile brightens my darkest days",
            "You understand me like no one else does",
            "Your kindness inspires me to be better",
            "You make ordinary moments extraordinary",
            "Your laugh is my favorite sound",
            "You support all my dreams and goals",
            "You love me for who I truly am",
            "Every day with you is a gift",
            "You're my best friend and soulmate",
            "You make the world a better place"
        ],
        
        quotes: [
            "You are my today and all of my tomorrows.",
            "In all the world, there is no heart for me like yours.",
            "You are my sun, my moon, and all of my stars.",
            "I love you not only for what you are, but for what I am when I am with you.",
            "You have stolen my heart, and I'm not taking it back."
        ],
        
        features: {
            backgroundMusic: true,
            musicAutoplay: false,
            musicFile: "assets/music/love-song.mp3",
            showCountdown: true,
            showPhotos: true,
            showMemories: true,
            showReasons: true,
            showQuotes: true,
            showKissCounter: true,
            showLoveMeter: true,
            floatingHearts: true,
            sparkleEffects: true
        },
        
        animations: {
            transitionDuration: 2000, // ms
            heartBurstCount: 20,
            floatingHeartInterval: 3000, // ms
            sparkleInterval: 500, // ms
            quoteRotationInterval: 8000 // ms
        }
    },
    
    // Performance Settings
    performance: {
        lazyLoadImages: true,
        debounceDelay: 250, // ms for scroll/resize events
        maxConcurrentAnimations: 10,
        enableWillChange: true,
        optimizeForMobile: true
    },
    
    // Responsive Breakpoints
    breakpoints: {
        mobile: 320,
        tablet: 768,
        desktop: 1024,
        large: 1440
    },
    
    // Accessibility Settings
    accessibility: {
        enableKeyboardNavigation: true,
        enableScreenReader: true,
        highContrastMode: false,
        reducedMotion: false
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
