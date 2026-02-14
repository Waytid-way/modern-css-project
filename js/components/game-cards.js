/**
 * Game Cards Component
 * Interactive mini-games with modal interface
 */

class GameCards {
  constructor() {
    this.modal = document.getElementById('gameModal');
    this.modalBody = document.getElementById('modalBody');
    this.overlay = this.modal?.querySelector('.modal-overlay');
    this.closeBtn = this.modal?.querySelector('.modal-close');
    
    this.currentGame = null;
    this.gameState = {};
    
    this.init();
  }
  
  init() {
    if (!this.modal) return;
    
    // Setup event listeners
    this.setupGameButtons();
    this.setupModalControls();
  }
  
  setupGameButtons() {
    const gameButtons = document.querySelectorAll('.game-btn');
    
    gameButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = e.target.dataset.action;
        if (action) {
          this.openGame(action);
        }
      });
    });
  }
  
  setupModalControls() {
    // Close button
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.closeModal());
    }
    
    // Overlay click
    if (this.overlay) {
      this.overlay.addEventListener('click', () => this.closeModal());
    }
    
    // Keyboard escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isModalOpen()) {
        this.closeModal();
      }
    });
  }
  
  openGame(action) {
    const gameType = action.replace('open-', '');
    this.currentGame = gameType;
    
    // Load game content
    this.loadGame(gameType);
    
    // Show modal
    this.openModal();
  }
  
  loadGame(gameType) {
    const games = {
      'trivia': () => this.loadTrivia(),
      'memory': () => this.loadMemory(),
      'calculator': () => this.loadCalculator()
    };
    
    if (games[gameType]) {
      games[gameType]();
    }
  }
  
  // ========== LOVE CALCULATOR ==========
  loadCalculator() {
    this.modalBody.innerHTML = `
      <div class="calculator-game">
        <h3 id="modalTitle">Love Calculator 💕</h3>
        <p style="color: var(--color-text-secondary); margin-bottom: 1.5rem;">
          Enter your names to calculate your love compatibility!
        </p>
        <div class="calculator-inputs">
          <input type="text" class="calculator-input" id="name1" placeholder="Your name" maxlength="20">
          <input type="text" class="calculator-input" id="name2" placeholder="Partner's name" maxlength="20">
        </div>
        <button class="btn btn-primary" id="calculateBtn">Calculate Love %</button>
        <div class="calculator-result hidden" id="calculatorResult">
          <div class="calculator-percentage" id="lovePercentage">0%</div>
          <div class="calculator-message" id="loveMessage">Calculating...</div>
        </div>
      </div>
    `;
    
    // Setup calculator
    const calculateBtn = this.modalBody.querySelector('#calculateBtn');
    calculateBtn.addEventListener('click', () => this.calculateLove());
    
    // Allow Enter key
    this.modalBody.querySelectorAll('.calculator-input').forEach(input => {
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.calculateLove();
      });
    });
  }
  
  calculateLove() {
    const name1 = document.getElementById('name1').value.trim();
    const name2 = document.getElementById('name2').value.trim();
    
    if (!name1 || !name2) {
      alert('Please enter both names! 💕');
      return;
    }
    
    // Calculate love percentage based on names
    const percentage = this.generateLovePercentage(name1, name2);
    
    // Show result
    const resultDiv = document.getElementById('calculatorResult');
    const percentageEl = document.getElementById('lovePercentage');
    const messageEl = document.getElementById('loveMessage');
    
    resultDiv.classList.remove('hidden');
    
    // Animate percentage
    this.animateNumber(percentageEl, 0, percentage, 1500);
    
    // Set message
    const messages = [
      { min: 0, max: 30, text: "Maybe try again? 😅" },
      { min: 31, max: 50, text: "There's potential! 💛" },
      { min: 51, max: 70, text: "A beautiful connection! 💕" },
      { min: 71, max: 85, text: "True love indeed! 💖" },
      { min: 86, max: 100, text: "Soulmates forever! 💗✨" }
    ];
    
    const msg = messages.find(m => percentage >= m.min && percentage <= m.max);
    messageEl.textContent = msg.text;
    
    // Celebration at high percentages
    if (percentage >= 80 && window.HeartAnimations) {
      setTimeout(() => {
        window.HeartAnimations.triggerHeartBurst(
          window.innerWidth / 2,
          window.innerHeight / 2
        );
      }, 1600);
    }
  }
  
  generateLovePercentage(name1, name2) {
    // Generate consistent percentage from names
    const combined = (name1 + name2).toLowerCase();
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      hash = ((hash << 5) - hash) + combined.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash % 101);
  }
  
  animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    
    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(start + (end - start) * easeOutQuart);
      
      element.textContent = `${current}%`;
      
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };
    
    requestAnimationFrame(update);
  }
  
  // ========== LOVE TRIVIA ==========
  loadTrivia() {
    const questions = [
      {
        q: "What's my favorite color?",
        options: ["Blue", "Purple", "Red", "Pink"],
        correct: 1
      },
      {
        q: "What food do I love the most?",
        options: ["Pizza", "Sushi", "Chocolate", "Pasta"],
        correct: 2
      },
      {
        q: "What's my dream vacation destination?",
        options: ["Paris", "Maldives", "Japan", "Italy"],
        correct: 1
      },
      {
        q: "What makes me smile instantly?",
        options: ["Your smile", "Flowers", "Music", "Movies"],
        correct: 0
      },
      {
        q: "What's my favorite season?",
        options: ["Spring", "Summer", "Autumn", "Winter"],
        correct: 0
      }
    ];
    
    this.gameState.trivia = {
      questions: questions,
      current: 0,
      score: 0
    };
    
    this.renderTriviaQuestion();
  }
  
  renderTriviaQuestion() {
    const state = this.gameState.trivia;
    const question = state.questions[state.current];
    
    this.modalBody.innerHTML = `
      <div class="trivia-game">
        <h3 id="modalTitle">Love Trivia ❓</h3>
        <div class="trivia-progress" style="margin-bottom: 1rem; color: var(--color-text-muted);">
          Question ${state.current + 1} of ${state.questions.length}
        </div>
        <div class="trivia-question">${question.q}</div>
        <div class="trivia-options" id="triviaOptions"></div>
        <div class="trivia-score">Score: ${state.score}/${state.questions.length}</div>
      </div>
    `;
    
    const optionsContainer = this.modalBody.querySelector('#triviaOptions');
    
    question.options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'trivia-option';
      btn.textContent = opt;
      btn.addEventListener('click', () => this.answerTrivia(i));
      optionsContainer.appendChild(btn);
    });
  }
  
  answerTrivia(answerIndex) {
    const state = this.gameState.trivia;
    const question = state.questions[state.current];
    const isCorrect = answerIndex === question.correct;
    
    if (isCorrect) state.score++;
    
    // Show correct/wrong
    const options = this.modalBody.querySelectorAll('.trivia-option');
    options[question.correct].classList.add('correct');
    if (!isCorrect) {
      options[answerIndex].classList.add('wrong');
    }
    
    // Disable all buttons
    options.forEach(btn => btn.disabled = true);
    
    // Next question or finish
    setTimeout(() => {
      state.current++;
      if (state.current < state.questions.length) {
        this.renderTriviaQuestion();
      } else {
        this.showTriviaResult();
      }
    }, 1500);
  }
  
  showTriviaResult() {
    const state = this.gameState.trivia;
    const percentage = Math.round((state.score / state.questions.length) * 100);
    
    let message = '';
    if (percentage === 100) message = 'Perfect! You know me so well! 💕';
    else if (percentage >= 80) message = 'Great job! You know me pretty well! 💖';
    else if (percentage >= 60) message = 'Not bad! But there\'s more to learn! 💛';
    else message = 'We need to spend more time together! 💙';
    
    this.modalBody.innerHTML = `
      <div class="trivia-game">
        <h3 id="modalTitle">Trivia Complete! 🎉</h3>
        <div style="font-size: 48px; margin: 1rem 0;">${percentage >= 60 ? '🎊' : '😅'}</div>
        <div style="font-size: 32px; font-weight: bold; color: var(--color-pink); margin-bottom: 1rem;">
          ${state.score}/${state.questions.length} Correct
        </div>
        <p style="color: var(--color-text-secondary); font-size: 1.1rem;">${message}</p>
        <button class="btn btn-primary" style="margin-top: 1.5rem;" onclick="window.gameCards.closeModal()">
          Play Again
        </button>
      </div>
    `;
  }
  
  // ========== MEMORY MATCH ==========
  loadMemory() {
    const emojis = ['💕', '💖', '💗', '💝', '💘', '💓'];
    const cards = [...emojis, ...emojis]; // Duplicate for pairs
    
    // Shuffle
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    
    this.gameState.memory = {
      cards: cards,
      flipped: [],
      matched: [],
      moves: 0,
      canFlip: true
    };
    
    this.renderMemoryGrid();
  }
  
  renderMemoryGrid() {
    const state = this.gameState.memory;
    
    this.modalBody.innerHTML = `
      <div class="memory-game">
        <h3 id="modalTitle">Memory Match 🧩</h3>
        <div class="memory-moves">Moves: ${state.moves}</div>
        <div class="memory-grid" id="memoryGrid"></div>
      </div>
    `;
    
    const grid = this.modalBody.querySelector('#memoryGrid');
    
    state.cards.forEach((emoji, i) => {
      const card = document.createElement('div');
      card.className = 'memory-card';
      card.dataset.index = i;
      card.textContent = '❤️';
      card.addEventListener('click', () => this.flipCard(i));
      grid.appendChild(card);
    });
  }
  
  flipCard(index) {
    const state = this.gameState.memory;
    
    // Check if can flip
    if (!state.canFlip) return;
    if (state.flipped.includes(index)) return;
    if (state.matched.includes(index)) return;
    if (state.flipped.length >= 2) return;
    
    // Flip the card
    state.flipped.push(index);
    const card = this.modalBody.querySelector(`[data-index="${index}"]`);
    card.classList.add('flipped');
    card.textContent = state.cards[index];
    
    // Check for match
    if (state.flipped.length === 2) {
      state.moves++;
      this.modalBody.querySelector('.memory-moves').textContent = `Moves: ${state.moves}`;
      
      const [first, second] = state.flipped;
      
      if (state.cards[first] === state.cards[second]) {
        // Match!
        state.matched.push(first, second);
        
        setTimeout(() => {
          const card1 = this.modalBody.querySelector(`[data-index="${first}"]`);
          const card2 = this.modalBody.querySelector(`[data-index="${second}"]`);
          card1.classList.add('matched');
          card2.classList.add('matched');
          
          state.flipped = [];
          
          // Check win
          if (state.matched.length === state.cards.length) {
            setTimeout(() => this.showMemoryResult(), 500);
          }
        }, 500);
      } else {
        // No match
        state.canFlip = false;
        setTimeout(() => {
          const card1 = this.modalBody.querySelector(`[data-index="${first}"]`);
          const card2 = this.modalBody.querySelector(`[data-index="${second}"]`);
          card1.classList.remove('flipped');
          card2.classList.remove('flipped');
          card1.textContent = '❤️';
          card2.textContent = '❤️';
          
          state.flipped = [];
          state.canFlip = true;
        }, 1000);
      }
    }
  }
  
  showMemoryResult() {
    const state = this.gameState.memory;
    const moves = state.moves;
    
    let message = '';
    if (moves <= 8) message = 'Amazing! Perfect memory! 🏆';
    else if (moves <= 12) message = 'Great job! Sharp memory! 🌟';
    else if (moves <= 16) message = 'Good work! Well done! 💪';
    else message = 'You finished! Practice makes perfect! 💕';
    
    this.modalBody.innerHTML = `
      <div class="memory-game">
        <h3 id="modalTitle">You Won! 🎉</h3>
        <div style="font-size: 48px; margin: 1rem 0;">🏆</div>
        <div style="font-size: 24px; color: var(--color-pink); margin-bottom: 1rem;">
          Completed in ${moves} moves
        </div>
        <p style="color: var(--color-text-secondary);">${message}</p>
        <button class="btn btn-primary" style="margin-top: 1.5rem;" onclick="window.gameCards.loadMemory()">
          Play Again
        </button>
      </div>
    `;
  }
  
  // ========== MODAL CONTROLS ==========
  openModal() {
    this.modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Prevent background scroll
    
    // Focus trap for accessibility
    this.closeBtn?.focus();
  }
  
  closeModal() {
    this.modal.classList.add('hidden');
    document.body.style.overflow = '';
    this.currentGame = null;
  }
  
  isModalOpen() {
    return !this.modal.classList.contains('hidden');
  }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('gamesSection')) {
    window.gameCards = new GameCards();
  }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GameCards;
}
