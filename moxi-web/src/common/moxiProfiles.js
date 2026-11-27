// Copyright (C) 2026 Moxi
const React = require('react');

const PRESET_AVATARS = [
    {
        id: 'moxi_neon',
        name: 'Moxi Emerald',
        accent: '#2FBF71',
        svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><radialGradient id="g1" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#1b3829"/><stop offset="100%" stop-color="#0a120e"/></radialGradient></defs><circle cx="50" cy="50" r="50" fill="url(#g1)"/><circle cx="50" cy="50" r="46" fill="none" stroke="#2FBF71" stroke-width="2.5"/><polygon points="32,68 50,30 68,68 50,55" fill="#2FBF71"/><polygon points="50,30 68,68 60,68 50,45 40,68 32,68" fill="#F2B51D"/></svg>'
    },
    {
        id: 'gold_crown',
        name: 'Gold Crown',
        accent: '#F2B51D',
        svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><radialGradient id="g2" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#36290e"/><stop offset="100%" stop-color="#0f0c05"/></radialGradient></defs><circle cx="50" cy="50" r="50" fill="url(#g2)"/><circle cx="50" cy="50" r="46" fill="none" stroke="#F2B51D" stroke-width="2.5"/><polygon points="26,64 30,36 44,50 50,30 56,50 70,36 74,64" fill="#F2B51D"/><circle cx="50" cy="27" r="3.5" fill="#2FBF71"/><circle cx="30" cy="33" r="3" fill="#2FBF71"/><circle cx="70" cy="33" r="3" fill="#2FBF71"/></svg>'
    },
    {
        id: 'cyber_cyan',
        name: 'Cyber Cyan',
        accent: '#00E5FF',
        svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><radialGradient id="g3" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#0e2a33"/><stop offset="100%" stop-color="#061014"/></radialGradient></defs><circle cx="50" cy="50" r="50" fill="url(#g3)"/><circle cx="50" cy="50" r="46" fill="none" stroke="#00E5FF" stroke-width="2.5"/><circle cx="50" cy="40" r="18" fill="#00E5FF" opacity="0.9"/><path d="M24,84 C26,64 40,62 50,62 C60,62 74,64 76,84" fill="#00E5FF" opacity="0.8"/></svg>'
    },
    {
        id: 'cinema_play',
        name: 'Cinema Ruby',
        accent: '#FF3366',
        svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><radialGradient id="g4" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#38101a"/><stop offset="100%" stop-color="#120407"/></radialGradient></defs><circle cx="50" cy="50" r="50" fill="url(#g4)"/><circle cx="50" cy="50" r="46" fill="none" stroke="#FF3366" stroke-width="2.5"/><polygon points="40,32 72,50 40,68" fill="#FF3366"/></svg>'
    },
    {
        id: 'galaxy_violet',
        name: 'Galaxy Violet',
        accent: '#A855F7',
        svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><radialGradient id="g5" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#2c1445"/><stop offset="100%" stop-color="#0e0517"/></radialGradient></defs><circle cx="50" cy="50" r="50" fill="url(#g5)"/><circle cx="50" cy="50" r="46" fill="none" stroke="#A855F7" stroke-width="2.5"/><polygon points="50,22 58,38 76,40 62,53 66,71 50,62 34,71 38,53 24,40 42,38" fill="#A855F7"/></svg>'
    },
    {
        id: 'stealth_ninja',
        name: 'Stealth Shadow',
        accent: '#10B981',
        svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><radialGradient id="g6" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#132620"/><stop offset="100%" stop-color="#080e0c"/></radialGradient></defs><circle cx="50" cy="50" r="50" fill="url(#g6)"/><circle cx="50" cy="50" r="46" fill="none" stroke="#10B981" stroke-width="2.5"/><rect x="26" y="42" width="48" height="14" rx="7" fill="#10B981"/><circle cx="38" cy="49" r="3.5" fill="#080e0c"/><circle cx="62" cy="49" r="3.5" fill="#080e0c"/></svg>'
    }
];

function svgToDataUrl(svgString) {
    if (typeof window !== 'undefined' && typeof window.btoa === 'function') {
        return 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(svgString)));
    }
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svgString);
}

