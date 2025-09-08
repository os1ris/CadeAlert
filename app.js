// Barricade Timer Alt1 Toolkit Plug-in
// Monitors chat for boss phrases and provides timing for barricade ability

// Enable "Add App" button for Alt1 Browser
A1lib.identifyApp("appconfig.json");

// Import all modules
import { initializeChatReader } from './modules/chat.js';

// Initialize the application
console.log('🚀 Starting Barricade Timer...');
initializeChatReader();
