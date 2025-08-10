# Formacer

## Description
Formacer is a Chrome extension designed to enhance your browsing experience by intelligently autofilling forms across various websites. It leverages Google's Gemini AI to make smart autofill decisions based on the data you provide, ensuring a seamless and efficient form-filling process. Emphasizing user privacy, Formacer ensures that all your form data remains securely on your local machine and is never collected or stored by the extension itself.

## Installation

### Local Setup

Step 1: Installation And Build

```bash
npm install
npm run build:chrome-dev
```

Step 2: Load Extension in Chrome

Go to `chrome://extensions/` in your Chrome browser, enable "Developer mode" (usually a toggle in the top right), click `Load Unpacked`, and select the `dist/chrome` directory from your project.

## Features
- **Intelligent Autofill:** Utilizes Google's Gemini AI for smart and accurate form autofill decisions. The type of inputs the extension can autofill covered range from text inputs, paragraph inputs, dropdown selections, radio buttons, checkboxes and much more.
- **Privacy-Focused:** All form data is stored locally on your machine; no personal data is collected or stored by the extension.
- **Profile Management:** Allows users to manage different profiles for various autofill scenarios.
- **Customizable Details:** Users can add and manage custom details to expand autofill capabilities.

## Project Structure

```
.
├── public/                 # Public assets
├── src/                    # Source code
│   ├── assets/             # Static assets (images, styles)
│   ├── background/         # Background service worker for extension logic
│   │   ├── services/       # Background services (LLM, prompts)
│   ├── components/         # Reusable Vue components
│   │   ├── auth/           # Authentication-related components (e.g., AuthGuard)
│   │   └── state/          # Components for displaying UI states (loading, error)
│   ├── composables/        # Vue composables for reusable logic
│   ├── content-script/     # Scripts injected into web pages
│   │   ├── extractor/      # Logic for extracting form elements
│   │   └── utils/          # Utility functions for content scripts
│   ├── locales/            # Internationalization files
│   ├── offscreen/          # Offscreen document for certain Chrome API calls
│   ├── stores/             # Pinia stores for state management (settings, details)
│   ├── types/              # TypeScript type definitions
│   ├── ui/                 # User interface entry points
│   │   ├── action-popup/   # Popup UI when clicking extension icon
│   │   ├── common/         # Common UI pages (privacy, terms)
│   │   ├── options-page/   # Options page UI
│   │   └── setup/          # Setup/installation UI
│   └── utils/              # General utility functions
├── .env*                   # Environment variables
├── manifest.config.ts      # Manifest V3 configuration
├── package.json            # Project dependencies and scripts
├── tailwind.config.cjs     # Tailwind CSS configuration
├── vite.config.ts          # Vite build configuration
└── README.md               # Project README
