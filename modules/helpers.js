// Barricade Timer - Helpers Module
// Contains utility functions for code optimization and common operations

import { TIMER_DURATIONS, ALERT_MESSAGES } from './constants.js';
import { resetState, scarabTimeout, greenFlipInterval, killDogsTimeout, subjugationTimeout, nameCallingTimeout, timerActive, setScarabTimeout, setGreenFlipInterval, setKillDogsTimeout, setSubjugationTimeout, setNameCallingTimeout } from './state.js';
import { isAlertEnabled } from './settings.js';

/**
 * Clear all mechanic-related timeouts and intervals
 * Consolidates redundant timeout clearing logic used in multiple functions
 */
export function clearAllMechanicTimeouts() {
  console.log('🧹 Clearing all mechanic timeouts');

  if (greenFlipInterval) {
    clearTimeout(greenFlipInterval);
    setGreenFlipInterval(null);
  }
  if (killDogsTimeout) {
    clearTimeout(killDogsTimeout);
    setKillDogsTimeout(null);
  }
  if (subjugationTimeout) {
    clearTimeout(subjugationTimeout);
    setSubjugationTimeout(null);
  }
  if (scarabTimeout) {
    clearTimeout(scarabTimeout);
    setScarabTimeout(null);
  }
  if (nameCallingTimeout) {
    clearTimeout(nameCallingTimeout);
    setNameCallingTimeout(null);
  }
}

/**
 * Show a temporary alert with automatic reset to monitoring status
 * Consolidates the common pattern: updateStatus -> setTimeout -> reset
 * Checks alert settings before displaying
 */
export function showTemporaryAlert(message, duration = TIMER_DURATIONS.ALERT_DURATION) {
  // Check if this alert type is enabled
  if (!isAlertEnabledForMessage(message)) {
    return; // Skip showing this alert
  }

  updateStatus(message);

  // Also show prayer alerts in details display
  if (message === ALERT_MESSAGES.PRAY_MELEE ||
      message === ALERT_MESSAGES.PRAY_RANGED ||
      message === ALERT_MESSAGES.PRAY_MAGIC) {
    updateDetails(message);
  }

  setTimeout(() => {
    updateStatus(ALERT_MESSAGES.MONITORING_CHAT);
    // Clear details display when prayer alert expires
    if (message === ALERT_MESSAGES.PRAY_MELEE ||
        message === ALERT_MESSAGES.PRAY_RANGED ||
        message === ALERT_MESSAGES.PRAY_MAGIC) {
      clearDetails();
    }
  }, duration);
}

/**
 * Check if an alert should be shown based on its message content
 * @param {string} message - The alert message
 * @returns {boolean} - Whether to show the alert
 */
function isAlertEnabledForMessage(message) {
  // Prayer alerts
  if (message === ALERT_MESSAGES.PRAY_MELEE ||
      message === ALERT_MESSAGES.PRAY_RANGED ||
      message === ALERT_MESSAGES.PRAY_MAGIC) {
    return isAlertEnabled('prayerAlerts');
  }

  // Tri-colour attack
  if (message === ALERT_MESSAGES.TRI_COLOUR_ATTACK) {
    return isAlertEnabled('triColourAttack');
  }

  // Bend the knee
  if (message === ALERT_MESSAGES.BEND_KNEE_ATTACK) {
    return isAlertEnabled('bendKnee');
  }

  // P7 Mechanics (name calling + directional vokes)
  if (message === ALERT_MESSAGES.NAME_CALLING ||
      message === ALERT_MESSAGES.NAME_CALLING_CRONDIS ||
      message === ALERT_MESSAGES.NAME_CALLING_SCABARAS ||
      message === ALERT_MESSAGES.NW_VOKES ||
      message === ALERT_MESSAGES.SW_VOKES ||
      message === ALERT_MESSAGES.NE_VOKES ||
      message === ALERT_MESSAGES.SE_VOKES) {
    return isAlertEnabled('p7Mechanics');
  }

  // Green flips
  if (message === ALERT_MESSAGES.GREEN_1 ||
      message === ALERT_MESSAGES.GREEN_2) {
    return isAlertEnabled('greenFlips');
  }

  // Tumeken phase (kill dogs + Amascut attacking)
  if (message === ALERT_MESSAGES.KILL_DOGS ||
      message === ALERT_MESSAGES.AMASCUT_ATTACKING) {
    return isAlertEnabled('tumekenPhase');
  }

  // Subjugation
  if (message === ALERT_MESSAGES.STAND_BEHIND) {
    return isAlertEnabled('subjugation');
  }

  // Scarab collection (progress and completion)
  if (message.includes(ALERT_MESSAGES.SCARABS_PREFIX) ||
      message === ALERT_MESSAGES.ALL_SCARABS) {
    return isAlertEnabled('scarabCollection');
  }

  // Default to showing alerts that don't have specific settings
  return true;
}

