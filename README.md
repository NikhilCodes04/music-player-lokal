# 🎵 React Native Music Player (JioSaavn)

A production-grade music streaming application built with **React Native (Expo)** using the **JioSaavn public API**. This project prioritizes **architecture correctness, state synchronization, and reliable audio playback**.

---

## 🚀 Features

- **Home Feed**: Curated discovery feeds with specific logic for "Suggested", "Songs", "Artists", and "Albums".
- **Search**: Comprehensive search functionality for Songs, Albums, Artists, and Playlists.
- **Robust Audio Player**:
    - **Full Player**: Standard playback controls, artwork, and scrubbing.
    - **Mini Player**: Persistent playback bar visible across the app.
    - **Background Playback**: Continues playing audio when the app is backgrounded.
- **Queue Management**: Single global queue with replace-and-play behavior.
- **Offline Capabilities**: Architecture supports local file paths (though full download manager is out of scope).

---

## 🛠 Tech Stack

- **Framework**: React Native (via Expo 52)
- **Language**: TypeScript
- **Navigation**: React Navigation v6+ (Stack & Bottom Tabs)
- **State Management**:
    - **Client State**: `zustand` (Player, Queue, Flags)
    - **Server State**: `@tanstack/react-query` (API data, Caching)
- **Audio Engine**: `react-native-track-player`
- **Storage**: `react-native-mmkv` (High-performance synchronous storage)
- **UI/Styling**: Custom components, `react-native-svg`

---

## 🏗 Architecture & Implementation Details

This project follows a **Feature-First** architecture to ensure scalability and separation of concerns.

### Folder Structure
```text
src/
 ├─ app/                 # App entry, navigation, and global providers
 ├─ features/            # Feature-based modules (home, search, player, etc.)
 │   ├─ home/
 │   ├─ search/
 │   ├─ player/
 │   └─ queue/
 ├─ services/            # API clients and external service integrations
 ├─ shared/              # Reusable components, theme, and utilities
 └─ storage/             # MMKV storage instances and keys
```

### 1. State Management Strategy
We use a strict separation of concerns for state:
-   **Server State (React Query)**: Used for all data fetching (Songs, Search Results, Artist Details). This ensures data freshness and handles caching automatically.
-   **Client State (Zustand)**: Used for synchronous UI state (Player status, Queue, Theme).
-   **Rule**: Server data and Playback state are **never mixed**.

### 2. Audio Playback Engine
The playback flow is unidirectional to prevent desync:
`UI` → `player.store` → `player.engine` → `TrackPlayer`

-   **UI**: Never calls `TrackPlayer` methods directly.
-   **Player Store**: Expresses the *intent* (e.g., "User wants to play song X").
-   **Player Engine**: Listens to store changes and performs the side effects on `TrackPlayer`.
-   **Persistence**: Queue order, current track, and repeat modes are persisted via MMKV. Playback position is intentionally *not* persisted to always restart fresh.

### 3. Home Screen Logic
The "Suggested" feed is constructed using a specific logic since the API lacks a true "trending" endpoint:
1.  We define a set of seed queries (e.g., "arijit", "bollywood").
2.  Fetch songs for all these queries.
3.  Merge and deduplicate results on the client side.
This logic is encapsulated in `features/home/home.hooks.ts`.

---

## ⚖️ Tradeoffs & Design Decisions

1.  **No Expo Router**: We opted for standard **React Navigation**. While Expo Router is newer, React Navigation offers more explicit control over the complex stack/tab nesting required for a persistent Mini Player.
2.  **Queue Behavior**: Tapping a song **replaces the entire queue** instead of appending. This simplifies the UX and state management for a mobile-first experience.
3.  **Audio Quality**: defaults to 160kbps with a fallback to 96kbps. We ignore 320kbps streams to ensure stability and lower bandwidth usage.
4.  **Offline Support**: We support playing from local file paths, but a full "Download Manager" (pausing, resuming, background downloading) was omitted to keep the scope focused on Player Architecture accuracy.

---

## 💻 Setup & Installation

### Prerequisites
-   Node.js (LTS)
-   **Android NDK**: Version **26.1.10909125** is strictly required. Use the SDK Manager in Android Studio to install this specific version to avoid C++ linker errors with `expo-modules-core`.

### Installation Steps

1.  **Clone the repository**
    ```bash
    git clone <repo-url>
    cd music-player
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Prebuild (Important for Native Modules)**
    Since we use `react-native-track-player` and `mmkv`, we cannot use Expo Go. We must prebuild.
    ```bash
    npx expo prebuild
    ```

4.  **Run on Android**
    ```bash
    npx expo run:android
    ```
    *Note: Ensure an Android Emulator is running or a device is connected.*

5.  **Run on iOS** (Mac only)
    ```bash
    npx expo run:ios
    ```

### Troubleshooting
-   **Build Fails (C++ Errors)**: Verify your NDK version in `android/app/build.gradle`. It must match `26.1.10909125`.
-   **TrackPlayer Issues**: If the player doesn't start, ensure you are not debugging with "JS Debugging" enabled, as it can interfere with the native bridge in some environments.
