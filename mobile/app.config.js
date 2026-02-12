import 'dotenv/config';
import { resolve } from 'path';

// Load .env from parent directory
require('dotenv').config({ path: resolve(__dirname, '../.env') });

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
        }
    }
};
