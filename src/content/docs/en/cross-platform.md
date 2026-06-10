---
title: "Cross-Platform Features"
description: "Grix is built on Flutter for full coverage across 7 platforms (iOS, Android, macOS, Windows, Linux, Web, HarmonyOS) with deep platform-specific adaptations."
order: 14
---

Grix is built on Flutter for full coverage across 7 platforms, with deep platform-specific adaptations.

For quick installation and setup instructions after downloading, please refer to the [Quick Start](./quick-start).

## Platform Features

| Platform | Key Capabilities | Download |
|----------|-----------------|----------|
| iOS | Push notifications, camera QR scanning, Apple Sign-In, CallKit | [TestFlight](https://testflight.apple.com/join/D8SRWBam) |
| Android | Push notifications, camera QR scanning, Google Sign-In | [APK Download](https://github.com/askie/grix/releases/latest/download/Grix-Android.apk) |
| macOS | System tray, agent toolbar, file drag-and-drop | [macOS Download](https://github.com/askie/grix/releases/latest/download/Grix-macOS.zip) |
| Windows | System tray, agent toolbar, auto-start on boot | [Windows Download](https://github.com/askie/grix/releases/latest/download/Grix-Windows.zip) |
| Linux | System tray, agent toolbar | [Linux Download](https://github.com/askie/grix/releases/latest/download/Grix-Linux-x64.tar.gz) |
| Web (PWA) | Offline caching, browser notifications, Service Worker | [Use Online](https://grix.im) |
| HarmonyOS | Native adaptation | Coming soon |

## Web Version

PWA support (install to desktop, offline caching), browser notifications, file drag-and-drop upload.

## Desktop Version

System tray, auto-start on boot, agent toolbar, right-click context menu, keyboard shortcuts, file drag-and-drop.

## Mobile Version

Push notifications (APNs/FCM), camera QR scanning, photo gallery, full-screen incoming call UI.

## Data Sync

- Local SQLite cache
- WebSocket persistent connection for real-time sync
- Offline messages automatically sync after reconnection
- Real-time sync across devices

## Version Updates

In-app new version detection, forced/optional update prompts.
