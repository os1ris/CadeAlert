// Barricade Timer - Settings Module
// Handles settings panel UI and alert filtering

import {
  alertSettings,
  loadAlertSettings,
  saveAlertSettings,
  updateAlertSetting,
  enableAllAlerts,
  disableAllAlerts
} from './state.js';

/**
 * Initialize settings panel
 */
export function initializeSettings() {
  // Load saved settings
  loadAlertSettings();

  // Set up event listeners for checkboxes
  setupCheckboxListeners();

  // Update UI to reflect loaded settings
  updateSettingsUI();

  // Make functions globally available for HTML onclick handlers
  window.toggleSettingsPanel = toggleSettingsPanel;
  window.enableAllAlerts = handleEnableAllAlerts;
  window.disableAllAlerts = handleDisableAllAlerts;
}

/**
 * Set up event listeners for all setting checkboxes
 */
function setupCheckboxListeners() {
  const settingIds = [
    'prayerAlerts',
    'triColourAttack',
    'bendKnee',
    'p7Mechanics',
    'greenFlips',
    'tumekenPhase',
    'subjugation',
    'scarabCollection'
  ];

  settingIds.forEach(id => {
    const checkbox = document.getElementById(id);
    if (checkbox) {
      checkbox.addEventListener('change', (e) => {
        updateAlertSetting(id, e.target.checked);
      });
    }
  });
}

/**
 * Update settings UI to reflect current alertSettings state
 */
function updateSettingsUI() {
  Object.keys(alertSettings).forEach(key => {
    const checkbox = document.getElementById(key);
    if (checkbox) {
      checkbox.checked = alertSettings[key];
    }
  });
}

/**
 * Toggle settings panel visibility
 */
function toggleSettingsPanel() {
  const panel = document.getElementById('settingsPanel');
  if (panel) {
    const isVisible = panel.style.display !== 'none';
    panel.style.display = isVisible ? 'none' : 'flex';

    // Update UI when opening panel
    if (!isVisible) {
      updateSettingsUI();
    }
  }
}

/**
 * Handle enable all alerts button
 */
function handleEnableAllAlerts() {
  enableAllAlerts();
  updateSettingsUI();
}

/**
 * Handle disable all alerts button
 */
function handleDisableAllAlerts() {
  disableAllAlerts();
  updateSettingsUI();
}

/**
 * Check if a specific alert type is enabled
 * @param {string} alertType - The alert type to check
 * @returns {boolean} - Whether the alert is enabled
 */
export function isAlertEnabled(alertType) {
  return alertSettings[alertType] !== false; // Default to true if not set
}
