// Barricade Timer - Debug Module
// Contains debug functions and testing utilities

import { MESSAGE_TRIGGERS, ALERT_MESSAGES } from './constants.js';
import { backwardsReadingEnabled, backwardsReadingDistance } from './state.js';
import { resetForNewInstance } from './reset.js';
import { startBarricadeTimer } from './timer.js';
import { cancelTimer } from './timer.js';
import { updateStatus, updateTimerDisplay } from './helpers.js';

/**
 * Debug function to start timer manually
 */
export function debugStartTimer() {
  startBarricadeTimer();
}

/**
 * Debug function to cancel timer manually
 */
export function debugCancelTimer() {
  cancelTimer();
}

/**
 * Debug function for manual reset
 */
export function debugReset() {
  console.log('🔄 DEBUG: Manual reset triggered');
  resetForNewInstance();
}

/**
 * Toggle backwards reading functionality
 */
export function toggleBackwardsReading() {
  backwardsReadingEnabled = !backwardsReadingEnabled;
  console.log(`🔄 BACKWARDS READING: ${backwardsReadingEnabled ? 'ENABLED' : 'DISABLED'}`);
  updateStatus(`Backwards reading ${backwardsReadingEnabled ? 'enabled' : 'disabled'}`);
  setTimeout(() => {
    updateStatus(ALERT_MESSAGES.MONITORING_CHAT);
  }, 2000);
}

/**
 * Set backwards reading distance
 * @param {number} distance - Number of lines to read backwards
 */
export function setBackwardsReadingDistance(distance) {
  backwardsReadingDistance = Math.max(1, Math.min(100, distance)); // Clamp between 1-100
  console.log(`📏 BACKWARDS READING DISTANCE: ${backwardsReadingDistance} lines`);
  updateStatus(`Backwards distance: ${backwardsReadingDistance}`);
  setTimeout(() => {
    updateStatus(ALERT_MESSAGES.MONITORING_CHAT);
  }, 2000);
}

/**
 * Get backwards reading settings
 * @returns {object} Current backwards reading settings
 */
export function getBackwardsReadingSettings() {
  console.log('🔧 BACKWARDS READING SETTINGS:');
  console.log(`  Enabled: ${backwardsReadingEnabled}`);
  console.log(`  Distance: ${backwardsReadingDistance} lines`);
  return {
    enabled: backwardsReadingEnabled,
    distance: backwardsReadingDistance
  };
}

/**
 * Test function for layout stability
 */
export function testLayoutStability() {
  console.log('🧪 TESTING LAYOUT STABILITY');

  const testMessages = [
    ALERT_MESSAGES.PRAY_MELEE,
    ALERT_MESSAGES.PRAY_RANGED,
    ALERT_MESSAGES.PRAY_MAGIC,
    ALERT_MESSAGES.TRI_COLOUR_ATTACK,
    ALERT_MESSAGES.BEND_KNEE_ATTACK,
    ALERT_MESSAGES.NAME_CALLING,
    ALERT_MESSAGES.NW_VOKES,
    ALERT_MESSAGES.NE_VOKES,
    ALERT_MESSAGES.AMASCUT_ATTACKING,
    ALERT_MESSAGES.ALL_SCARABS,
    ALERT_MESSAGES.KILL_DOGS,
    ALERT_MESSAGES.STAND_BEHIND,
    "Very long test message that should wrap properly and not break the layout",
    ALERT_MESSAGES.MONITORING_CHAT
  ];

  let index = 0;

  const testInterval = setInterval(() => {
    if (index < testMessages.length) {
      console.log(`Testing: "${testMessages[index]}"`);
      updateStatus(testMessages[index]);

      // Also test timer display variations
      if (index % 3 === 0) {
        updateTimerDisplay("15", 'countdown-green');
      } else if (index % 3 === 1) {
        updateTimerDisplay("USE BARRICADE!<br>(5s left)", 'alert-active');
      } else {
        updateTimerDisplay("Detonation in:<br>10", 'countdown-yellow');
      }

      index++;
    } else {
      clearInterval(testInterval);
      console.log('✅ Layout stability test completed');
      updateStatus(ALERT_MESSAGES.READY_MONITORING);
      updateTimerDisplay("", 'ready');
    }
  }, 1000);
}

/**
 * Debug function for testing tri-attack detection
 */
export function debugTriAttack() {
  console.log('🧪 DEBUG: Testing tri-attack detection');
  const testMessages = [
    "grovel",
    "pathetic",
    "weak",
    "amascut, the devourer: grovel",
    "amascut, the devourer: pathetic",
    "amascut, the devourer: weak",
    "tear them apart",
    "amascut, the devourer: tear them apart",
    "grovel and tear them apart"
  ];

  testMessages.forEach(msg => {
    console.log(`Testing: "${msg}"`);
    const lowerMsg = msg.toLowerCase().trim();

    if ((lowerMsg.includes(MESSAGE_TRIGGERS.GROVEL) ||
         lowerMsg.includes(MESSAGE_TRIGGERS.PATHETIC) ||
         lowerMsg.includes(MESSAGE_TRIGGERS.WEAK)) &&
        !lowerMsg.includes(MESSAGE_TRIGGERS.TEAR_THEM_APART)) {
      console.log(`✅ Would trigger tri-attack alert for: "${msg}"`);
    } else {
      console.log(`❌ Would NOT trigger tri-attack alert for: "${msg}"`);
    }
  });
}

// Make functions available globally for console debugging
window.debugStartTimer = debugStartTimer;
window.debugCancelTimer = debugCancelTimer;
window.debugReset = debugReset;
window.toggleBackwardsReading = toggleBackwardsReading;
window.setBackwardsReadingDistance = setBackwardsReadingDistance;
window.getBackwardsReadingSettings = getBackwardsReadingSettings;
window.testLayoutStability = testLayoutStability;
window.debugTriAttack = debugTriAttack;

/**
 * Debug function to test simultaneous barricade + green flip triggers
 */
export function debugSimultaneousTriggers() {
  console.log('🧪 DEBUG: Testing simultaneous barricade + green flip triggers');

  // Import required functions
  import('./timer.js').then(timer => {
    import('./mechanics.js').then(mechanics => {
      // Start barricade timer (14s)
      console.log('🎯 Starting barricade timer...');
      timer.startBarricadeTimer(14000);

      // After 500ms, trigger green flip (simulating real scenario)
      setTimeout(() => {
        console.log('🟢 Triggering green flip...');
        mechanics.startGreenFlip();
      }, 500);

      console.log('✅ Simultaneous trigger test initiated');
      console.log('   - Barricade timer should show countdown in timerBox');
      console.log('   - Green flip should show "Green 1 Active!" in statusBox');
      console.log('   - No "unknown error" should appear in console');
    });
  });
}

// Make the new debug function available globally
window.debugSimultaneousTriggers = debugSimultaneousTriggers;
