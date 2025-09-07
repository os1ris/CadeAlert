# Barricade Timer - Alt1 Toolkit Plug-in

A RuneScape Alt1 Toolkit plug-in that monitors chat for boss phrases and provides timing assistance for the barricade ability.

![Amascut, Goddess of Destruction](https://runescape.wiki/images/thumb/New_Boss_Out_Now-_Amascut%2C_Goddess_of_Destruction_%283%29_update_image.jpg/800px-New_Boss_Out_Now-_Amascut%2C_Goddess_of_Destruction_%283%29_update_image.jpg?a8cfa)

## Features

- **Chat Monitoring**: Automatically detects when Amascut says "Amascut, the Devourer: Tear them apart"
- **Timestamp Handling**: Automatically strips chat timestamps [HH:MM:SS] for accurate detection
- **Color Detection**: Configured to read Amascut's colors - Blue (#478291) for boss name, Green (#93f493) for messages
- **20-Second Timer**: Starts a countdown timer when the trigger phrase is detected
- **Visual Countdown**: Large, color-coded countdown display (Green → Yellow → Red)
- **Cancellation Support**: Cancels timer when boss says "Enough" and displays "Scarabs Skipped"
- **Auto-Reset**: Automatically returns to ready state after alerts

## How It Works

1. **Ready State**: Plug-in monitors chat continuously
2. **Trigger Detection**: When "Amascut, the Devourer: Tear them apart" is detected, timer starts
3. **Countdown**: Shows remaining seconds with color coding:
   - Green: 16-20 seconds
   - Yellow: 11-15 seconds
   - Red: 6-10 seconds
4. **Alert**: Displays "USE BARRICADE!" when timer reaches zero
5. **Cancellation**: If "Enough" is detected within 10 seconds of trigger, shows "Scarabs Skipped"

## Installation

To install CadeAlert copy & paste this link into your browser:
alt1://addapp/https://os1ris.github.io/CadeAlert/appconfig.json

Or go to this URL in the alt1 browser:
https://os1ris.github.io/CadeAlert/

## Files

- `appconfig.json` - App configuration
- `index.html` - UI layout
- `app.js` - Main logic
- `assets/` - Icon assets

## Debug Functions

For testing purposes, you can use these console commands:
- `debugStartTimer()` - Manually start the timer
- `debugCancelTimer()` - Manually cancel the timer

## Requirements

- Alt1 Toolkit installed
- RuneScape client running
- Chat window visible on screen

## Troubleshooting

**If you see "A1lib is not defined":**
- Make sure you're running the plug-in in Alt1 Toolkit, not a regular browser
- The plug-in requires Alt1's special libraries to function
- Try refreshing the page or re-adding the app

