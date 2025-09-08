// Barricade Timer - Error Handling Module
// Contains error handling functions and utilities

import { ALERT_MESSAGES } from './constants.js';

/**
 * Handle general errors and update UI accordingly
 * @param {Error} error - The error object
 */
export function handleError(error) {
  if (error.message == "capturehold failed") {
    updateStatus("Error: Can't find RS client");
  } else if (error.message.includes("No permission")) {
    updateStatus("Error: No permission - Install app first");
  } else if (error.message == "alt1 is not defined") {
    updateStatus("Error: Alt1 not found - Open in Alt1");
  } else {
    updateStatus("Unknown error - Check console");
    console.log("Error: " + error.message);
  }
}

/**
 * Update status message (local function for error module)
 * @param {string} message - Status message to display
 */
function updateStatus(message) {
  const statusBox = document.getElementById('statusBox');
  if (statusBox) {
    statusBox.innerHTML = '<span class="alert-status">' + message + '</span>';
  }
}
