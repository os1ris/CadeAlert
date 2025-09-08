// Barricade Timer - Mechanics Module
// Contains boss mechanic-specific functions and handlers

import { TIMER_DURATIONS, ALERT_MESSAGES } from './constants.js';
import {
  scarabCount,
  scarabTimeout,
  greenFlipInterval,
  killDogsTimeout,
  subjugationTimeout,
  nameCallingTimeout,
  lastGodSpoken,
  greenFlipCount,
  greenFlipActive,
  timerActive,
  countdownInterval,
  setScarabTimeout,
  setGreenFlipInterval,
  setKillDogsTimeout,
  setSubjugationTimeout,
  setNameCallingTimeout,
  setScarabCount,
  setLastGodSpoken,
  setTimerActive,
  setCountdownInterval
} from './state.js';
import { updateTimerDisplay, updateStatus, clearAllMechanicTimeouts, resetDisplays } from './helpers.js';

/**
 * Increment scarab count and handle collection logic
 */
export function incrementScarabCount() {
  scarabCount++;
  console.log('Scarab count:', scarabCount);

  // Clear existing timeout to reset the inactivity timer
  if (scarabTimeout) {
    clearTimeout(scarabTimeout);
    setScarabTimeout(null);
  }

  if (scarabCount >= 4) {
    // All scarabs collected
    updateStatus(ALERT_MESSAGES.ALL_SCARABS);
    setScarabCount(0); // Reset for next phase
    setScarabTimeout(setTimeout(() => {
      updateStatus(ALERT_MESSAGES.MONITORING_CHAT);
      setScarabTimeout(null);
    }, TIMER_DURATIONS.SCARAB_ALERT_DURATION));
  } else {
    // Show current count - force immediate update
    updateStatus(`${ALERT_MESSAGES.SCARABS_PREFIX}${scarabCount}/4`);
    // Set timeout to clear display after 12 seconds of inactivity
    setScarabTimeout(setTimeout(() => {
      setScarabCount(0); // Reset counter
      updateStatus(ALERT_MESSAGES.MONITORING_CHAT);
      setScarabTimeout(null);
    }, TIMER_DURATIONS.SCARAB_TIMEOUT));
  }
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

  // Show Green 1 initially
  updateTimerDisplay("GREEN 1", 'alert-active');
  updateStatus(ALERT_MESSAGES.GREEN_1);

  // Clear display after 3 seconds but preserve state for toggling
  setGreenFlipInterval(setTimeout(() => {
    updateTimerDisplay("", 'ready');
    updateStatus(ALERT_MESSAGES.MONITORING_CHAT);
    console.log('🟢 GREEN FLIP: Display cleared, state preserved for toggling');
  }, TIMER_DURATIONS.GREEN_FLIP_DURATION));
}

/**
 * Handle green flip toggle (Green 1 to Green 2)
 */
export function toggleGreenFlip() {
  if (!greenFlipActive) return;

  greenFlipCount++;
  console.log(`🟢 LIGHT SNUFFED: Green flip count ${greenFlipCount}`);

  updateTimerDisplay("GREEN 2", 'alert-active');
  updateStatus(ALERT_MESSAGES.GREEN_2);
}

/**
 * Show KILL DOGS NOW alert
 */
export function showKillDogsAlert() {
  console.log('🐕 KILL DOGS: Starting alert');

  // Clear all mechanic timeouts using helper function
  clearAllMechanicTimeouts();

  // Clear all displays and show KILL DOGS NOW
  updateTimerDisplay(ALERT_MESSAGES.KILL_DOGS, 'alert-active');
  updateStatus(ALERT_MESSAGES.KILL_DOGS);

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
  updateTimerDisplay("STAND BEHIND<br>AMASCUT", 'alert-active');
  updateStatus(ALERT_MESSAGES.STAND_BEHIND);

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
      updateStatus(ALERT_MESSAGES.NAME_CALLING_CRONDIS);
    } else if (lastGodSpoken === 'scabaras') {
      updateStatus(ALERT_MESSAGES.NAME_CALLING_SCABARAS);
    } else {
      updateStatus(ALERT_MESSAGES.NAME_CALLING);
    }

    // Cancel any active timers during this phase
    if (timerActive) {
      clearInterval(countdownInterval);
      setTimerActive(false);
      updateTimerDisplay(ALERT_MESSAGES.MECHANIC_ACTIVE, 'alert-active');
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
