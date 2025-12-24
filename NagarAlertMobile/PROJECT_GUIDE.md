# NagarAlertHub Project Guide

This document provides a comprehensive overview of the **NagarAlertMobile** application, its technology stack, dependencies, and instructions on how to set up and run the project.

## 1. Project Overview

**NagarAlertMobile** is a React Native mobile application built using the Expo framework. Based on the components (Maps, Location, Chat), it appears to be a location-based alert or community safety application allowing users to report incidents or view alerts on a map.

### Directory Structure
The project follows a clean architecture pattern:
- **`src/screens/`**: Contains the Visual components (pages) of the app (e.g., Home, Chat).
- **`src/navigation/`**: Handles moving between different screens (Routing).
- **`src/services/`**: likely contains logic for external API communication (using Axios).
- **`assets/`**: Images, icons, and splash screens.
- **`App.js`**: The main entry point that initializes the app and navigation.

---

## 2. Technology Stack

This project is built using:
- **Core Framework**: [React Native](https://reactnative.dev/) (v0.81.5) - Allows building native apps using JavaScript/React.
- **Dev Platform**: [Expo](https://expo.dev/) (v~54.0.30) - Toolchain to simplify React Native development, testing, and deployment.
- **Language**: JavaScript (ES6+).

---

## 3. Package Explanations (Dependencies)

Here is a list of every package currently used in the project and its purpose:

### Core Dependencies
- **`expo`**: The core Expo SDK library.
- **`react`**: The library for building the user interface.
- **`react-native`**: The actual framework that renders React components to native iOS/Android views.
- **`expo-status-bar`**: Controls the status bar (battery/clock area) appearance.

### Navigation
- **`@react-navigation/native`**: Core navigation library.
- **`@react-navigation/native-stack`**: Provides stack-based navigation (pushing screens on top of each other).
- **`react-native-screens`**: Optimization library for navigation to use native screen primitives.
- **`react-native-safe-area-context`**: Handles safe area insets (notches, home indicators) on modern phones.

### Features & Utilities
- **`axios`**: A promise-based HTTP client used for making API requests to a backend server.
- **`expo-location`**: Provides access to the device's GPS and location services.
- **`react-native-maps`**: Renders Apple Maps (iOS) or Google Maps (Android) within the app.
- **`expo-image-picker`**: Allows the user to select images from the gallery or take a photo with the camera.

---

## 4. How to Create and Run the App

If you were to recreate this app or run it on a new machine, follow these steps:

### Prerequisites
1.  **Node.js**: Ensure Node.js is installed on your computer.
2.  **Expo Go App**: Install "Expo Go" on your physical Android or iOS device.

### Setup Instructions

1.  **Navigate to the project directory**:
    Open a terminal and go to the mobile app folder:
    ```bash
    cd NagarAlertMobile
    ```

2.  **Install Dependencies**:
    Run the following command to download all packages listed above:
    ```bash
    npm install
    ```

3.  **Start the Development Server (Expo Go)**:
    Launch the Metro bundler:
    ```bash
    npx expo start
    ```
    - Press `a` to run on an Android Emulator (if set up).
    - Press `i` to run on an iOS Simulator (Mac only).
    - **Scan the QR Code**: Use the "Expo Go" app on your phone to scan the QR code displayed in the terminal to run it on your physical device.

> Note: Expo Go has limitations for some features (e.g., remote push notifications and some background services). See the section below for development builds.

---

## 5. Remote Push Notifications and Dev Builds

Remote push notifications via `expo-notifications` are not supported in Expo Go starting SDK 53+. Use a Development Build to test remote push and background services.

### Config in this app
- `app.json` includes the `expo-notifications` plugin and Android channel defaults.
- Android notification channel is created at runtime in `src/services/notificationService.js`.

### Build a Dev Client (Android)
Option A: Local dev build (no EAS account required):
```bash
cd NagarAlertMobile
npx expo run:android
npx expo start --dev-client
```

Option B: EAS development build (recommended):
```bash
npm i -g eas-cli
cd NagarAlertMobile
eas login
eas init  # if prompted
eas build --profile development --platform android
npx expo start --dev-client
```

### Optional: FCM Setup for Production
1. Create a Firebase project and enable Cloud Messaging.
2. Download `google-services.json` for Android and place it at the project root of `NagarAlertMobile`.
3. Reference it in `app.json` under `android.googleServicesFile`:
```json
{
    "expo": {
        "android": {
            "googleServicesFile": "./google-services.json"
        }
    }
}
```
4. In EAS dashboard, upload your FCM server credentials to enable Expo Push service.

---

### Creating a New Project (Reference)
If you wanted to start a *new* project like this from scratch, you would run:
```bash
npx create-expo-app@latest MyNewApp
cd MyNewApp
npx expo install react-native-maps expo-location axios # ...and other packages
```
