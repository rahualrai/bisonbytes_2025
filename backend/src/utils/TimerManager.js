class TimerManager {
    constructor() {
      this.timers = new Map();
    }
    
    // Start a timer
    startTimer(id, duration, callback) {
      // Cancel any existing timer for this ID
      this.cancelTimer(id);
      
      // Create new timer
      const timerId = setTimeout(() => {
        // Run callback when timer expires
        callback();
        
        // Remove timer from map
        this.timers.delete(id);
      }, duration);
      
      // Store timer in map
      this.timers.set(id, { 
        id: timerId, 
        startTime: Date.now(), 
        endTime: Date.now() + duration,
        duration
      });
      
      return timerId;
    }
    
    // Cancel a timer
    cancelTimer(id) {
      if (this.timers.has(id)) {
        clearTimeout(this.timers.get(id).id);
        this.timers.delete(id);
        return true;
      }
      return false;
    }
    
    // Get remaining time for a timer
    getRemainingTime(id) {
      if (!this.timers.has(id)) {
        return 0;
      }
      
      const timer = this.timers.get(id);
      const remainingTime = timer.endTime - Date.now();
      return Math.max(0, remainingTime);
    }
    
    // Check if a timer exists
    hasTimer(id) {
      return this.timers.has(id);
    }
  }
  
  export default new TimerManager();