// Barricade Timer - Reset Module
// Contains reset functions for new instances and state cleanup

import { ALERT_MESSAGES } from './constants.js';
import { resetState, countdownInterval, scarabTimeout, greenFlipInterval } from './state.js';
import { updateTimerDisplay, updateStatus } from './helpers.js';

/**
 * Complete reset function for new instance
 */
export function resetForNewInstance() {
  console.log('🔄 NEW INSTANCE DETECTED: Resetting all timers and alerts');

  // Clear all active timers and intervals
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
  if (scarabTimeout) {
    clearTimeout(scarabTimeout);
    scarabTimeout = null;
  }

  // Reset all state variables using the helper function
  resetState();

  // Clear displays
  updateTimerDisplay("", 'ready');
  updateStatus(ALERT_MESSAGES.READY_MONITORING);

  console.log('✅ Reset complete - App ready for new encounter');
}
