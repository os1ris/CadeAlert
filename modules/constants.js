// Barricade Timer - Constants Module
// Contains all constant definitions used throughout the application

export const TIMER_DURATIONS = {
  HARD_MODE_ATTACK: 21000,    // 21 seconds
  NORMAL_MODE_ATTACK: 36000,  // 36 seconds
  SPECIAL_PHASE: 14000,       // 14 seconds
  CANCEL_WINDOW: 10000,       // 10 seconds
  ALERT_DURATION: 6000,       // 6 seconds
  TRI_ATTACK_DURATION: 3000,  // 3 seconds
  TUMEKEN_CHARGE_DURATION: 3000,
  AMASCUT_ATTACK_DURATION: 3000,
  NAME_CALLING_DELAY: 3600,   // 3.6 seconds
  NAME_CALLING_ALERT: 5000,   // 5 seconds
  VOKES_DURATION: 4000,       // 4 seconds
  BEND_KNEE_DURATION: 3000,
  GREEN_FLIP_DURATION: 3000,  // 3 seconds
  KILL_DOGS_DURATION: 9000,   // 9 seconds
  SUBJUGATION_DURATION: 8000, // 8 seconds
  SCARAB_TIMEOUT: 12000,      // 12 seconds
  SCARAB_ALERT_DURATION: 5000, // 5 seconds
  RESET_DELAY: 2000,          // 2 seconds
  CANCEL_RESET_DELAY: 3000    // 3 seconds
};

export const CHAT_COLORS = [
  A1lib.mixColor(255, 255, 255), // Normal Text White
  A1lib.mixColor(69, 131, 145),  // Amascut Blue
  A1lib.mixColor(153, 255, 153), // Amascut Green
  A1lib.mixColor(196, 184, 72)   // Tumeken Gold
];

export const MESSAGE_TRIGGERS = {
  WELCOME: "welcome to your session against: amascut, the devourer",
  TEAR_THEM_APART: "tear them apart",
  TUMEKEN_HEART: "tumeken's heart, delivered to me by these mortals",
  ENOUGH: "enough",
  ALL_STRENGTH_WITHERS: "all strength withers",
  I_WILL_NOT_SUFFER: "i will not suffer this",
  YOUR_SOUL_IS_WEAK: "your soul is weak",
  GROVEL: "grovel",
  PATHETIC: "pathetic",
  WEAK: "weak",
  UNITE_POWER: "unite the last echoes of my power, and i will aid you",
  SCARAB_COLLECTED: "the scarab is sucked into portal",
  GET_OUT_OF_MY_WAY: "get out of my way",
  YOU_ARE_NOTHING: "you are nothing",
  I_AM_SORRY_APMEKEN: "i am sorry, apmeken",
  FORGIVE_ME_HET: "forgive me, het",
  SCABARAS: "scabaras..",
  CRONDIS: "crondis... it should have never come to this",
  BEND_THE_KNEE: "bend the knee",
  LIGHT_SNUFFED: "your light will be snuffed out, once and for all",
  NEW_DAWN: "a new dawn",
  NOT_BE_SUBJUGATED: "i will not be subjugated"
};

export const ALERT_MESSAGES = {
  PRAY_MELEE: "Pray Melee!",
  PRAY_RANGED: "Pray Ranged!",
  PRAY_MAGIC: "Pray Magic!",
  TRI_COLOUR_ATTACK: "Tri-Colour Attack Incoming!",
  TUMEKEN_CHARGE: "Time to charge",
  AMASCUT_ATTACKING: "Amascut attacking Tumeken!",
  NAME_CALLING: "NAME-CALLING MECHANIC!",
  NAME_CALLING_CRONDIS: "NAME-CALLING MECHANIC! NO SKULLS!",
  NAME_CALLING_SCABARAS: "NAME-CALLING MECHANIC! THROW SCARABS!",
  NW_VOKES: "NW Vokes!",
  SW_VOKES: "SW Vokes!",
  NE_VOKES: "NE Vokes! THROW SCARABS!",
  SE_VOKES: "SE Vokes!",
  BEND_KNEE_ATTACK: "Bend the Knee Attack Incoming!",
  GREEN_1: "Green 1 Active!",
  GREEN_2: "Green 2 Active!",
  KILL_DOGS: "KILL DOGS NOW!",
  STAND_BEHIND: "STAND BEHIND AMASCUT, KILL MINIONS!",
  ALL_SCARABS: "All scarabs collected!",
  SCARABS_PREFIX: "Scarabs: ",
  SCARABS_SKIPPED: "Scarabs Skipped",
  ABILITY_READY: "Ability ready!",
  BARRICADE_INCOMING: "Barricade incoming...",
  TIMER_CANCELED: "Timer canceled",
  MONITORING_CHAT: "Monitoring chat...",
  LOOKING_FOR_CHATBOX: "Looking for chatbox...",
  READY_MONITORING: "Ready - Monitoring chat...",
  SEARCHING: "Searching...",
  MECHANIC_ACTIVE: "Mechanic Active",
  INITIALIZING: "Initializing..."
};
