/**
 * Music Player Component
 * Visual music player with YouTube integration
 */

class MusicPlayer {
  constructor() {
    this.isPlaying = false;
    this.currentTime = 0;
    this.duration = 263; // 4:23 in seconds (default)
    this.progressInterval = null;
    
    this.elements = {
      playBtn: document.getElementById('playBtn'),
      prevBtn: document.getElementById('prevBtn'),
      nextBtn: document.getElementById('nextBtn'),
      albumDisc: document.getElementById('albumDisc'),
      progressFill: document.getElementById('musicProgress'),
      progressTrack: document.getElementById('progressTrack'),
      currentTime: document.getElementById('currentTime'),
      totalTime: document.getElementById('totalTime'),
      musicCard: document.querySelector('.music-card'),
      playIcon: document.querySelector('.play-icon'),
      pauseIcon: document.querySelector('.pause-icon')
    };
    
    this.playlist = [
      { title: 'Perfect', artist: 'Ed Sheeran', duration: 263 },
      { title: 'All of Me', artist: 'John Legend', duration: 269 },
      { title: 'Thinking Out Loud', artist: 'Ed Sheeran', duration: 281 },
      { title: 'A Thousand Years', artist: 'Christina Perri', duration: 287 }
    ];
    
    this.currentSongIndex = 0;
    
    this.init();
  }
  
  init() {
    if (!this.elements.playBtn) return;
    
    // Event listeners
    this.elements.playBtn.addEventListener('click', () => this.togglePlay());
    this.elements.prevBtn.addEventListener('click', () => this.previousSong());
    this.elements.nextBtn.addEventListener('click', () => this.nextSong());
    
    // Progress bar click
    this.elements.progressTrack.addEventListener('click', (e) => this.seek(e));
    
    // Keyboard controls
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        this.togglePlay();
      }
    });
    
    // Initialize display
    this.updateSongInfo();
    this.updateTimeDisplay();
  }
  
  togglePlay() {
    this.isPlaying = !this.isPlaying;
    this.updatePlayState();
    
    if (this.isPlaying) {
      this.startProgress();
      
      // Try to play YouTube if available
      this.playYouTube();
    } else {
      this.stopProgress();
      this.pauseYouTube();
    }
  }
  
  updatePlayState() {
    // Toggle icons
    this.elements.playIcon.classList.toggle('hidden', this.isPlaying);
    this.elements.pauseIcon.classList.toggle('hidden', !this.isPlaying);
    
    // Animate album disc
    this.elements.albumDisc.classList.toggle('playing', this.isPlaying);
    this.elements.albumDisc.classList.toggle('paused', !this.isPlaying);
    
    // Update card state
    this.elements.musicCard.classList.toggle('playing', this.isPlaying);
    
    // Update button aria-label
    this.elements.playBtn.setAttribute('aria-label', this.isPlaying ? 'Pause' : 'Play');
  }
  
  startProgress() {
    this.progressInterval = setInterval(() => {
      this.currentTime++;
      
      if (this.currentTime >= this.duration) {
        this.nextSong();
      } else {
        this.updateProgress();
      }
    }, 1000);
  }
  
  stopProgress() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }
  
  updateProgress() {
    const percent = (this.currentTime / this.duration) * 100;
    this.elements.progressFill.style.width = `${percent}%`;
    this.updateTimeDisplay();
  }
  
  updateTimeDisplay() {
    this.elements.currentTime.textContent = this.formatTime(this.currentTime);
    this.elements.totalTime.textContent = this.formatTime(this.duration);
  }
  
  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
  
  seek(e) {
    const rect = this.elements.progressTrack.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    this.currentTime = Math.floor(percent * this.duration);
    this.updateProgress();
  }
  
  previousSong() {
    this.currentSongIndex = (this.currentSongIndex - 1 + this.playlist.length) % this.playlist.length;
    this.loadSong();
  }
  
  nextSong() {
    this.currentSongIndex = (this.currentSongIndex + 1) % this.playlist.length;
    this.loadSong();
  }
  
  loadSong() {
    this.stopProgress();
    this.currentTime = 0;
    this.updateSongInfo();
    this.updateProgress();
    
    if (this.isPlaying) {
      this.startProgress();
    }
  }
  
  updateSongInfo() {
    const song = this.playlist[this.currentSongIndex];
    this.duration = song.duration;
    
    const titleEl = document.getElementById('musicTitle');
    const artistEl = document.getElementById('musicArtist');
    
    if (titleEl) titleEl.textContent = song.title;
    if (artistEl) artistEl.textContent = song.artist;
    
    this.updateTimeDisplay();
  }
  
  playYouTube() {
    // Try to communicate with YouTube iframe if exists
    const iframe = document.getElementById('youtube-iframe');
    if (iframe && iframe.contentWindow) {
      try {
        iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
      } catch (e) {
        console.log('YouTube play failed:', e);
      }
    }
  }
  
  pauseYouTube() {
    const iframe = document.getElementById('youtube-iframe');
    if (iframe && iframe.contentWindow) {
      try {
        iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
      } catch (e) {
        console.log('YouTube pause failed:', e);
      }
    }
  }
  
  // Public methods
  play() {
    if (!this.isPlaying) {
      this.togglePlay();
    }
  }
  
  pause() {
    if (this.isPlaying) {
      this.togglePlay();
    }
  }
  
  setVolume(volume) {
    // Volume control (0-100)
    const iframe = document.getElementById('youtube-iframe');
    if (iframe && iframe.contentWindow) {
      try {
        iframe.contentWindow.postMessage(`{"event":"command","func":"setVolume","args":[${volume}]}`, '*');
      } catch (e) {
        console.log('Volume control failed:', e);
      }
    }
  }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('musicSection')) {
    window.musicPlayer = new MusicPlayer();
  }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MusicPlayer;
}
