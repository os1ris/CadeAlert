// Barricade Timer - State Management Module
// Contains all state variables and state management functions

import { ALERT_MESSAGES } from './constants.js';

// State management
export let timerActive = false;
export let countdownInterval = null;
export let timerEndTime = 0;
export let timerStartTime = 0;
export let timerTotalDuration = 0; // Total duration for progress bar calculation
export let currentState = 'ready'; // 'ready', 'counting', 'alert', 'canceled'
export let isHardMode = true; // Track difficulty mode - default to hard mode

// Backwards reading settings
export let backwardsReadingEnabled = true; // Enable/disable backwards reading
export let backwardsReadingDistance = 50; // Number of lines to read backwards

// OCR Quality Validation - Timestamp tracking
export let oldLineTime = new Date();

/**
 * Update the old line time for OCR validation
 * @param {Date} newTime - The new timestamp to set
 */
export function updateOldLineTime(newTime) {
  oldLineTime = newTime;
}

/**
 * Update timer active state
 * @param {boolean} active - Whether timer is active
 */
export function setTimerActive(active) {
  timerActive = active;
}

/**
 * Update current state
 * @param {string} state - The new state
 */
export function setCurrentState(state) {
  currentState = state;
}

/**
 * Update timer start time
 * @param {number} time - The start time in milliseconds
 */
export function setTimerStartTime(time) {
  timerStartTime = time;
}

/**
 * Update timer end time
 * @param {number} time - The end time in milliseconds
 */
export function setTimerEndTime(time) {
  timerEndTime = time;
}

/**
 * Update timer total duration
 * @param {number} duration - The total duration in milliseconds
 */
export function setTimerTotalDuration(duration) {
  timerTotalDuration = duration;
}

/**
 * Update countdown interval
 * @param {number} interval - The interval ID
 */
export function setCountdownInterval(interval) {
  countdownInterval = interval;
}

/**
 * Update scarab timeout
 * @param {number} timeout - The timeout ID
 */
export function setScarabTimeout(timeout) {
  scarabTimeout = timeout;
}

/**
 * Update green flip interval
 * @param {number} interval - The interval ID
 */
export function setGreenFlipInterval(interval) {
  greenFlipInterval = interval;
}

/**
 * Update kill dogs timeout
 * @param {number} timeout - The timeout ID
 */
export function setKillDogsTimeout(timeout) {
  killDogsTimeout = timeout;
}

/**
 * Update subjugation timeout
 * @param {number} timeout - The timeout ID
 */
export function setSubjugationTimeout(timeout) {
  subjugationTimeout = timeout;
}

/**
 * Update name calling timeout
 * @param {number} timeout - The timeout ID
 */
export function setNameCallingTimeout(timeout) {
  nameCallingTimeout = timeout;
}

/**
 * Update scarab count
 * @param {number} count - The new scarab count
 */
export function setScarabCount(count) {
  scarabCount = count;
}

/**
 * Update target hit count
 * @param {number} count - The new target hit count
 */
export function setTargetHitCount(count) {
  targetHitCount = count;
}

/**
 * Update last god spoken
 * @param {string} god - The god that was spoken to
 */
export function setLastGodSpoken(god) {
  lastGodSpoken = god;
}

/**
 * Update isGreenOne state
 * @param {boolean} value - The new value for isGreenOne
 */
export function setIsGreenOne(value) {
  isGreenOne = value;
}

// Scarab counter
export let scarabCount = 0;
export let scarabTimeout = null;

// Target hit counter
export let targetHitCount = 0;

// Mechanic display intervals
export let greenFlipInterval = null;
export let killDogsTimeout = null;
export let subjugationTimeout = null;
export let nameCallingTimeout = null;

// Track which god last spoke for name-calling mechanic
export let lastGodSpoken = null;

// Track Green 1/Green 2 mechanic state
export let isGreenOne = true; // true = Green 1, false = Green 2
export let greenFlipActive = false;

// Alert Settings - Default all disabled
export let alertSettings = {
  prayerAlerts: false,      // Pray Melee, Ranged, Magic
  triColourAttack: false,   // Tri-colour attack warnings
  bendKnee: false,          // Bend the Knee attack
  p7Mechanics: false,       // P7 Statue + directional vokes
  greenFlips: false,        // Green 1/2 alerts
  tumekenPhase: false,      // Kill dogs + Amascut attacking
  subjugation: false,       // Subjugation phase
  scarabCollection: false   // Scarab progress tracking
};

/**
 * Reset all state variables to their initial values
 */
export function resetState() {
  timerActive = false;
  countdownInterval = null;
  timerEndTime = 0;
  timerStartTime = 0;
  timerTotalDuration = 0;
  currentState = 'ready';
  scarabCount = 0;
  targetHitCount = 0;
  scarabTimeout = null;
  greenFlipInterval = null;
  killDogsTimeout = null;
  subjugationTimeout = null;
  nameCallingTimeout = null;
  lastGodSpoken = null;
  isGreenOne = true;
  greenFlipActive = false;
}

/**
 * Load alert settings from localStorage
 */
export function loadAlertSettings() {
  try {
    const saved = localStorage.getItem('cadeAlert_settings');
    if (saved) {
      const parsedSettings = JSON.parse(saved);
      // Merge saved settings with defaults to handle new settings
      alertSettings = { ...alertSettings, ...parsedSettings };
    }
  } catch (error) {
    console.log('Error loading alert settings:', error);
  }
}

/**
 * Save alert settings to localStorage
 */
export function saveAlertSettings() {
  try {
    localStorage.setItem('cadeAlert_settings', JSON.stringify(alertSettings));
  } catch (error) {
    console.log('Error saving alert settings:', error);
  }
}

/**
 * Update a specific alert setting
 * @param {string} settingKey - The setting key to update
 * @param {boolean} value - The new value
 */
export function updateAlertSetting(settingKey, value) {
  if (alertSettings.hasOwnProperty(settingKey)) {
    alertSettings[settingKey] = value;
    saveAlertSettings();
  }
}

/**
 * Enable all alert settings
 */
export function enableAllAlerts() {
  Object.keys(alertSettings).forEach(key => {
    alertSettings[key] = true;
  });
  saveAlertSettings();
}

/**
 * Disable all alert settings
 */
export function disableAllAlerts() {
  Object.keys(alertSettings).forEach(key => {
    alertSettings[key] = false;
  });
  saveAlertSettings();
}

/**
 * Get current state information for debugging
 */
export function getStateInfo() {
  return {
    timerActive,
    currentState,
    isHardMode,
    scarabCount,
    targetHitCount,
    lastGodSpoken,
    isGreenOne,
    greenFlipActive,
    backwardsReadingEnabled,
    backwardsReadingDistance,
    alertSettings
  };
}
