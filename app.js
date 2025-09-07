// Barricade Timer Alt1 Toolkit Plug-in
// Monitors chat for boss phrases and provides timing for barricade ability

// Enable "Add App" button for Alt1 Browser
A1lib.identifyApp("appconfig.json");

// State management
let timerActive = false;
let countdownInterval = null;
let timerEndTime = 0;
let timerStartTime = 0;
let currentState = 'ready'; // 'ready', 'counting', 'alert', 'canceled'
let isHardMode = true; // Track difficulty mode - default to hard mode

// OCR Quality Validation - Timestamp tracking
let oldLineTime = new Date();

// Load saved mode from localStorage - COMMENTED OUT
/*
function loadSavedMode() {
  try {
    const saved = localStorage.getItem('cadeAlert_hardMode');
    console.log('Loading hard mode from localStorage:', saved);
    if (saved !== null) {
      isHardMode = saved === 'true';
      console.log('Hard mode set to:', isHardMode);
    } else {
      console.log('No saved hard mode found, using default: false');
    }
  } catch (error) {
    console.log('Error loading from localStorage:', error);
    isHardMode = false; // fallback
  }
}

// Save current mode to localStorage
function saveMode() {
  try {
    localStorage.setItem('cadeAlert_hardMode', isHardMode.toString());
    console.log('Saved hard mode to localStorage:', isHardMode);
  } catch (error) {
    console.log('Error saving to localStorage:', error);
  }
}
*/

// Complete reset function for new instance
function resetForNewInstance() {
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

  // Reset all state variables
  timerActive = false;
  timerEndTime = 0;
  timerStartTime = 0;
  currentState = 'ready';
  scarabCount = 0;

  // Clear displays
  updateTimerDisplay("", 'ready');
  updateStatus("Ready - Monitoring chat...");

  console.log('✅ Reset complete - App ready for new encounter');
}

// Scarab counter
let scarabCount = 0;
let scarabTimeout = null;

// Mechanic display intervals
let greenFlipInterval = null;
let killDogsTimeout = null;
let subjugationTimeout = null;
let nameCallingTimeout = null;

// Track which god last spoke for name-calling mechanic
let lastGodSpoken = null;

// Track Green 1/Green 2 mechanic state
let greenFlipCount = 0;
let greenFlipActive = false;

// Chat reader setup - reading relevant chat colors
let chatReader = new Chatbox.default();
chatReader.readargs = {
  colors: [
    A1lib.mixColor(255, 255, 255), // Normal Text White
    A1lib.mixColor(69, 131, 145),  // Amascut Blue
    A1lib.mixColor(153, 255, 153), // Amascut Green
    A1lib.mixColor(196, 184, 72)   // Tumeken Gold
],
  backwards: true,
};



// Initialize chat reader
let findChat = setInterval(function () {
  if (chatReader.pos === null) {
    try {
      chatReader.find();
      updateStatus("Looking for chatbox...");
    } catch (e) {
      handleError(e);
    }
  } else {
    console.log("Chatbox found!");
    const modeText = isHardMode ? "[HARD MODE]" : "[NORMAL MODE]";
    updateStatus(`Ready - ${modeText} Monitoring chat...`);
    // Clear timer display when fully ready
    updateTimerDisplay("", 'ready');
    clearInterval(findChat);

    // Start monitoring chat
    setInterval(function () {
      // Check if chatbox is still available
      if (chatReader.pos === null) {
        console.log('Chatbox lost - restarting search');
        updateTimerDisplay("Searching...", '');
        updateStatus("Looking for chatbox...");
        // Restart the chatbox search
        findChat = setInterval(function () {
          if (chatReader.pos === null) {
            try {
              chatReader.find();
            } catch (e) {
              handleError(e);
            }
          } else {
            console.log("Chatbox found again!");
            updateStatus("Ready - Monitoring chat...");
            clearInterval(findChat);
          }
        }, 1000);
        return; // Don't process chat this cycle
      }

      // Process chat messages
      readChatbox();
    }, 300);
  }
}, 1000);

