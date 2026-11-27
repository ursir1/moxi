// Copyright (C) 2026 Moxi
const React = require('react');

const PRESET_AVATARS = [
    {
        id: 'pirate_straw',
        name: 'Straw Pirate',
        accent: '#F59E0B',
        svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><radialGradient id="g_pir" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#0284c7"/><stop offset="100%" stop-color="#082f49"/></radialGradient></defs><rect width="100" height="100" rx="22" fill="url(#g_pir)"/><ellipse cx="50" cy="42" rx="40" ry="14" fill="#d97706"/><ellipse cx="50" cy="38" rx="22" ry="16" fill="#f59e0b"/><rect x="28" y="36" width="44" height="6" fill="#dc2626"/><ellipse cx="50" cy="60" rx="20" ry="18" fill="#fef3c7"/><circle cx="42" cy="58" r="5" fill="#18181b"/><circle cx="58" cy="58" r="5" fill="#18181b"/><polygon points="50,64 47,68 53,68" fill="#18181b"/><rect x="42" y="72" width="16" height="4" rx="2" fill="#18181b"/></svg>'
    },
    {
        id: 'gold_crown',
        name: 'Family Crown',
        accent: '#F2B51D',
        svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><radialGradient id="g2" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#36290e"/><stop offset="100%" stop-color="#0f0c05"/></radialGradient></defs><rect width="100" height="100" rx="22" fill="url(#g2)"/><polygon points="26,64 30,36 44,50 50,30 56,50 70,36 74,64" fill="#F2B51D"/><circle cx="50" cy="27" r="3.5" fill="#2FBF71"/><circle cx="30" cy="33" r="3" fill="#2FBF71"/><circle cx="70" cy="33" r="3" fill="#2FBF71"/></svg>'
    },
    {
        id: 'kids_purple',
        name: 'Kids Wonder',
        accent: '#A855F7',
        svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><radialGradient id="g_kid" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#9333ea"/><stop offset="100%" stop-color="#3b0764"/></radialGradient></defs><rect width="100" height="100" rx="22" fill="url(#g_kid)"/><ellipse cx="50" cy="55" rx="24" ry="26" fill="#fed7aa"/><path d="M26,45 C28,26 40,24 50,24 C60,24 72,26 74,45 C70,36 58,35 50,36 C42,35 30,36 26,45 Z" fill="#27272a"/><ellipse cx="40" cy="54" rx="5" ry="6" fill="#18181b"/><ellipse cx="60" cy="54" rx="5" ry="6" fill="#18181b"/><circle cx="42" cy="52" r="2" fill="#ffffff"/><circle cx="62" cy="52" r="2" fill="#ffffff"/><ellipse cx="50" cy="68" rx="5" ry="4" fill="#e11d48"/></svg>'
    },
    {
        id: 'shadow_red',
        name: 'Shadow Dark',
        accent: '#EF4444',
        svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><radialGradient id="g_sh" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#ef4444"/><stop offset="100%" stop-color="#7f1d1d"/></radialGradient></defs><rect width="100" height="100" rx="22" fill="url(#g_sh)"/><path d="M22,25 C26,15 40,32 50,42 C60,32 74,15 78,25 C82,38 72,55 70,68 C68,78 62,88 50,88 C38,88 32,78 30,68 C28,55 18,38 22,25 Z" fill="#18181b"/><polygon points="35,28 50,45 65,28" fill="#dc2626"/><circle cx="42" cy="52" r="5" fill="#facc15"/><circle cx="58" cy="52" r="5" fill="#facc15"/><circle cx="42" cy="52" r="2.5" fill="#dc2626"/><circle cx="58" cy="52" r="2.5" fill="#dc2626"/><ellipse cx="50" cy="62" rx="12" ry="7" fill="#f4f4f5"/></svg>'
    },
    {
        id: 'cat_orange',
        name: 'Curious Cat',
        accent: '#06B6D4',
        svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><radialGradient id="g_cat" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#0891b2"/><stop offset="100%" stop-color="#164e63"/></radialGradient></defs><rect width="100" height="100" rx="22" fill="url(#g_cat)"/><polygon points="25,28 35,50 18,48" fill="#ea580c"/><polygon points="75,28 65,50 82,48" fill="#ea580c"/><ellipse cx="50" cy="58" rx="28" ry="24" fill="#f97316"/><circle cx="38" cy="52" r="9" fill="#facc15"/><circle cx="62" cy="52" r="9" fill="#facc15"/><ellipse cx="38" cy="52" rx="4" ry="7" fill="#0f172a"/><ellipse cx="62" cy="52" rx="4" ry="7" fill="#0f172a"/><polygon points="50,62 46,66 54,66" fill="#fda4af"/><path d="M46,68 Q50,71 54,68" stroke="#0f172a" stroke-width="2" fill="none"/></svg>'
    },
    {
        id: 'moxi_neon',
        name: 'Moxi Emerald',
        accent: '#2FBF71',
        svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><radialGradient id="g1" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#1b3829"/><stop offset="100%" stop-color="#0a120e"/></radialGradient></defs><rect width="100" height="100" rx="22" fill="url(#g1)"/><circle cx="50" cy="50" r="38" fill="none" stroke="#2FBF71" stroke-width="3"/><polygon points="34,68 50,32 66,68 50,56" fill="#2FBF71"/><polygon points="50,32 66,68 58,68 50,46 42,68 34,68" fill="#F2B51D"/></svg>'
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
const STORAGE_WATCHED_PREFIX = 'moxi_profile_watched_';
const EVENT_NAME = 'moxi-profile-changed';
const WATCHED_EVENT_NAME = 'moxi-profile-watched-changed';

function getPrebuiltProfiles(accountName) {
    const primaryName = (typeof accountName === 'string' && accountName.trim().length > 0) ?
        accountName.trim() :
        'My Profile';
    return [
        {
            id: 'prof_primary',
            name: primaryName,
            avatar: 'pirate_straw',
            isKid: false,
            isDefault: true,
            isLocked: false
        },
        {
            id: 'prof_family',
            name: 'Family',
            avatar: 'gold_crown',
            isKid: false,
            isDefault: false,
            isLocked: true
        },
        {
            id: 'prof_kids',
            name: 'Kids',
            avatar: 'kids_purple',
            isKid: true,
            isDefault: false,
            isLocked: true
        }
    ];
}

function getProfiles() {
    const prebuilt = getPrebuiltProfiles();
    if (typeof window === 'undefined') return prebuilt;
    try {
        const raw = localStorage.getItem(STORAGE_PROFILES_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length > 0) {
                // Filter out any stale dummy names from initial demos
                const cleaned = parsed.filter((p) => p.name !== 'Khadar' && p.name !== 'Malik Oskar' && p.name !== 'Faiza' && p.id !== 'prof_khadar' && p.id !== 'prof_malik' && p.id !== 'prof_faiza');

                // Ensure Family profile exists and has locked name
                let familyProf = cleaned.find((p) => p.id === 'prof_family' || p.name === 'Family');
                if (!familyProf) {
                    familyProf = prebuilt[1];
                    cleaned.push(familyProf);
                } else {
                    familyProf.id = 'prof_family';
                    familyProf.name = 'Family';
                    familyProf.isLocked = true;
                }

                // Ensure Kids profile exists and has locked name + isKid
                let kidsProf = cleaned.find((p) => p.id === 'prof_kids' || p.name === 'Kids');
                if (!kidsProf) {
                    kidsProf = prebuilt[2];
                    cleaned.push(kidsProf);
                } else {
                    kidsProf.id = 'prof_kids';
                    kidsProf.name = 'Kids';
                    kidsProf.isKid = true;
                    kidsProf.isLocked = true;
                }

                if (cleaned[0]) {
                    cleaned[0].isDefault = true;
                }

                localStorage.setItem(STORAGE_PROFILES_KEY, JSON.stringify(cleaned));
                return cleaned;
            }
        }
    } catch (_e) {
        // fallback
    }

    try {
        localStorage.setItem(STORAGE_PROFILES_KEY, JSON.stringify(prebuilt));
        localStorage.setItem(STORAGE_ACTIVE_KEY, prebuilt[0].id);
    } catch (_e) {
        // quota exceeded
    }
    return prebuilt;
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
            // Respect locked names for Family and Kids
            const current = list[idx];
            const lockedName = current.isLocked ? current.name : profile.name;
            const isKidVal = current.id === 'prof_kids' ? true : profile.isKid;

            list[idx] = {
                ...current,
                ...profile,
                name: lockedName,
                isKid: isKidVal,
                updatedAt: Date.now()
            };
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
        // Cannot delete Family, Kids, or Default primary profile
        if (id === 'prof_primary' || id === 'prof_family' || id === 'prof_kids') {
            return;
        }
        const list = getProfiles();
        if (list.length <= 1) return;
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

// ── Per-Profile Watch History Isolation ──────────────────────
function getProfileWatchedIds(profileId) {
    if (typeof window === 'undefined') return new Set();
    try {
        const id = profileId || getActiveProfile()?.id || 'prof_primary';
        const raw = localStorage.getItem(STORAGE_WATCHED_PREFIX + id);
        if (raw) {
            const arr = JSON.parse(raw);
            if (Array.isArray(arr)) return new Set(arr);
        }
    } catch (_e) {
        // fallback
    }
    return new Set();
}

function addProfileWatchedId(profileId, itemId) {
    if (typeof window === 'undefined' || !itemId) return;
    try {
        const id = profileId || getActiveProfile()?.id || 'prof_primary';
        const set = getProfileWatchedIds(id);
        set.add(String(itemId));
        localStorage.setItem(STORAGE_WATCHED_PREFIX + id, JSON.stringify(Array.from(set)));
        window.dispatchEvent(new CustomEvent(WATCHED_EVENT_NAME, { detail: { profileId: id, itemId } }));
    } catch (_e) {
        // storage quota exceeded
    }
}

function removeProfileWatchedId(profileId, itemId) {
    if (typeof window === 'undefined' || !itemId) return;
    try {
        const id = profileId || getActiveProfile()?.id || 'prof_primary';
        const set = getProfileWatchedIds(id);
        set.delete(String(itemId));
        localStorage.setItem(STORAGE_WATCHED_PREFIX + id, JSON.stringify(Array.from(set)));
        window.dispatchEvent(new CustomEvent(WATCHED_EVENT_NAME, { detail: { profileId: id, itemId } }));
    } catch (_e) {
        // ignore
    }
}

// ── Kids Safe Content Filter ────────────────────────────────
const MATURE_KEYWORDS = [
    'horror', 'erotic', 'porn', 'gore', '18+', 'mature',
    'slasher', 'erotica', 'nsfw', 'r-rated', 'adult'
];

function isKidSafeItem(item) {
    if (!item) return false;
    const name = String(item.name || '').toLowerCase();
    const genres = Array.isArray(item.genres) ? item.genres.map((g) => String(g).toLowerCase()) : [];

    for (const kw of MATURE_KEYWORDS) {
        if (name.includes(kw)) return false;
        if (genres.some((g) => g.includes(kw))) return false;
    }

    // Must match kid/family categories or general animation/comedy
    const isFriendly = genres.some((g) =>
        g.includes('animation') ||
        g.includes('family') ||
        g.includes('children') ||
        g.includes('comedy') ||
        g.includes('adventure') ||
        g.includes('fantasy')
    );

    return isFriendly || genres.length === 0;
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
    getPrebuiltProfiles,
    getProfiles,
    getActiveProfile,
    setActiveProfile,
    saveProfile,
    deleteProfile,
    resolveAvatarUrl,
    getProfileWatchedIds,
    addProfileWatchedId,
    removeProfileWatchedId,
    isKidSafeItem,
    useMoxiProfile
};
