// Barricade Timer - Mechanics Module
// Contains boss mechanic-specific functions and handlers

import { TIMER_DURATIONS, ALERT_MESSAGES } from './constants.js';
import {
  scarabCount,
  targetHitCount,
  scarabTimeout,
  greenFlipInterval,
  killDogsTimeout,
  subjugationTimeout,
  nameCallingTimeout,
  lastGodSpoken,
  isGreenOne,
  greenFlipActive,
  timerActive,
  countdownInterval,
  setScarabTimeout,
  setGreenFlipInterval,
  setKillDogsTimeout,
  setSubjugationTimeout,
  setNameCallingTimeout,
  setScarabCount,
  setTargetHitCount,
  setLastGodSpoken,
  setTimerActive,
  setCountdownInterval
} from './state.js';
import { updateTimerDisplay, updateStatus, clearAllMechanicTimeouts, resetDisplays, updateStatusIfEnabled, updateTimerDisplayIfEnabled } from './helpers.js';

/**
 * Increment scarab count and handle collection logic
 */
export function incrementScarabCount() {
  setScarabCount(scarabCount + 1);
  console.log('Scarab count:', scarabCount);

  // Clear existing timeout to reset the inactivity timer
  if (scarabTimeout) {
    clearTimeout(scarabTimeout);
    setScarabTimeout(null);
  }

  if (scarabCount >= 4) {
    // All scarabs collected
    updateStatusIfEnabled(ALERT_MESSAGES.ALL_SCARABS, 'scarabCollection');
    setScarabCount(0); // Reset for next phase
    setScarabTimeout(setTimeout(() => {
      updateStatus(ALERT_MESSAGES.MONITORING_CHAT);
      setScarabTimeout(null);
    }, TIMER_DURATIONS.SCARAB_ALERT_DURATION));
  } else {
    // Show current count - force immediate update
    updateStatusIfEnabled(`${ALERT_MESSAGES.SCARABS_PREFIX}${scarabCount}/4<br>${ALERT_MESSAGES.TARGETS_PREFIX}${targetHitCount}`, 'scarabCollection');
    // Set timeout to clear display after 12 seconds of inactivity
    setScarabTimeout(setTimeout(() => {
      setScarabCount(0); // Reset counter
      setTargetHitCount(0); // Reset target hit counter
      updateStatus(ALERT_MESSAGES.MONITORING_CHAT);
      setScarabTimeout(null);
    }, TIMER_DURATIONS.SCARAB_TIMEOUT));
  }
}

/**
 * Increment target hit count and handle display logic
 */
export function incrementTargetHitCount() {
  setTargetHitCount(targetHitCount + 1);
  console.log('Target hit count:', targetHitCount);

  // Show current count - force immediate update
  updateStatusIfEnabled(`${ALERT_MESSAGES.SCARABS_PREFIX}${scarabCount}/4<br>${ALERT_MESSAGES.TARGETS_PREFIX}${targetHitCount}`, 'scarabCollection');
}

/**
 * Start the green flip mechanic display
 */
export function startGreenFlip() {
  console.log('🟢 GREEN FLIP: Starting Green 1 display');

  // Clear any existing intervals
  if (greenFlipInterval) {
    clearTimeout(greenFlipInterval);
  }

  // Show Green 1 in status area only (don't compete with timer box)
  updateStatusIfEnabled(ALERT_MESSAGES.GREEN_1, 'greenFlips');

  // Clear status after 3 seconds but preserve state for toggling
  setGreenFlipInterval(setTimeout(() => {
    updateStatus(ALERT_MESSAGES.MONITORING_CHAT);
    console.log('🟢 GREEN FLIP: Status cleared, state preserved for toggling');
  }, TIMER_DURATIONS.GREEN_FLIP_DURATION));
}

/**
 * Handle green flip toggle (Green 1 to Green 2)
 */
