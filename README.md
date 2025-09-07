# Barricade Timer - Alt1 Toolkit Plug-in

![Amascut, Goddess of Destruction](https://runescape.wiki/images/thumb/New_Boss_Out_Now-_Amascut%2C_Goddess_of_Destruction_%283%29_update_image.jpg/800px-New_Boss_Out_Now-_Amascut%2C_Goddess_of_Destruction_%283%29_update_image.jpg?a8cfa)

A RuneScape Alt1 Toolkit plug-in that monitors chat for boss phrases and provides timing assistance for the barricade ability.

## Features

- **Chat Monitoring**: Automatically detects Amascut's attack phrases and provides timing assistance
- **Dual Timer System**: 36-second timer for main attacks, 14-second timer for special phases
- **Timestamp Handling**: Automatically strips chat timestamps [HH:MM:SS] for accurate detection
- **Color Detection**: Reads Amascut's specific colors (Blue #458391 for boss name, Green #99FF99 for messages)
- **Visual Countdown**: Large, color-coded countdown display with "Detonation in:" header
- **Prayer Alerts**: Automatic prayer switching alerts for melee, ranged, and magic attacks
- **Mechanic Warnings**: Alerts for tri-colour attacks and name-calling phases
- **Scarab Counter**: Tracks scarab collection progress (0-4)
- **Cancellation Support**: Cancels timer when boss says "Enough" within 10 seconds
- **Auto-Reset**: Automatically returns to ready state after alerts

## How It Works

1. **Ready State**: Plugin monitors chat continuously for Amascut's phrases
2. **Trigger Detection**:
   - "Amascut, the Devourer: Tear them apart" → 36-second barricade timer
   - "Tumeken's heart, delivered to me by these mortals" → 14-second barricade timer
3. **Countdown Display**: Shows "Detonation in:" with remaining seconds and color coding:
   - Green: >10 seconds remaining
   - Yellow: 6-10 seconds remaining
   - Red: 1-5 seconds remaining
4. **Prayer Alerts**: Automatic alerts for attack types:
   - "Pray Melee!" (red) for melee attacks
   - "Pray Ranged!" (green) for ranged attacks
   - "Pray Magic!" (blue) for magic attacks
5. **Mechanic Warnings**:
   - "Tri-Colour Attack Incoming!" for multi-prayer attacks
   - "Bend the Knee Attack Incoming!" for bend the knee attack
   - "NAME-CALLING MECHANIC!" for voke positioning phase
   - "NW/SW/NE/SE Vokes!" for directional positioning
6. **Scarab Counter**: Tracks collection progress "Scarabs: X/4"
7. **Completion**: "All scarabs collected!" when 4 scarabs are thrown
8. **Cancellation**: "Enough" within 10 seconds cancels timer and shows "Scarabs Skipped"

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