const PRESET_MAP = {};
PRESET_AVATARS.forEach((p) => {
    p.dataUrl = svgToDataUrl(p.svg);
    PRESET_MAP[p.id] = p.dataUrl;
});

const STORAGE_PROFILES_KEY = 'moxi_profiles';
const STORAGE_ACTIVE_KEY = 'moxi_active_profile_id';
const EVENT_NAME = 'moxi-profile-changed';

function getProfiles() {
    if (typeof window === 'undefined') return [];
    try {
        const raw = localStorage.getItem(STORAGE_PROFILES_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
    } catch (_e) {
        // use default profile
    }
    // Default initial profile
    const defaultProfile = {
        id: 'profile_default',
        name: 'Primary',
        avatar: 'moxi_neon',
        isDefault: true,
        createdAt: Date.now()
    };
    try {
        localStorage.setItem(STORAGE_PROFILES_KEY, JSON.stringify([defaultProfile]));
        localStorage.setItem(STORAGE_ACTIVE_KEY, defaultProfile.id);
    } catch (_e) {
        // storage quota exceeded or unavailable
    }
    return [defaultProfile];
}

function getActiveProfile() {
    const list = getProfiles();
    if (typeof window === 'undefined') return list[0] || null;
    try {
        const activeId = localStorage.getItem(STORAGE_ACTIVE_KEY);
        const found = list.find((p) => p.id === activeId);
        if (found) return found;
    } catch (_e) {
        // ignore
    }
    return list[0] || null;
}

function setActiveProfile(id) {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(STORAGE_ACTIVE_KEY, id);
        window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { activeId: id } }));
    } catch (e) {
        console.error('Failed to setActiveProfile:', e);
    }
}

function saveProfile(profile) {
    if (typeof window === 'undefined') return;
    try {
        const list = getProfiles();
        const idx = list.findIndex((p) => p.id === profile.id);
        if (idx >= 0) {
            list[idx] = { ...list[idx], ...profile, updatedAt: Date.now() };
        } else {
            list.push({
                ...profile,
                id: profile.id || ('profile_' + Date.now()),
                createdAt: Date.now()
            });
        }
        localStorage.setItem(STORAGE_PROFILES_KEY, JSON.stringify(list));
        window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { profile } }));
    } catch (e) {
        console.error('Failed to saveProfile:', e);
    }
}

function deleteProfile(id) {
    if (typeof window === 'undefined') return;
    try {
        const list = getProfiles();
        if (list.length <= 1) return; // Keep at least one profile
        const filtered = list.filter((p) => p.id !== id);
        localStorage.setItem(STORAGE_PROFILES_KEY, JSON.stringify(filtered));
        const active = getActiveProfile();
        if (active.id === id) {
            setActiveProfile(filtered[0].id);
        } else {
            window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { deletedId: id } }));
        }
    } catch (e) {
        console.error('Failed to deleteProfile:', e);
    }
}

function resolveAvatarUrl(avatarValue, fallbackUrl) {
    if (!avatarValue) return fallbackUrl || PRESET_AVATARS[0].dataUrl;
    if (PRESET_MAP[avatarValue]) return PRESET_MAP[avatarValue];
    if (avatarValue.startsWith('data:') || avatarValue.startsWith('http://') || avatarValue.startsWith('https://')) {
        return avatarValue;
    }
    return fallbackUrl || PRESET_AVATARS[0].dataUrl;
}

function useMoxiProfile() {
    const [profiles, setProfiles] = React.useState(getProfiles);
    const [activeProfile, setActiveProfileState] = React.useState(getActiveProfile);

    React.useEffect(() => {
        const update = () => {
            setProfiles(getProfiles());
            setActiveProfileState(getActiveProfile());
        };
        window.addEventListener(EVENT_NAME, update);
        window.addEventListener('storage', update);
        return () => {
            window.removeEventListener(EVENT_NAME, update);
            window.removeEventListener('storage', update);
        };
    }, []);

    return {
        profiles,
        activeProfile,
        setActiveProfile,
        saveProfile,
        deleteProfile,
        resolveAvatarUrl
    };
}

module.exports = {
    PRESET_AVATARS,
    getProfiles,
    getActiveProfile,
    setActiveProfile,
    saveProfile,
    deleteProfile,
    resolveAvatarUrl,
    useMoxiProfile
};