/**
 * Reset both timer and status displays to ready state
 * Consolidates redundant display reset logic
 */
export function resetDisplays() {
  updateTimerDisplay("", 'ready');
  updateStatus(ALERT_MESSAGES.MONITORING_CHAT);
}

/**
 * Process OCR timestamp validation
 * Extracts common OCR validation logic used in message processing
 */
export function validateMessageTimestamp(lineTime, oldLineTime) {
  // OCR Quality Validation - Check if message is newer than previous
  if (oldLineTime <= lineTime) {
    return true; // Process this message
  } else {
    console.log("Skipping old message");
    return false; // Skip this message
  }
}

/**
 * Update timer display
 * @param {string} text - Text to display
 * @param {string} className - CSS class for styling
 */
export function updateTimerDisplay(text, className) {
  const timerBox = document.getElementById('timerBox');
  if (timerBox) {
    // Clear existing content and classes
    timerBox.innerHTML = '';
    timerBox.className = 'timer-display';

    if (!isNaN(text) && text !== "") {
      // Simple countdown number - add header
      timerBox.innerHTML = '<div>Detonation in:</div><div>' + text + '</div>';
    } else if (text && text.trim() !== "") {
      // Check if text contains HTML
      if (text.includes('<br>') || text.includes('<') || text.includes('>')) {
        timerBox.innerHTML = text;
      } else {
        // Plain text - wrap in div for better control
        timerBox.innerHTML = '<div>' + text + '</div>';
      }
    }

    // Apply the color class if provided
    if (className && className.trim() !== "") {
      timerBox.classList.add(className);
    }
  }
}

/**
 * Update status message
 * @param {string} message - Status message to display
 */
export function updateStatus(message) {
  const statusBox = document.getElementById('statusBox');
  if (statusBox) {
    // Clear any existing classes
    statusBox.className = 'status-message';

    if (message === ALERT_MESSAGES.TRI_COLOUR_ATTACK) {
      statusBox.innerHTML = '<span class="alert-critical">' + message + '</span>';
    } else if (message === ALERT_MESSAGES.BEND_KNEE_ATTACK) {
      statusBox.innerHTML = '<span class="alert-critical">' + message + '</span>';
    } else if (message === ALERT_MESSAGES.PRAY_MAGIC) {
      statusBox.innerHTML = '<span class="alert-prayer-magic">' + message + '</span>';
    } else if (message === ALERT_MESSAGES.PRAY_RANGED) {
      statusBox.innerHTML = '<span class="alert-prayer-ranged">' + message + '</span>';
    } else if (message === ALERT_MESSAGES.PRAY_MELEE) {
      statusBox.innerHTML = '<span class="alert-prayer-melee">' + message + '</span>';
    } else if (message === ALERT_MESSAGES.NAME_CALLING || message === ALERT_MESSAGES.NAME_CALLING_CRONDIS || message === ALERT_MESSAGES.NAME_CALLING_SCABARAS) {
      statusBox.innerHTML = '<span class="alert-name-calling">' + message + '</span>';
    } else if (message === ALERT_MESSAGES.NW_VOKES || message === ALERT_MESSAGES.SW_VOKES || message === ALERT_MESSAGES.NE_VOKES || message === ALERT_MESSAGES.SE_VOKES) {
      statusBox.innerHTML = '<span class="alert-directional">' + message + '</span>';
    } else if (message === ALERT_MESSAGES.AMASCUT_ATTACKING) {
      // Amascut attacking Tumeken with subtext
      statusBox.innerHTML = '<div class="alert-info-with-subtext">' + message + '</div><div class="alert-info-subtext">Kill dogs & watch for your name!</div>';
    } else if (message.includes(ALERT_MESSAGES.SCARABS_PREFIX)) {
      // Scarab progress counter with target hit counter
      const parts = message.split('<br>');
      let html = '<span class="alert-info">' + parts[0] + '</span>';
      if (parts[1]) {
        html += '<br><span class="alert-target-hit">' + parts[1] + '</span>';
      }
      statusBox.innerHTML = html;
    } else if (message === ALERT_MESSAGES.ALL_SCARABS) {
      // All scarabs collected - larger and more prominent
      statusBox.innerHTML = '<span class="alert-info-large">' + message + '</span>';
    } else if (message === ALERT_MESSAGES.KILL_DOGS) {
      statusBox.innerHTML = '<div class="alert-info-with-subtext"><span class="alert-critical">' + message + '</span></div><div class="alert-info-subtext">Amascut attacking Tumeken</div>';
    } else if (message === ALERT_MESSAGES.STAND_BEHIND) {
      statusBox.innerHTML = '<span class="alert-critical">' + message + '</span>';
    } else if (message === ALERT_MESSAGES.GREEN_1 || message === ALERT_MESSAGES.GREEN_2) {
      statusBox.innerHTML = '<span class="alert-info">' + message + '</span>';
    } else {
      // Default status messages
      statusBox.innerHTML = '<span class="alert-status">' + message + '</span>';
    }

    // Update timer display to match status (unless timer is active)
    updateTimerForStatus(message);
  }
}

