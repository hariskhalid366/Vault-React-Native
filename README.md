# Vault - Secure File Storage & VPN

Vault is a comprehensive privacy application built with React Native. It allows users to securely store and manage their sensitive photos, videos, and audio files, while also providing built-in VPN protection using WireGuard.

## 🚀 Features

### 🔒 Secure Storage (Vault)

- **Media Protection:** Hide photos and videos from your gallery.
- **Audio Vault:** Securely store private audio recordings.
- **File Management:** Organize files into folders, move items, and manage your vault effortlessly.
- **Asset Viewer:** Built-in viewer for images and videos with smooth animations.

### 🛡️ Privacy & Security

- **Biometric Lock:** Secure the app with Fingerprint or Face ID.
- **Pin Protection:** Fallback PIN support for access.
- **VPN Service:** Integrated WireGuard VPN for secure and anonymous internet browsing.
- **Private Browser:** Built-in web browser for private surfing.

### ☁️ Backup & Sync

- **Cloud Backup:** Integration with Google Sign-In to backup your vault configuration.
- **Restore:** Easily restore your settings and data.

### 🎨 Customization

- **Theming:** Support for Dark and Light themes.
- **Customization:** Adjust lock settings and app preferences.

## 🛠️ Tech Stack

- **Framework:** React Native
- **Language:** TypeScript
- **Storage:** MMKV (High-performance storage), React Native FS
- **VPN:** `wireguard-native-bridge`
- **Media:** `react-native-camera-roll`, `react-native-video`, `react-native-faster-image`
- **Navigation:** React Navigation
- **UI/Animations:** React Native Reanimated, Lucide Icons

## 📦 Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/hariskhalid366/Vault.git
    cd Vault
    ```

2.  **Install dependencies:**

    ```bash
    yarn install
    # or
    npm install
    ```

3.  **Install Pods (iOS only):**

    ```bash
    cd ios && pod install && cd ..
    ```

4.  **Run the app:**

    ```bash
    # Android
    yarn android

    # iOS
    yarn ios
    ```

## 📝 Configuration

### VPN Configuration

The app uses a `vpn.conf` file or internal configuration for WireGuard. Ensure you have valid WireGuard credentials if you plan to use the VPN feature.

## 👤 Author

**Haris Khalid**

- 📧 Email: [hariskhalid366@gmail.com](mailto:hariskhalid366@gmail.com)

---

_Built with ❤️ by Haris Khalid_