export function toggleGreenFlip() {
  if (!greenFlipActive) return;

  console.log('🟢 LIGHT SNUFFED: Green 2');

  // Only update timer display if no barricade timer is active
  if (!timerActive) {
    updateTimerDisplayIfEnabled("GREEN 2", 'alert-active', 'greenFlips');
  }
  updateStatusIfEnabled(ALERT_MESSAGES.GREEN_2, 'greenFlips');
}

/**
 * Show KILL DOGS NOW alert
 */
export function showKillDogsAlert() {
  console.log('🐕 KILL DOGS: Starting alert');

  // Clear all mechanic timeouts using helper function
  clearAllMechanicTimeouts();

  // Clear all displays and show KILL DOGS NOW
  updateTimerDisplayIfEnabled(ALERT_MESSAGES.KILL_DOGS, 'alert-active', 'tumekenPhase');
  updateStatusIfEnabled(ALERT_MESSAGES.KILL_DOGS, 'tumekenPhase');

  // Reset after 9 seconds
  setKillDogsTimeout(setTimeout(() => {
    resetDisplays();
    console.log('🐕 KILL DOGS: Alert ended');
  }, TIMER_DURATIONS.KILL_DOGS_DURATION));
}

/**
 * Show stand behind Amascut alert for subjugation
 */
export function showSubjugationAlert() {
  console.log('👑 SUBJUGATION: Starting stand behind alert');

  // Clear all mechanic timeouts using helper function
  clearAllMechanicTimeouts();

  // Clear all displays and show STAND BEHIND AMASCUT
  updateTimerDisplayIfEnabled("Stand Behind<br>Amascut", 'alert-active', 'subjugation');
  updateStatusIfEnabled(ALERT_MESSAGES.STAND_BEHIND, 'subjugation');

  // Reset after 8 seconds
  setSubjugationTimeout(setTimeout(() => {
    resetDisplays();
    console.log('👑 SUBJUGATION: Alert ended');
  }, TIMER_DURATIONS.SUBJUGATION_DURATION));
}

/**
 * Handle name-calling mechanic with delay
 */
export function handleNameCallingMechanic() {
  console.log('🚨 STATUE-CALLING MECHANIC START - Delaying 3.6s');

  // Clear any existing name-calling timeout
  if (nameCallingTimeout) {
    clearTimeout(nameCallingTimeout);
  }

  // Delay the alert by 3.6 seconds
  setNameCallingTimeout(setTimeout(() => {
    console.log('🚨 NAME-CALLING MECHANIC: Alert triggered');

    // Check which god was last spoken to and show appropriate message
    if (lastGodSpoken === 'crondis') {
      updateStatusIfEnabled(ALERT_MESSAGES.NAME_CALLING_CRONDIS, 'p7Mechanics');
    } else if (lastGodSpoken === 'scabaras') {
      updateStatusIfEnabled(ALERT_MESSAGES.NAME_CALLING_SCABARAS, 'p7Mechanics');
    } else {
      updateStatusIfEnabled(ALERT_MESSAGES.NAME_CALLING, 'p7Mechanics');
    }

    // Cancel any active timers during this phase
    if (timerActive) {
      clearInterval(countdownInterval);
      setTimerActive(false);
      updateTimerDisplayIfEnabled(ALERT_MESSAGES.MECHANIC_ACTIVE, 'alert-active', 'p7Mechanics');
    }

    // Clear the alert after 5 seconds
    setTimeout(() => {
      updateStatus(ALERT_MESSAGES.MONITORING_CHAT);
    }, TIMER_DURATIONS.NAME_CALLING_ALERT);
  }, TIMER_DURATIONS.NAME_CALLING_DELAY));
}

/**
 * Update last god spoken for name-calling mechanic
 * @param {string} god - The god that was spoken to ('apmeken', 'het', 'scabaras', 'crondis')
 */
export function updateLastGodSpoken(god) {
  setLastGodSpoken(god);
}
