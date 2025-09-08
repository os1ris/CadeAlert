// Barricade Timer - Chat Module
// Contains chat reader setup and message processing logic

import { CHAT_COLORS, MESSAGE_TRIGGERS, ALERT_MESSAGES, TIMER_DURATIONS } from './constants.js';
import {
  backwardsReadingEnabled,
  backwardsReadingDistance,
  oldLineTime,
  updateOldLineTime,
  isHardMode,
  lastGodSpoken,
  greenFlipCount,
  greenFlipActive,
  timerActive
} from './state.js';
import { validateMessageTimestamp, showTemporaryAlert, updateTimerDisplay, updateStatus } from './helpers.js';
import { startBarricadeTimer, cancelTimer } from './timer.js';
import { handleNameCallingMechanic, updateLastGodSpoken, toggleGreenFlip, showKillDogsAlert, showSubjugationAlert, incrementScarabCount, startGreenFlip } from './mechanics.js';
import { handleError } from './error.js';
import { resetForNewInstance } from './reset.js';

// Chat reader setup - reading relevant chat colors
let chatReader = new Chatbox.default();
chatReader.readargs = {
  colors: CHAT_COLORS,
  backwards: backwardsReadingEnabled,
};

/**
 * Initialize chat reader and start monitoring
 */
export function initializeChatReader() {
  // Initialize chat reader
  let findChat = setInterval(function () {
    if (chatReader.pos === null) {
      try {
        chatReader.find();
        updateStatus(ALERT_MESSAGES.LOOKING_FOR_CHATBOX);
      } catch (e) {
        handleError(e);
      }
    } else {
      console.log("Chatbox found!");
      const modeText = isHardMode ? "[HARD MODE]" : "[NORMAL MODE]";
      updateStatus(`${ALERT_MESSAGES.READY_MONITORING}${modeText}`);
      // Clear timer display when fully ready
      updateTimerDisplay("", 'ready');
      clearInterval(findChat);

      // Start monitoring chat
      setInterval(function () {
        // Check if chatbox is still available
        if (chatReader.pos === null) {
          console.log('Chatbox lost - restarting search');
          updateTimerDisplay(ALERT_MESSAGES.SEARCHING, '');
          updateStatus(ALERT_MESSAGES.LOOKING_FOR_CHATBOX);
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
              updateStatus(ALERT_MESSAGES.READY_MONITORING);
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
}

/**
 * Read and process chat messages
 */
export function readChatbox() {
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
            updateOldLineTime(lineTime);
          }

          // Log all detected chat text for debugging
          console.log('Chat detected:', line.text);
          console.log('Processed message:', message);

          // Process message triggers
          processMessageTriggers(message);
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

/**
 * Process message triggers and handle corresponding actions
 * @param {string} message - The processed chat message
 */
function processMessageTriggers(message) {
  // Check for welcome message to reset for new instance
  if (message.includes(MESSAGE_TRIGGERS.WELCOME)) {
    console.log('🏰 WELCOME MESSAGE DETECTED: New Amascut instance started');
    resetForNewInstance();
    return; // Skip other processing for this message
  }

  // Check for "Amascut, the Devourer: Tear them apart" trigger - HIGH PRIORITY DETECTION
  if (!timerActive && (
      message.includes(MESSAGE_TRIGGERS.TEAR_THEM_APART) ||
      message.includes("tear them") ||
      message.includes("amascut") && message.includes("tear") ||
      message.includes("devourer") && message.includes("tear")
  )) {
    const mainAttackDuration = isHardMode ? TIMER_DURATIONS.HARD_MODE_ATTACK : TIMER_DURATIONS.NORMAL_MODE_ATTACK;
    console.log(`🎯 CRITICAL TRIGGER DETECTED: "${message}"`);
    console.log(`🚀 STARTING BARRICADE TIMER: ${mainAttackDuration/1000}s [${isHardMode ? 'HARD' : 'NORMAL'} MODE]`);
    startBarricadeTimer(mainAttackDuration);
    return;
  }

  // Check for "Tumeken's heart, delivered to me by these mortals" trigger
  if (message.includes(MESSAGE_TRIGGERS.TUMEKEN_HEART) && !timerActive) {
    console.log('🎯 TRIGGER DETECTED: Starting barricade timer (14s)');
    startBarricadeTimer(TIMER_DURATIONS.SPECIAL_PHASE);
    return;
  }

  // Check for "Enough" cancellation
  if (message.includes("enough") && timerActive) {
    console.log('🛑 CANCELLATION DETECTED: Stopping timer');
    cancelTimer();
    return;
  }

  // Check for prayer switching alerts
  if (message.includes(MESSAGE_TRIGGERS.ALL_STRENGTH_WITHERS)) {
    console.log('🛡️ PRAYER ALERT: Melee attack detected');
    showTemporaryAlert(ALERT_MESSAGES.PRAY_MELEE);
    return;
  }
  if (message.includes(MESSAGE_TRIGGERS.I_WILL_NOT_SUFFER)) {
    console.log('🛡️ PRAYER ALERT: Ranged attack detected');
    showTemporaryAlert(ALERT_MESSAGES.PRAY_RANGED);
    return;
  }
  if (message.includes(MESSAGE_TRIGGERS.YOUR_SOUL_IS_WEAK)) {
    console.log('🛡️ PRAYER ALERT: Magic attack detected');
    showTemporaryAlert(ALERT_MESSAGES.PRAY_MAGIC);
    return;
  }

  // Check for tri-colour attack warnings
  if ((message.includes(MESSAGE_TRIGGERS.GROVEL) ||
        message.includes(MESSAGE_TRIGGERS.PATHETIC) ||
        message.includes(MESSAGE_TRIGGERS.WEAK))) {
    console.log('⚠️ TRI-ATTACK WARNING: Tri-colour attack incoming');
    console.log('📝 Message that triggered:', message);
    showTemporaryAlert(ALERT_MESSAGES.TRI_COLOUR_ATTACK, TIMER_DURATIONS.TRI_ATTACK_DURATION);
    return;
  }

  // Check for scarab collection
  if (message.includes(MESSAGE_TRIGGERS.SCARAB_COLLECTED)) {
    console.log('🪳 SCARAB COLLECTED');
    incrementScarabCount();
    return;
  }

  // Check for Amascut attacking Tumeken
  if (message.includes(MESSAGE_TRIGGERS.GET_OUT_OF_MY_WAY)) {
    console.log('⚔️ AMASCUT ATTACKING TUMEKEN');
    showTemporaryAlert(ALERT_MESSAGES.AMASCUT_ATTACKING, TIMER_DURATIONS.AMASCUT_ATTACK_DURATION);
    return;
  }

  // Check for name-calling mechanic start
  if (message.includes(MESSAGE_TRIGGERS.YOU_ARE_NOTHING)) {
    handleNameCallingMechanic();
    return;
  }

  // Check for voke calls
  if (message.includes(MESSAGE_TRIGGERS.I_AM_SORRY_APMEKEN)) {
    console.log('📍 NW VOKES CALLED');
    updateLastGodSpoken('apmeken');
    showTemporaryAlert(ALERT_MESSAGES.NW_VOKES, TIMER_DURATIONS.VOKES_DURATION);
    return;
  }

  if (message.includes(MESSAGE_TRIGGERS.FORGIVE_ME_HET)) {
    console.log('📍 SW VOKES CALLED');
    updateLastGodSpoken('het');
    showTemporaryAlert(ALERT_MESSAGES.SW_VOKES, TIMER_DURATIONS.VOKES_DURATION);
    return;
  }

  // Check for NE voke call - SPECIFIC DETECTION to avoid false positives
  if (message === MESSAGE_TRIGGERS.SCABARAS || (message.includes(MESSAGE_TRIGGERS.SCABARAS) && message.length < 20)) {
    console.log('📍 NE VOKES CALLED - Scabaras called');
    updateLastGodSpoken('scabaras');
    showTemporaryAlert(ALERT_MESSAGES.NE_VOKES, TIMER_DURATIONS.VOKES_DURATION);
    return;
  }

  if (message.includes(MESSAGE_TRIGGERS.CRONDIS)) {
    console.log('📍 SE VOKES CALLED');
    updateLastGodSpoken('crondis');
    showTemporaryAlert(ALERT_MESSAGES.SE_VOKES, TIMER_DURATIONS.VOKES_DURATION);
    return;
  }

  // Check for "Bend the Knee" attack
  if (message.includes(MESSAGE_TRIGGERS.BEND_THE_KNEE)) {
    console.log('⚔️ BEND THE KNEE ATTACK: Incoming attack detected');
    showTemporaryAlert(ALERT_MESSAGES.BEND_KNEE_ATTACK, TIMER_DURATIONS.BEND_KNEE_DURATION);
    return;
  }

  // Check for Amascut's "Your light will be snuffed out" message
  if (message.includes(MESSAGE_TRIGGERS.LIGHT_SNUFFED)) {
    greenFlipCount++;
    console.log(`🟢 LIGHT SNUFFED: Green flip count ${greenFlipCount}`);

    if (!greenFlipActive) {
      // First detection - start the mechanic
      greenFlipActive = true;
      startGreenFlip();
    } else {
      // Subsequent detection - toggle to Green 2
      toggleGreenFlip();
    }
    return;
  }

  // Check for Tumeken's "A new dawn" message
  if (message.includes(MESSAGE_TRIGGERS.NEW_DAWN)) {
    console.log('🐕 NEW DAWN: Starting KILL DOGS NOW alert');
    showKillDogsAlert();
    return;
  }

  // Check for Amascut's "I will not be subjugated" message
  if (message.includes(MESSAGE_TRIGGERS.NOT_BE_SUBJUGATED)) {
    console.log('👑 SUBJUGATION: Starting stand behind alert');
    showSubjugationAlert();
    return;
  }
}
