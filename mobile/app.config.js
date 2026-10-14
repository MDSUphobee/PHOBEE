import 'dotenv/config';
import { resolve } from 'path';

// Load .env shared with the web app
require('dotenv').config({ path: resolve(__dirname, '../web/.env') });

export default {
    expo: {
        name: "mobile",
        slug: "mobile",
        version: "1.0.0",
        orientation: "portrait",
        icon: "./assets/icon.png",
        userInterfaceStyle: "light",
        newArchEnabled: true,
        splash: {
            image: "./assets/splash-icon.png",
            resizeMode: "contain",
            backgroundColor: "#ffffff"
        },
        ios: {
            supportsTablet: true
        },
        android: {
            adaptiveIcon: {
                foregroundImage: "./assets/adaptive-icon.png",
                backgroundColor: "#ffffff"
            },
            edgeToEdgeEnabled: true
        },
        web: {
            favicon: "./assets/favicon.png"
        },
        extra: {
            urlMobileApp: process.env.URL_MOBILE_APP,
            eas: { projectId: "1351a371-bc93-4d5c-91bb-9064027f6d80" },
        },
        runtimeVersion: { policy: "appVersion" },
        updates: { url: "https://u.expo.dev/1351a371-bc93-4d5c-91bb-9064027f6d80" }
    }
};