// Read and process chat messages
function readChatbox() {
  try {
    var lines = chatReader.read() || [];
    const numLines = lines.length;

    for (let idx = 0; idx < numLines; idx++) {
      let line = lines[idx];

      if (line && line.text) {
        let message = line.text.toLowerCase().trim();

        // OCR Quality Validation - Timestamp processing
        let lineTime = new Date();
        let lineTimeStr = null;

        try {
          // Extract timestamp from chatline if present
          lineTimeStr = line.text.match(/[0-9]{2}[:]{1}[0-9]{2}[:]{1}[0-9]{2}/g);
          if (lineTimeStr && lineTimeStr[0]) {
            lineTimeStr = lineTimeStr[0];
            let lineTimeSplit = lineTimeStr.split(':');

            // Handle day rollover
            if (lineTimeSplit[0] == 23 && lineTime.getHours() == 0) {
              lineTime.setDate(lineTime.getDate() - 1);
            }

            lineTime.setHours(lineTimeSplit[0]);
            lineTime.setMinutes(lineTimeSplit[1]);
            lineTime.setSeconds(lineTimeSplit[2]);
          }
        } catch (e) {
          console.log('Error parsing timestamp:', e.message);
        }

        // OCR Quality Validation - Check if message is newer than previous
        if (oldLineTime <= lineTime || lineTimeStr === null) {
          if (lineTimeStr !== null) {
            oldLineTime = lineTime;
          }

          // Log all detected chat text for debugging
          console.log('Chat detected:', line.text);
          console.log('Processed message:', message);

          // Check for welcome message to reset for new instance
      if (message.includes("welcome to your session against: amascut, the devourer")) {
        console.log('🏰 WELCOME MESSAGE DETECTED: New Amascut instance started');
        resetForNewInstance();
        continue; // Skip other processing for this message
      }

      // Check for "Amascut, the Devourer: Tear them apart" trigger - HIGH PRIORITY DETECTION
      if (!timerActive && (
          message.includes("tear them apart") ||
          message.includes("tear them") ||
          message.includes("amascut") && message.includes("tear") ||
          message.includes("devourer") && message.includes("tear")
      )) {
        const mainAttackDuration = isHardMode ? 21000 : 36000; // 21s hard, 36s normal
        console.log(`🎯 CRITICAL TRIGGER DETECTED: "${message}"`);
        console.log(`🚀 STARTING BARRICADE TIMER: ${mainAttackDuration/1000}s [${isHardMode ? 'HARD' : 'NORMAL'} MODE]`);
        startBarricadeTimer(mainAttackDuration);
      }

      // Check for "Tumeken's heart, delivered to me by these mortals" trigger
      else if (message.includes("tumeken's heart, delivered to me by these mortals") && !timerActive) {
        console.log('🎯 TRIGGER DETECTED: Starting barricade timer (14s)');
        startBarricadeTimer(14000); // 14 seconds
      }

      // Check for "Enough" cancellation
      else if (message.includes("enough") && timerActive) {
        console.log('🛑 CANCELLATION DETECTED: Stopping timer');
        cancelTimer();
      }

      // Check for prayer switching alerts
      else if (message.includes("all strength withers")) {
        console.log('🛡️ PRAYER ALERT: Melee attack detected');
        updateStatus("Pray Melee!");
        setTimeout(() => {
          updateStatus("Monitoring chat...");
        }, 6000);
      }
      else if (message.includes("i will not suffer this")) {
        console.log('🛡️ PRAYER ALERT: Ranged attack detected');
        updateStatus("Pray Ranged!");
        setTimeout(() => {
          updateStatus("Monitoring chat...");
        }, 6000);
      }
      else if (message.includes("your soul is weak")) {
        console.log('🛡️ PRAYER ALERT: Magic attack detected');
        updateStatus("Pray Magic!");
        setTimeout(() => {
          updateStatus("Monitoring chat...");
        }, 6000);
      }

      // Check for tri-colour attack warnings
      else if ((message.includes("amascut, the devourer: grovel") ||
                message.includes("amascut, the devourer: pathetic") ||
                message.includes("amascut, the devourer: weak")) && !message.includes("tear them apart")) {
        console.log('⚠️ TRI-ATTACK WARNING: Tri-colour attack incoming');
        updateStatus("Tri-Colour Attack Incoming!");
        setTimeout(() => {
          updateStatus("Monitoring chat...");
        }, 3000);
      }

      // Check for Tumeken charge message
      else if (message.includes("unite the last echoes of my power, and i will aid you")) {
        console.log('⚡ TUMEKEN CHARGE: Time to charge');
        updateStatus("Time to charge");
        setTimeout(() => {
          updateStatus("Monitoring chat...");
        }, 3000);
      }

      // Check for scarab collection
      else if (message.includes("the scarab is sucked into portal")) {
        console.log('🪳 SCARAB COLLECTED');
        incrementScarabCount();
      }

      // Check for Amascut attacking Tumeken
      else if (message.includes("get out of my way")) {
        console.log('⚔️ AMASCUT ATTACKING TUMEKEN');
        updateStatus("Amascut attacking Tumeken!");
        setTimeout(() => {
          updateStatus("Monitoring chat...");
        }, 3000);
      }

      // Check for name-calling mechanic start
      else if (message.includes("you are nothing")) {
        console.log('🚨 STATUE-CALLING MECHANIC START - Delaying 3.6s');

        // Clear any existing name-calling timeout
        if (nameCallingTimeout) {
          clearTimeout(nameCallingTimeout);
        }

        // Delay the alert by 3.6 seconds
        nameCallingTimeout = setTimeout(() => {
          console.log('🚨 NAME-CALLING MECHANIC: Alert triggered');

          // Check which god was last spoken to and show appropriate message
          if (lastGodSpoken === 'crondis') {
            updateStatus("NAME-CALLING MECHANIC! NO SKULLS!");
          } else if (lastGodSpoken === 'scabaras') {
            updateStatus("NAME-CALLING MECHANIC! THROW SCARABS!");
          } else {
            updateStatus("NAME-CALLING MECHANIC!");
          }

          // Cancel any active timers during this phase
          if (timerActive) {
            clearInterval(countdownInterval);
            timerActive = false;
            updateTimerDisplay("Mechanic Active", 'alert-active');
          }

          // Clear the alert after 5 seconds
          setTimeout(() => {
            updateStatus("Monitoring chat...");
          }, 5000);
        }, 3600); // 3.6 seconds delay
      }

      // Check for NW voke call
      else if (message.includes("i am sorry, apmeken")) {
        console.log('📍 NW VOKES CALLED');
        lastGodSpoken = 'apmeken';
        updateStatus("NW Vokes!");
        setTimeout(() => {
          updateStatus("Monitoring chat...");
        }, 4000);
      }

      // Check for SW voke call
      else if (message.includes("forgive me, het")) {
        console.log('📍 SW VOKES CALLED');
        lastGodSpoken = 'het';
        updateStatus("SW Vokes!");
        setTimeout(() => {
          updateStatus("Monitoring chat...");
        }, 4000);
      }

      // Check for NE voke call - SPECIFIC DETECTION to avoid false positives
      else if (message === "scabaras.." || (message.includes("scabaras..") && message.length < 20)) {
        console.log('📍 NE VOKES CALLED - Scabaras called');
        lastGodSpoken = 'scabaras';
        updateStatus("NE Vokes! THROW SCARABS!");
        setTimeout(() => {
          updateStatus("Monitoring chat...");
        }, 4000);
      }

      // Check for SE voke call
      else if (message.includes("crondis... it should have never come to this")) {
        console.log('📍 SE VOKES CALLED');
        lastGodSpoken = 'crondis';
        updateStatus("SE Vokes!");
        setTimeout(() => {
          updateStatus("Monitoring chat...");
        }, 4000);
      }

      // Check for "Bend the Knee" attack
      else if (message.includes("bend the knee")) {
        console.log('⚔️ BEND THE KNEE ATTACK: Incoming attack detected');
        updateStatus("Bend the Knee Attack Incoming!");
        setTimeout(() => {
          updateStatus("Monitoring chat...");
        }, 3000);
      }

      // Check for Amascut's "Your light will be snuffed out" message
      else if (message.includes("your light will be snuffed out, once and for all")) {
        greenFlipCount++;
        console.log(`🟢 LIGHT SNUFFED: Green flip count ${greenFlipCount}`);

        if (!greenFlipActive) {
          // First detection - start the mechanic
          greenFlipActive = true;
          startGreenFlip();
        } else {
          // Subsequent detection - toggle to Green 2
          updateTimerDisplay("GREEN 2", 'alert-active');
          updateStatus("Green 2 Active!");
        }
      }

      // Check for Tumeken's "A new dawn" message
      else if (message.includes("a new dawn")) {
        console.log('🐕 NEW DAWN: Starting KILL DOGS NOW alert');
        showKillDogsAlert();
      }

      // Check for Amascut's "I will not be subjugated" message
      else if (message.includes("i will not be subjugated")) {
        console.log('👑 SUBJUGATION: Starting stand behind alert');
        showSubjugationAlert();
      }
        } else {
          console.log("Skipping old message:", line.text);
        }
      }
    }
  } catch (error) {
    console.log('Error reading chat:', error);
    handleError(error);
  }
}

