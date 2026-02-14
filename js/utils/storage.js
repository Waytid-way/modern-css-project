/**
 * StorageManager - Utility for localStorage management
 * Provides safe localStorage operations with error handling and namespacing
 */

class StorageManager {
  constructor(prefix = 'love_') {
    this.prefix = prefix;
    this.isAvailable = this.checkAvailability();
  }
  
  // Check if localStorage is available
  checkAvailability() {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      console.warn('localStorage not available:', e);
      return false;
    }
  }
  
  // Set item with error handling
  set(key, value) {
    if (!this.isAvailable) {
      console.warn('Storage not available');
      return false;
    }
    
    try {
      const data = JSON.stringify(value);
      localStorage.setItem(this.prefix + key, data);
      return true;
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        console.error('Storage quota exceeded');
        // Try to clear old data
        this.clearOldData();
      } else {
        console.error('Storage save error:', error);
      }
      return false;
    }
  }
  
  // Get item with default value
  get(key, defaultValue = null) {
    if (!this.isAvailable) {
      return defaultValue;
    }
    
    try {
      const data = localStorage.getItem(this.prefix + key);
      if (data === null) return defaultValue;
      return JSON.parse(data);
    } catch (error) {
      console.error('Storage read error:', error);
      return defaultValue;
    }
  }
  
  // Remove item
  remove(key) {
    if (!this.isAvailable) return;
    
    try {
      localStorage.removeItem(this.prefix + key);
    } catch (error) {
      console.error('Storage remove error:', error);
    }
  }
  
  // Clear all items with this prefix
  clear() {
    if (!this.isAvailable) return;
    
    try {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.prefix)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Storage clear error:', error);
    }
  }
  
  // Clear old data when quota exceeded (keep only essential data)
  clearOldData() {
    const essentialKeys = ['kissCount', 'loveMeterValue'];
    
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.prefix)) {
        const shortKey = key.replace(this.prefix, '');
        if (!essentialKeys.includes(shortKey)) {
          keysToRemove.push(key);
        }
      }
    }
    
    // Remove non-essential items
    keysToRemove.forEach(key => {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        // Ignore errors
      }
    });
    
    console.log('Cleared old data to free up space');
  }
  
  // Get all keys with this prefix
  getAllKeys() {
    if (!this.isAvailable) return [];
    
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.prefix)) {
        keys.push(key.replace(this.prefix, ''));
      }
    }
    return keys;
  }
  
  // Get storage usage info
  getUsage() {
    if (!this.isAvailable) {
      return { used: 0, total: 0, percentage: 0 };
    }
    
    let used = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.prefix)) {
        const value = localStorage.getItem(key);
        used += key.length + (value ? value.length : 0);
      }
    }
    
    // Approximate total (varies by browser, typically 5-10MB)
    const total = 5 * 1024 * 1024; // 5MB
    
    return {
      used,
      total,
      percentage: Math.round((used / total) * 100)
    };
  }
}

// Create global instance
window.StorageManager = new StorageManager();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = StorageManager;
}
