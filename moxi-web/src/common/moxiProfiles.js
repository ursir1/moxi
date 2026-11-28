// Copyright (C) 2026 Moxi
const React = require('react');

const PRESET_AVATARS = [
    {
        id: 'luffy',
        name: 'Monkey D. Luffy',
        category: 'Anime',
        accent: '#EF4444',
        url: 'images/avatars/luffy.png'
    },
    {
        id: 'zoro',
        name: 'Roronoa Zoro',
        category: 'Anime',
        accent: '#10B981',
        url: 'images/avatars/zoro.png'
    },
    {
        id: 'gojo',
        name: 'Satoru Gojo',
        category: 'Anime',
        accent: '#06B6D4',
        url: 'images/avatars/gojo.png'
    },
    {
        id: 'levi',
        name: 'Levi Ackerman',
        category: 'Anime',
        accent: '#64748B',
        url: 'images/avatars/levi.png'
    },
    {
        id: 'naruto',
        name: 'Naruto Uzumaki',
        category: 'Anime',
        accent: '#F97316',
        url: 'images/avatars/naruto.png'
    },
    {
        id: 'nami',
        name: 'Nami',
        category: 'Anime',
        accent: '#F59E0B',
        url: 'images/avatars/nami.png'
    },
    {
        id: 'nezuko',
        name: 'Nezuko Kamado',
        category: 'Anime',
        accent: '#EC4899',
        url: 'images/avatars/nezuko.png'
    },
    {
        id: 'mikasa',
        name: 'Mikasa Ackerman',
        category: 'Anime',
        accent: '#DC2626',
        url: 'images/avatars/mikasa.png'
    },
    {
        id: 'makima',
        name: 'Makima',
        category: 'Anime',
        accent: '#E11D48',
        url: 'images/avatars/makima.png'
    },
    {
        id: 'sailor_moon',
        name: 'Sailor Moon',
        category: 'Anime',
        accent: '#F472B6',
        url: 'images/avatars/sailor_moon.jpg'
    },
    {
        id: 'spiderman',
        name: 'Spider-Man',
        category: 'Comics & Heroes',
        accent: '#EF4444',
        url: 'images/avatars/spiderman.png'
    },
    {
        id: 'batman',
        name: 'Batman',
        category: 'Comics & Heroes',
        accent: '#3B82F6',
        url: 'images/avatars/batman.png'
    },
    {
        id: 'wednesday',
        name: 'Wednesday Addams',
        category: 'Pop Culture',
        accent: '#475569',
        url: 'images/avatars/wednesday.png'
    },
    {
        id: 'jinx',
        name: 'Jinx',
        category: 'Pop Culture',
        accent: '#3B82F6',
        url: 'images/avatars/jinx.png'
    },
    {
        id: 'pikachu',
        name: 'Pikachu',
        category: 'Kids & Cartoons',
        accent: '#EAB308',
        url: 'images/avatars/pikachu.png'
    },
    {
        id: 'spongebob',
        name: 'SpongeBob',
        category: 'Kids & Cartoons',
        accent: '#FACC15',
        url: 'images/avatars/spongebob.png'
    }
];

const PRESET_MAP = {};
PRESET_AVATARS.forEach((p) => {
    PRESET_MAP[p.id] = p.url;
});