// Start the barricade timer with specified duration
function startBarricadeTimer(duration = 14000) {
  if (timerActive) return;

  timerActive = true;
  currentState = 'counting';
  timerStartTime = Date.now(); // Record when timer started
  timerEndTime = timerStartTime + duration;

  const initialCount = Math.ceil(duration / 1000);
  updateTimerDisplay(initialCount, 'countdown-green');
  updateStatus("Barricade incoming...");

  // Start countdown interval
  countdownInterval = setInterval(function () {
    updateCountdown();
  }, 100);
}

// Update the countdown display
function updateCountdown() {
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

// Get appropriate color class for countdown
function getCountdownColor(seconds) {
  if (seconds > 10) return 'countdown-green';
  if (seconds > 5) return 'countdown-yellow';
  return 'countdown-red';
}

// Show barricade ability alert
function showBarricadeAlert() {
  clearInterval(countdownInterval);
  timerActive = false;
  currentState = 'alert';

  updateStatus("Ability ready!");

  // Start live countdown for barricade alert
  countdownInterval = setInterval(function () {
    let remaining = Math.ceil((timerEndTime - Date.now()) / 1000);
    if (remaining < 0) remaining = 0;

    updateTimerDisplay("USE BARRICADE!<br>(" + remaining + "s left)", 'alert-active');

    // Stop countdown when time runs out
    if (remaining <= 0) {
      clearInterval(countdownInterval);
      // Keep the alert visible for a bit longer
      setTimeout(function () {
        resetTimer();
      }, 2000);
    }
  }, 100);
}

// Cancel the timer when boss says "Enough" (only within 10 seconds of trigger)
function cancelTimer() {
  if (!timerActive) return;

  // Check if "Enough" was said within 10 seconds of timer start
  let timeSinceStart = Date.now() - timerStartTime;
  if (timeSinceStart > 10000) { // 10 seconds in milliseconds
    console.log("Ignoring 'Enough' - said after 10-second window");
    return; // Don't cancel if outside the 10-second window
  }

  clearInterval(countdownInterval);
  timerActive = false;
  currentState = 'canceled';

  updateTimerDisplay("Scarabs Skipped", 'canceled');
  updateStatus("Timer canceled");

  // Auto-reset after 3 seconds
  setTimeout(function () {
    resetTimer();
  }, 3000);
}

// Reset timer to ready state
function resetTimer() {
  timerActive = false;
  currentState = 'ready';
  clearInterval(countdownInterval);

  updateTimerDisplay("", 'ready');
  updateStatus("Monitoring chat...");
}

// Update timer display
function updateTimerDisplay(text, className) {
  const timerBox = document.getElementById('timerBox');
  if (timerBox) {
    // Add header for countdown numbers
    if (!isNaN(text) && text !== "") {
      timerBox.innerHTML = "Detonation in:<br>" + text;
    } else {
      // Check if text contains HTML (like <br>)
      if (text.includes('<br>') || text.includes('<')) {
        timerBox.innerHTML = text;
      } else {
        timerBox.textContent = text;
      }
    }
    timerBox.className = 'timer-display ' + className;
  }
}

// Update status message
function updateStatus(message) {
  const statusBox = document.getElementById('statusBox');
  if (statusBox) {
    if (message === "Tri-Colour Attack Incoming!") {
      statusBox.innerHTML = '<span style="font-size: 18px; font-weight: bold; color: #ff4444;">' + message + '</span>';
    } else if (message === "Bend the Knee Attack Incoming!") {
      statusBox.innerHTML = '<span style="font-size: 18px; font-weight: bold; color: #ff4444;">' + message + '</span>';
    } else if (message === "Pray Magic!") {
      statusBox.innerHTML = '<span style="font-size: 18px; font-weight: bold; color: #0080ff;">' + message + '</span>';
    } else if (message === "Pray Ranged!") {
      statusBox.innerHTML = '<span style="font-size: 18px; font-weight: bold; color: #00ff00;">' + message + '</span>';
    } else if (message === "Pray Melee!") {
      statusBox.innerHTML = '<span style="font-size: 18px; font-weight: bold; color: #ff4444;">' + message + '</span>';
    } else if (message === "NAME-CALLING MECHANIC!") {
      statusBox.innerHTML = '<span style="font-size: 20px; font-weight: bold; color: #ff0000; text-decoration: underline;">' + message + '</span>';
    } else if (message === "NW Vokes!" || message === "SW Vokes!" || message === "NE Vokes!" || message === "SE Vokes!") {
      statusBox.innerHTML = '<span style="font-size: 22px; font-weight: bold; color: #ffff00; text-shadow: 2px 2px 4px #000;">' + message + '</span>';
    } else if (message === "Amascut attacking Tumeken!") {
      // Make Amascut attacking Tumeken message bigger with subtext
      statusBox.innerHTML = '<div style="font-size: 24px; font-weight: bold; color: #ff4444; text-shadow: 2px 2px 4px #000;">' + message + '</div><div style="font-size: 14px; color: #ffffff; margin-top: 3px; line-height: 1.2;">Kill dogs & watch for your name!</div>';
    } else if (message.includes("Scarabs:") || message === "All scarabs collected!") {
      // Make scarab messages bigger and more prominent
      statusBox.innerHTML = '<span style="font-size: 24px; font-weight: bold; color: #ffaa00; text-shadow: 2px 2px 4px #000;">' + message + '</span>';
    } else {
      statusBox.textContent = message;
    }

    // Update timer display to match status (unless timer is active)
    updateTimerForStatus(message);
  }
}

// Update timer display based on status
function updateTimerForStatus(statusMessage) {
  // Don't override active countdown
  if (timerActive) return;

  if (statusMessage === "Looking for chatbox...") {
    updateTimerDisplay("Searching...", '');
  } else if (statusMessage === "Ready - Monitoring chat..." || statusMessage === "Monitoring chat...") {
    // Don't show anything when ready to monitor
    updateTimerDisplay("", '');
  } else if (statusMessage.includes("Barricade incoming")) {
    // Timer will be updated by startBarricadeTimer
  } else if (statusMessage === "Mechanic Active") {
    updateTimerDisplay("Mechanic Active", 'alert-active');
  }
}

// Handle errors
function handleError(error) {
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

// Debug function (can be called from console)
function debugStartTimer() {
  startBarricadeTimer();
}

function debugCancelTimer() {
  cancelTimer();
}

// Scarab counter functions
function incrementScarabCount() {
  scarabCount++;
  console.log('Scarab count:', scarabCount);

  // Clear existing timeout to reset the inactivity timer
  if (scarabTimeout) {
    clearTimeout(scarabTimeout);
    scarabTimeout = null;
  }

  if (scarabCount >= 4) {
    // All scarabs collected
    updateStatus("All scarabs collected!");
    scarabCount = 0; // Reset for next phase
    scarabTimeout = setTimeout(() => {
      updateStatus("Monitoring chat...");
      scarabTimeout = null;
    }, 5000); // Keep "All collected" visible for 5 seconds
  } else {
    // Show current count - force immediate update
    updateStatus(`Scarabs: ${scarabCount}/4`);
    // Set timeout to clear display after 12 seconds of inactivity
    scarabTimeout = setTimeout(() => {
      scarabCount = 0; // Reset counter
      updateStatus("Monitoring chat...");
      scarabTimeout = null;
    }, 12000);
  }
}

// Toggle between normal and hard mode - COMMENTED OUT
/*
function toggleMode() {
  isHardMode = !isHardMode;
  saveMode(); // Save to localStorage
  updateToggleButton(); // Update button appearance
  const modeText = isHardMode ? "HARD MODE" : "NORMAL MODE";
  console.log(`🔄 MODE SWITCHED: Now in ${modeText}`);
  updateStatus(`${modeText} - Monitoring chat...`);
  setTimeout(() => {
    updateStatus("Monitoring chat...");
  }, 2000);
}

// Update toggle button text
function updateToggleButton() {
  const button = document.getElementById('modeToggle');
  if (button) {
    button.textContent = isHardMode ? 'Hard Mode' : 'Normal Mode';
    button.className = isHardMode ? 'btn btn-sm btn-outline-danger' : 'btn btn-sm btn-outline-primary';
  }
}

// Initialize toggle button on startup
function initializeToggleButton() {
  // Load saved mode from localStorage first
  loadSavedMode();

  // Then update the button with the loaded value
  updateToggleButton();

  console.log('UI initialized with hard mode:', isHardMode);
}
*/

// Green 1/Green 2 display function
function startGreenFlip() {
  console.log('🟢 GREEN FLIP: Starting Green 1 display');

  // Clear any existing intervals
  if (greenFlipInterval) {
    clearInterval(greenFlipInterval);
  }

  // Show Green 1 initially
  updateTimerDisplay("GREEN 1", 'alert-active');
  updateStatus("Green 1 Active!");

  // Stop after 3 seconds and reset state
  greenFlipInterval = setTimeout(() => {
    greenFlipActive = false;
    greenFlipCount = 0;
    updateTimerDisplay("", 'ready');
    updateStatus("Monitoring chat...");
    console.log('🟢 GREEN FLIP: Display stopped');
  }, 3000);
}

// KILL DOGS NOW alert function
function showKillDogsAlert() {
  console.log('🐕 KILL DOGS: Starting alert');

  // Clear any existing intervals and timeouts
  if (greenFlipInterval) {
    clearInterval(greenFlipInterval);
    greenFlipInterval = null;
  }
  if (killDogsTimeout) {
    clearTimeout(killDogsTimeout);
  }
  if (scarabTimeout) {
    clearTimeout(scarabTimeout);
    scarabTimeout = null;
  }

  // Clear all displays and show KILL DOGS NOW
  updateTimerDisplay("KILL DOGS NOW", 'alert-active');
  updateStatus("KILL DOGS NOW!");

  // Reset after 9 seconds
  killDogsTimeout = setTimeout(() => {
    updateTimerDisplay("", 'ready');
    updateStatus("Monitoring chat...");
    console.log('🐕 KILL DOGS: Alert ended');
  }, 9000);
}

// Stand behind Amascut alert function
function showSubjugationAlert() {
  console.log('👑 SUBJUGATION: Starting stand behind alert');

  // Clear any existing intervals and timeouts
  if (greenFlipInterval) {
    clearInterval(greenFlipInterval);
    greenFlipInterval = null;
  }
  if (killDogsTimeout) {
    clearTimeout(killDogsTimeout);
  }
  if (subjugationTimeout) {
    clearTimeout(subjugationTimeout);
  }
  if (scarabTimeout) {
    clearTimeout(scarabTimeout);
    scarabTimeout = null;
  }

  // Clear all displays and show STAND BEHIND AMASCUT
  updateTimerDisplay("STAND BEHIND<br>AMASCUT", 'alert-active');
  updateStatus("STAND BEHIND AMASCUT, KILL MINIONS!");

  // Reset after 8 seconds
  subjugationTimeout = setTimeout(() => {
    updateTimerDisplay("", 'ready');
    updateStatus("Monitoring chat...");
    console.log('👑 SUBJUGATION: Alert ended');
  }, 8000);
}

// Debug function for testing reset
function debugReset() {
  console.log('🔄 DEBUG: Manual reset triggered');
  resetForNewInstance();
}

// Make functions available globally
window.debugStartTimer = debugStartTimer;
window.debugCancelTimer = debugCancelTimer;
window.debugReset = debugReset;
// window.toggleMode = toggleMode; // COMMENTED OUT
// window.updateToggleButton = updateToggleButton; // COMMENTED OUT

// Initialize when DOM is ready - COMMENTED OUT toggle button initialization
/*
document.addEventListener('DOMContentLoaded', function() {
  initializeToggleButton();
});
*/
