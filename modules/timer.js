// Barricade Timer - Timer Module
// Contains all timer-related functionality

import { TIMER_DURATIONS, ALERT_MESSAGES } from './constants.js';
import {
  timerActive,
  countdownInterval,
  timerEndTime,
  timerStartTime,
  currentState,
  isHardMode,
  setTimerActive,
  setCurrentState,
  setTimerStartTime,
  setTimerEndTime,
  setCountdownInterval
} from './state.js';
import { updateTimerDisplay, updateStatus } from './helpers.js';

/**
 * Start the barricade timer with specified duration
 * @param {number} duration - Timer duration in milliseconds
 */
export function startBarricadeTimer(duration = TIMER_DURATIONS.SPECIAL_PHASE) {
  if (timerActive) return;

  setTimerActive(true);
  setCurrentState('counting');
  setTimerStartTime(Date.now()); // Record when timer started
  setTimerEndTime(timerStartTime + duration);

  const initialCount = Math.ceil(duration / 1000);
  updateTimerDisplay(initialCount, 'countdown-green');
  updateStatus(ALERT_MESSAGES.BARRICADE_INCOMING);

  // Start countdown interval
  setCountdownInterval(setInterval(function () {
    updateCountdown();
  }, 100));
}

/**
 * Update the countdown display
 */
export function updateCountdown() {
  if (!timerActive) return;

  let remaining = Math.ceil((timerEndTime - Date.now()) / 1000);

  if (remaining <= 6) {
    // Timer reached 6 seconds - show barricade alert and keep it visible
    showBarricadeAlert();
  } else {
    // Update countdown display with appropriate color
    let colorClass = getCountdownColor(remaining);
    updateTimerDisplay(remaining, colorClass);
  }
}

/**
 * Get appropriate color class for countdown
 * @param {number} seconds - Remaining seconds
 * @returns {string} CSS class name
 */
export function getCountdownColor(seconds) {
  if (seconds > 10) return 'countdown-green';
  if (seconds > 5) return 'countdown-yellow';
  return 'countdown-red';
}

/**
 * Show barricade ability alert
 */
export function showBarricadeAlert() {
  clearInterval(countdownInterval);
  setTimerActive(false);
  setCurrentState('alert');

  // updateStatus(ALERT_MESSAGES.ABILITY_READY);

  // Start live countdown for barricade alert
  setCountdownInterval(setInterval(function () {
    let remaining = Math.ceil((timerEndTime - Date.now()) / 1000);
    if (remaining < 0) remaining = 0;

    updateTimerDisplay("USE BARRICADE!<br>(" + remaining + "s left)", 'alert-active');

    // Stop countdown when time runs out
    if (remaining <= 0) {
      clearInterval(countdownInterval);
      // Keep the alert visible for a bit longer
      setTimeout(function () {
        resetTimer();
      }, TIMER_DURATIONS.RESET_DELAY);
    }
  }, 100));
}

/**
 * Cancel the timer when boss says "Enough" (only within 10 seconds of trigger)
 */
export function cancelTimer() {
  if (!timerActive) return;

  // Check if "Enough" was said within 10 seconds of timer start
  let timeSinceStart = Date.now() - timerStartTime;
  if (timeSinceStart > TIMER_DURATIONS.CANCEL_WINDOW) {
    console.log("Ignoring 'Enough' - said after 10-second window");
    return; // Don't cancel if outside the 10-second window
  }

  clearInterval(countdownInterval);
  setTimerActive(false);
  setCurrentState('canceled');

  updateTimerDisplay(ALERT_MESSAGES.SCARABS_SKIPPED, 'canceled');
  updateStatus(ALERT_MESSAGES.TIMER_CANCELED);

  // Auto-reset after 3 seconds
  setTimeout(function () {
    resetTimer();
  }, TIMER_DURATIONS.CANCEL_RESET_DELAY);
}

/**
 * Reset timer to ready state
 */
export function resetTimer() {
  setTimerActive(false);
  setCurrentState('ready');
  clearInterval(countdownInterval);

  updateTimerDisplay("", 'ready');
  updateStatus(ALERT_MESSAGES.MONITORING_CHAT);
}