const LEGACY_AVATAR_MIGRATION = {
    'pirate_straw': 'luffy',
    'gold_crown': 'spiderman',
    'kids_purple': 'pikachu',
    'shadow_red': 'batman',
    'cat_orange': 'naruto',
    'moxi_neon': 'gojo'
};

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
            avatar: 'luffy',
            isKid: false,
            isDefault: true,
            isLocked: false
        },
        {
            id: 'prof_family',
            name: 'Family',
            avatar: 'spiderman',
            isKid: false,
            isDefault: false,
            isLocked: true
        },
        {
            id: 'prof_kids',
            name: 'Kids',
            avatar: 'pikachu',
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

                // Migrate any legacy placeholder avatars to iconic character artwork
                cleaned.forEach((p) => {
                    if (LEGACY_AVATAR_MIGRATION[p.avatar]) {
                        p.avatar = LEGACY_AVATAR_MIGRATION[p.avatar];
                    }
                });

                // Ensure deduplication of Family and Kids profiles (case-insensitive)
                const deduped = [];
                let familyProf = null;
                let kidsProf = null;

                cleaned.forEach((p) => {
                    const normName = (typeof p.name === 'string') ? p.name.trim().toLowerCase() : '';
                    if (p.id === 'prof_family' || normName === 'family') {
                        if (!familyProf) {
                            familyProf = {
                                ...p,
                                id: 'prof_family',
                                name: 'Family',
                                isKid: false,
                                isLocked: true,
                                avatar: (p.avatar && p.avatar !== 'gold_crown') ? p.avatar : 'spiderman'
                            };
                            deduped.push(familyProf);
                        }
                    } else if (p.id === 'prof_kids' || normName === 'kids') {
                        if (!kidsProf) {
                            kidsProf = {
                                ...p,
                                id: 'prof_kids',
                                name: 'Kids',
                                isKid: true,
                                isLocked: true,
                                avatar: (p.avatar && p.avatar !== 'kids_purple') ? p.avatar : 'pikachu'
                            };
                            deduped.push(kidsProf);
                        }
                    } else {
                        deduped.push(p);
                    }
                });

                if (!familyProf) {
                    familyProf = prebuilt[1];
                    deduped.push(familyProf);
                }
                if (!kidsProf) {
                    kidsProf = prebuilt[2];
                    deduped.push(kidsProf);
                }

                if (deduped[0]) {
                    deduped[0].isDefault = true;
                    if (deduped[0].avatar === 'pirate_straw' || !deduped[0].avatar) {
                        deduped[0].avatar = 'luffy';
                    }
                }

                localStorage.setItem(STORAGE_PROFILES_KEY, JSON.stringify(deduped));
                return deduped;
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
    const defaultAvatar = PRESET_AVATARS[0].url;
    if (!avatarValue || typeof avatarValue !== 'string') {
        return fallbackUrl || defaultAvatar;
    }
    const resolvedId = LEGACY_AVATAR_MIGRATION[avatarValue] || avatarValue;
    if (PRESET_MAP[resolvedId]) {
        return PRESET_MAP[resolvedId];
    }
    if (resolvedId.startsWith('data:') || resolvedId.startsWith('http://') || resolvedId.startsWith('https://') || resolvedId.startsWith('images/')) {
        return resolvedId;
    }
    if (resolvedId.endsWith('.png') || resolvedId.endsWith('.jpg') || resolvedId.endsWith('.jpeg')) {
        return 'images/avatars/' + resolvedId;
    }
    return fallbackUrl || defaultAvatar;
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

// ── Content Safety Filters for Kids and Family ────────────────
const KID_MATURE_KEYWORDS = [
    'horror', 'erotic', 'porn', 'gore', '18+', 'mature',
    'slasher', 'erotica', 'nsfw', 'r-rated', 'adult', 'sex',
    'blood', 'demon', 'zombie', 'murder', 'crime', 'terror', 'violence'
];

const FAMILY_MATURE_KEYWORDS = [
    'erotic', 'porn', 'xxx', 'gore', 'slasher', 'erotica',
    'nudity', 'nsfw', 'hardcore', 'sadistic', 'graphic violence'
];

function isKidSafeItem(item) {
    if (!item) return false;
    const text = (
        (item.name || '') + ' ' +
        (Array.isArray(item.genres) ? item.genres.join(' ') : '') + ' ' +
        (item.description || '')
    ).toLowerCase();

    for (const kw of KID_MATURE_KEYWORDS) {
        if (text.includes(kw)) return false;
    }

    const friendly = ['animation', 'family', 'children', 'adventure', 'comedy', 'fantasy', 'disney', 'anime', 'pixar', 'cartoon'];
    return friendly.some((f) => text.includes(f));
}

function isFamilySafeItem(item) {
    if (!item) return false;
    const text = (
        (item.name || '') + ' ' +
        (Array.isArray(item.genres) ? item.genres.join(' ') : '') + ' ' +
        (item.description || '')
    ).toLowerCase();

    for (const kw of FAMILY_MATURE_KEYWORDS) {
        if (text.includes(kw)) return false;
    }
    return true;
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
    isFamilySafeItem,
    useMoxiProfile
};
