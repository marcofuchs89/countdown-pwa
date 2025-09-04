/**
 * Calculate detailed time remaining until target date
 * @param {Date} targetDate - The target date
 * @param {Date} currentDate - The current date (optional, defaults to now)
 * @returns {Object} Object containing days, hours, minutes, seconds, totalMs, and isExpired
 */
export function calculateDetailedTime(targetDate, currentDate = new Date()) {
  const target = new Date(targetDate);
  const current = new Date(currentDate);
  
  // Calculate the difference in milliseconds
  const totalMs = target.getTime() - current.getTime();
  const isExpired = totalMs < 0;
  
  // Work with absolute value for calculations
  const absTotalMs = Math.abs(totalMs);
  
  // Calculate time units
  const days = Math.floor(absTotalMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((absTotalMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((absTotalMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((absTotalMs % (1000 * 60)) / 1000);
  
  return {
    days,
    hours,
    minutes,
    seconds,
    totalMs,
    isExpired
  };
}

/**
 * Format detailed time into a readable string
 * @param {Object} timeData - Object from calculateDetailedTime
 * @param {Object} options - Formatting options
 * @returns {string} Formatted time string
 */
export function formatDetailedTime(timeData, options = {}) {
  const { 
    showDays = true, 
    showHours = true, 
    showMinutes = true, 
    showSeconds = true,
    separator = ' ',
    compact = false
  } = options;
  
  const { days, hours, minutes, seconds, isExpired } = timeData;
  const parts = [];
  
  if (showDays && days > 0) {
    parts.push(compact ? `${days}T` : `${days} Tag${days !== 1 ? 'e' : ''}`);
  }
  
  if (showHours && (hours > 0 || parts.length > 0)) {
    parts.push(compact ? `${hours}h` : `${hours} Stunde${hours !== 1 ? 'n' : ''}`);
  }
  
  if (showMinutes && (minutes > 0 || parts.length > 0)) {
    parts.push(compact ? `${minutes}m` : `${minutes} Minute${minutes !== 1 ? 'n' : ''}`);
  }
  
  if (showSeconds && (seconds > 0 || parts.length === 0)) {
    parts.push(compact ? `${seconds}s` : `${seconds} Sekunde${seconds !== 1 ? 'n' : ''}`);
  }
  
  const result = parts.join(separator);
  return isExpired ? `${result} überfällig` : result;
}

/**
 * Get a compact time format for limited space displays
 * @param {Object} timeData - Object from calculateDetailedTime
 * @returns {string} Compact formatted time string
 */
export function getCompactTime(timeData) {
  const { days, hours, minutes, seconds } = timeData;
  
  if (days > 0) {
    return `${days}T ${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
}
