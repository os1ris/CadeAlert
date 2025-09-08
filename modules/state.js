// Barricade Timer - State Management Module
// Contains all state variables and state management functions

import { ALERT_MESSAGES } from './constants.js';

// State management
export let timerActive = false;
export let countdownInterval = null;
export let timerEndTime = 0;
export let timerStartTime = 0;
export let currentState = 'ready'; // 'ready', 'counting', 'alert', 'canceled'
export let isHardMode = true; // Track difficulty mode - default to hard mode

// Backwards reading settings
export let backwardsReadingEnabled = true; // Enable/disable backwards reading
export let backwardsReadingDistance = 50; // Number of lines to read backwards

// OCR Quality Validation - Timestamp tracking
export let oldLineTime = new Date();

// Scarab counter
export let scarabCount = 0;
export let scarabTimeout = null;

// Mechanic display intervals
export let greenFlipInterval = null;
export let killDogsTimeout = null;
export let subjugationTimeout = null;
export let nameCallingTimeout = null;

// Track which god last spoke for name-calling mechanic
export let lastGodSpoken = null;

// Track Green 1/Green 2 mechanic state
export let greenFlipCount = 0;
export let greenFlipActive = false;

/**
 * Reset all state variables to their initial values
 */
export function resetState() {
  timerActive = false;
  countdownInterval = null;
  timerEndTime = 0;
  timerStartTime = 0;
  currentState = 'ready';
  scarabCount = 0;
  scarabTimeout = null;
  greenFlipInterval = null;
  killDogsTimeout = null;
  subjugationTimeout = null;
  nameCallingTimeout = null;
  lastGodSpoken = null;
  greenFlipCount = 0;
  greenFlipActive = false;
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
    lastGodSpoken,
    greenFlipCount,
    greenFlipActive,
    backwardsReadingEnabled,
    backwardsReadingDistance
  };
}
