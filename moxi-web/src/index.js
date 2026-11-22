// Copyright (C) 2017-2023 Smart code 203358507

if (typeof process.env.SENTRY_DSN === 'string') {
    const Sentry = require('@sentry/browser');
    Sentry.init({ dsn: process.env.SENTRY_DSN });
}

const Bowser = require('bowser');
const browser = Bowser.parse(window.navigator?.userAgent || '');
if (browser?.platform?.type === 'desktop') {
    document.querySelector('meta[name="viewport"]')?.setAttribute('content', '');
}

const React = require('react');
const ReactDOM = require('react-dom/client');
const { HashRouter } = require('react-router-dom');
const i18n = require('i18next');
const { initReactI18next } = require('react-i18next');
const stremioTranslations = require('stremio-translations');
const App = require('./App');
const { default: WebUpdateScreen } = require('./App/WebUpdateScreen');
const { CoreProvider } = require('./core');
const { FileDropProvider, PlatformProvider } = require('./common');
const { WindowFocusedProvider } = require('./common/useRouteFocused');
const { name: os } = require('./common/Platform/device');

const translations = Object.fromEntries(Object.entries(stremioTranslations()).map(([key, value]) => [key, {
    translation: {
        ...value,
        ABOUT_STREMIO: 'About Moxi',
        UPDATER_TITLE: 'A new version of Moxi is available',
        UPGRADE: 'New version is available! Upgrade to the latest Moxi version',
        MANUAL_UPDATE_TITLE: 'Update your Moxi version',
        MANUAL_UPDATE_LINE1: 'You are running an outdated version of Moxi which is highly unrecommended.',
        RELAUNCH: 'Re-launch Moxi now!',
        ADDONS_OFFICIAL: 'Official Moxi Addons',
        DISCOVER_NOADDON_WARNING: 'Warning: no Moxi addon active for this type. Showing saved items, nothing here will update.',
        STORAGE_FULL_TEXT: 'Moxi will not be able to save your settings, preferences or login information. Consider re-starting or re-installing Moxi.',
        GUEST_LOGIN_NOTICE: 'Guest Login is not recommended. Using a regular login allows Moxi to sync your Library and receive notifications for favourite series/channels. Are you sure you want to proceed?',
        GUEST_LOGIN_NOTICE_2: 'Guest Login is not recommended - you won\'t have synced Library and Board notifications, which are vital Moxi features. Are you sure you want to proceed?',
        RECEIVE_UPDATES_EMAIL: 'Receive updates to your email from Moxi',
        EXTERNAL_OPENING_YOUTUBE: 'You are leaving Moxi and opening YouTube. Are you sure?',
        EXTERNAL_OPENING_APP: 'You are leaving Moxi to open another app. Are you sure?',
        LIB_EMPTY_BEST: 'Sign up to get the best of Moxi',
        RESTART_REQUIRED_MESSAGE: 'Moxi needs to restart for this setting to take effect.',
        MOBILE_LOG_INTO: 'Log in to your Moxi account ',
        MOBILE_NO_ADDON_ACTIVE: 'No Moxi addon active for this type.',
        SETTINGS_PLAN_SUPPORTERS: 'Moxi Supporters'
    }
}]));

i18n
    .use(initReactI18next)
    .init({
        resources: translations,
        lng: 'en-US',
        fallbackLng: 'en-US',
        interpolation: {
            escapeValue: false
        }
    });

const appInfo = {
    appVersion: process.env.VERSION,
    shellVersion: null,
    platform: globalThis.chrome?.webview ? 'desktop' : 'web',
    os,
    notificationTemplates: ['prompt', 'spotlight-intro']
};

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(
    <React.StrictMode>
        <PlatformProvider>
            <CoreProvider appInfo={appInfo}>
                <FileDropProvider>
                    <HashRouter>
                        <WindowFocusedProvider>
                            <WebUpdateScreen />
                            <App />
                        </WindowFocusedProvider>
                    </HashRouter>
                </FileDropProvider>
            </CoreProvider>
        </PlatformProvider>
    </React.StrictMode>
);