/**
 * Update timer display based on status
 * @param {string} statusMessage - Current status message
 */
export function updateTimerForStatus(statusMessage) {
  // Don't override active countdown
  if (timerActive) return;

  if (statusMessage === ALERT_MESSAGES.LOOKING_FOR_CHATBOX) {
    updateTimerDisplay(ALERT_MESSAGES.SEARCHING, '');
  } else if (statusMessage === ALERT_MESSAGES.READY_MONITORING || statusMessage === ALERT_MESSAGES.MONITORING_CHAT) {
    // Don't show anything when ready to monitor
    updateTimerDisplay("", '');
  } else if (statusMessage === ALERT_MESSAGES.MECHANIC_ACTIVE) {
    updateTimerDisplay(ALERT_MESSAGES.MECHANIC_ACTIVE, 'alert-active');
  }
}

/**
 * Show and initialize progress bar
 * @param {number} totalDuration - Total duration in milliseconds
 */
export function showProgressBar(totalDuration) {
  const progressBar = document.getElementById('progressBar');
  if (progressBar) {
    progressBar.style.display = 'block';
    updateProgressBar(100, 'green'); // Start at 100%
  }
}

/**
 * Update progress bar scale and color
 * @param {number} percentage - Percentage remaining (0-100)
 * @param {string} color - Color class ('green', 'yellow', 'red')
 */
export function updateProgressBar(percentage, color) {
  const progressBar = document.getElementById('progressBar');
  if (progressBar) {
    const fillElement = progressBar.querySelector('.progress-fill');
    if (fillElement) {
      // Convert percentage to scale factor (0-1)
      const scaleFactor = percentage / 100;
      fillElement.style.transform = `scaleX(${scaleFactor})`;

      let bgColor = '#00ff00'; // green
      if (color === 'yellow') bgColor = '#ffff00';
      else if (color === 'red') bgColor = '#ff0000';
      fillElement.style.backgroundColor = bgColor;
    }
  }
}

/**
 * Hide progress bar
 */
export function hideProgressBar() {
  const progressBar = document.getElementById('progressBar');
  if (progressBar) {
    progressBar.style.display = 'none';
  }
}

/**
 * Update details message
 * @param {string} message - Details message to display
 */
export function updateDetails(message) {
  const detailsBox = document.getElementById('detailsBox');
  if (detailsBox) {
    if (message && message.trim() !== "") {
      detailsBox.style.display = 'flex';
      detailsBox.innerHTML = '<span class="alert-details">' + message + '</span>';
    } else {
      detailsBox.style.display = 'none';
      detailsBox.innerHTML = '';
    }
  }
}

/**
 * Clear details display
 */
export function clearDetails() {
  updateDetails("");
}

/**
 * Update status only if the corresponding alert setting is enabled
 * @param {string} message - Status message to display
 * @param {string} settingKey - The alert setting key to check
 */
export function updateStatusIfEnabled(message, settingKey) {
  if (isAlertEnabled(settingKey)) {
    updateStatus(message);
  }
}

/**
 * Update timer display only if the corresponding alert setting is enabled
 * @param {string} text - Text to display
 * @param {string} className - CSS class for styling
 * @param {string} settingKey - The alert setting key to check
 */
export function updateTimerDisplayIfEnabled(text, className, settingKey) {
  if (isAlertEnabled(settingKey)) {
    updateTimerDisplay(text, className);
  }
}

/**
 * Show temporary alert only if the corresponding alert setting is enabled
 * @param {string} message - Alert message to display
 * @param {string} settingKey - The alert setting key to check
 * @param {number} duration - Duration in milliseconds
 */
export function showTemporaryAlertIfEnabled(message, settingKey, duration = TIMER_DURATIONS.ALERT_DURATION) {
  if (isAlertEnabled(settingKey)) {
    showTemporaryAlert(message, duration);
  }
}
