// Copyright (C) 2026 Moxi
const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('@stremio/stremio-icons/react').default;
const { useProfile } = require('stremio/common');
const useBoard = require('stremio/routes/Board/useBoard');
const {
    PRESET_AVATARS,
    useMoxiProfile,
    resolveAvatarUrl
} = require('stremio/common/moxiProfiles');
const styles = require('./styles');

// Verified high-res trending backdrops and logos from Cinemeta
const INITIAL_FEATURED_CATALOG = [
    {
        id: 'tt2560140',
        name: 'Attack on Titan',
        background: 'https://images.metahub.space/background/medium/tt2560140/img',
        logo: 'https://images.metahub.space/logo/medium/tt2560140/img',
        releaseInfo: '2013–2023',
        type: 'Animation'
    },
    {
        id: 'tt15239678',
        name: 'Dune: Part Two',
        background: 'https://images.metahub.space/background/medium/tt15239678/img',
        logo: 'https://images.metahub.space/logo/medium/tt15239678/img',
        releaseInfo: '2024',
        type: 'Movie'
    },
    {
        id: 'tt7441658',
        name: 'Black Clover',
        background: 'https://images.metahub.space/background/medium/tt7441658/img',
        logo: 'https://images.metahub.space/logo/medium/tt7441658/img',
        releaseInfo: '2017–2026',
        type: 'Animation'
    },
    {
        id: 'tt11198330',
        name: 'House of the Dragon',
        background: 'https://images.metahub.space/background/medium/tt11198330/img',
        logo: 'https://images.metahub.space/logo/medium/tt11198330/img',
        releaseInfo: '2024',
        type: 'Series'
    },
    {
        id: 'tt33764258',
        name: 'The Odyssey',
        background: 'https://images.metahub.space/background/medium/tt33764258/img',
        logo: 'https://images.metahub.space/logo/medium/tt33764258/img',
        releaseInfo: '2026',
        type: 'Movie'
    }
];

const MoxiProfileScreen = ({ forceVisible = false, onProfileSelected }) => {
    const stremioProfile = useProfile();
    const [board] = useBoard();
    const {
        profiles,
        activeProfile: _activeProfile,
        setActiveProfile,
        saveProfile,
        deleteProfile
    } = useMoxiProfile();

    const [visible, setVisible] = React.useState(forceVisible);
    const [isEditMode, setIsEditMode] = React.useState(false);
    const [editingProfile, setEditingProfile] = React.useState(null);
    const [isCreatingNew, setIsCreatingNew] = React.useState(false);
    const [transitioningProfile, setTransitioningProfile] = React.useState(null);
    const [activeBackdropIdx, setActiveBackdropIdx] = React.useState(0);
    const [logoFailed, setLogoFailed] = React.useState(false);
    const fileInputRef = React.useRef(null);

    // Auto-adopt user's account username for the primary profile
    React.useEffect(() => {
        const userEmail = stremioProfile?.auth?.user?.email;
        if (typeof userEmail === 'string' && userEmail.includes('@')) {
            const username = userEmail.split('@')[0];
            const primary = profiles.find((p) => p.id === 'prof_primary');
            if (primary && (primary.name === 'My Profile' || primary.name === 'Main')) {
                saveProfile({ ...primary, name: username });
            }
        }
    }, [stremioProfile?.auth?.user?.email, profiles, saveProfile]);

    // Show on first load of session if not yet selected
    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            const hasPicked = sessionStorage.getItem('moxi_session_profile_picked');
            if (!hasPicked) {
                setVisible(true);
            }
        }
    }, []);

    React.useEffect(() => {
        setLogoFailed(false);
    }, [activeBackdropIdx]);
    React.useEffect(() => {
        const onOpen = () => {
            setVisible(true);
            setIsEditMode(false);
            setIsCreatingNew(false);
            setTransitioningProfile(null);
        };
        window.addEventListener('moxi-open-profile-screen', onOpen);
        return () => window.removeEventListener('moxi-open-profile-screen', onOpen);
    }, []);

    const [catalogItems, setCatalogItems] = React.useState(INITIAL_FEATURED_CATALOG);

    // Fetch trending Movies, Anime, and Series live from Cinemeta
    React.useEffect(() => {
        let isCancelled = false;
        Promise.all([
            fetch('https://v3-cinemeta.strem.io/catalog/movie/top.json').then((r) => r.json()).catch(() => ({ metas: [] })),
            fetch('https://v3-cinemeta.strem.io/catalog/series/top/genre=Animation.json').then((r) => r.json()).catch(() => ({ metas: [] })),
            fetch('https://v3-cinemeta.strem.io/catalog/series/top.json').then((r) => r.json()).catch(() => ({ metas: [] }))
        ]).then(([movies, anime, series]) => {
            if (isCancelled) return;
            const pool = [];
            const mList = (movies.metas || []).filter((m) => typeof m.background === 'string' && m.background.length > 0);
            const aList = (anime.metas || []).filter((m) => typeof m.background === 'string' && m.background.length > 0);
            const sList = (series.metas || []).filter((m) => typeof m.background === 'string' && m.background.length > 0);
            const max = Math.max(mList.length, aList.length, sList.length, 5);
            for (let i = 0; i < max && pool.length < 18; i++) {
                if (mList[i]) pool.push({ ...mList[i], type: 'Movie' });
                if (aList[i]) pool.push({ ...aList[i], type: 'Animation' });
                if (sList[i]) pool.push({ ...sList[i], type: 'Series' });
            }
            if (pool.length > 0) {
                setCatalogItems(pool);
            }
        }).catch((err) => {
            console.warn('Profile screen catalog fetch:', err);
        });
        return () => { isCancelled = true; };
    }, []);

    // Combine with board spotlight if available
    const featuredItems = React.useMemo(() => {
        const spotlightContent = (board.spotlight?.type === 'Ready' && Array.isArray(board.spotlight.content)) ?
            board.spotlight.content :
            [];
        const withBg = spotlightContent.filter((it) => typeof it.background === 'string' && it.background.length > 0);
        if (withBg.length > 0) {
            return [...withBg, ...catalogItems];
        }
        return catalogItems;
    }, [board.spotlight, catalogItems]);

    // Rotate backdrop every 7 seconds
    React.useEffect(() => {
        if (featuredItems.length <= 1) return undefined;
        const timer = setInterval(() => {
            setActiveBackdropIdx((prev) => (prev + 1) % featuredItems.length);
        }, 7000);
        return () => clearInterval(timer);
    }, [featuredItems.length]);

    const currentFeatured = featuredItems[activeBackdropIdx] || featuredItems[0];

    React.useEffect(() => {
        setLogoFailed(false);
    }, [activeBackdropIdx, currentFeatured?.id]);

    if (!visible && !forceVisible) return null;

    const handleProfileClick = (profile) => {
        if (isEditMode) {
            setIsCreatingNew(false);
            setEditingProfile({ ...profile });
            return;
        }

        // Trigger black transition screen with rotating spinner
        setTransitioningProfile(profile);
        setActiveProfile(profile.id);

        setTimeout(() => {
            if (typeof window !== 'undefined') {
                sessionStorage.setItem('moxi_session_profile_picked', 'true');
            }
            setVisible(false);
            setTransitioningProfile(null);
            onProfileSelected?.(profile);
        }, 750);
    };

    const handleOpenCreateModal = () => {
        setIsCreatingNew(true);
        const nextNum = profiles.length + 1;
        setEditingProfile({
            id: 'profile_' + Date.now(),
            name: `Profile ${nextNum}`,
            avatar: PRESET_AVATARS[(nextNum - 1) % PRESET_AVATARS.length].id,
            isKid: false
        });
    };

    const handleSaveEditingProfile = () => {
        if (editingProfile && editingProfile.name.trim().length > 0) {
            saveProfile(editingProfile);
            setEditingProfile(null);
            setIsCreatingNew(false);
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            const dataUrl = event.target?.result;
            if (typeof dataUrl === 'string' && editingProfile) {
                setEditingProfile({ ...editingProfile, avatar: dataUrl });
            }
        };
        reader.readAsDataURL(file);
    };

    // Transition State: Fullscreen pitch black with squircle avatar and glowing spinner
    if (transitioningProfile) {
        const avatarUrl = resolveAvatarUrl(transitioningProfile.avatar);
        return (
            <div className={styles['transition-screen']}>
                <div
                    className={styles['transition-avatar']}
                    style={{ backgroundImage: `url('${avatarUrl}')` }}
                />
                <div className={styles['transition-spinner']} />
            </div>
        );
    }

    const heroBgStyle = currentFeatured?.background ?
        { backgroundImage: `url('${currentFeatured.background}')` } :
        { background: 'radial-gradient(ellipse at 50% 25%, #152e1f 0%, #080d0a 75%)' };

    return (
        <div className={styles['profile-screen']}>
            {/* Cinematic Hero Backdrop from Addons */}
            <div className={styles['backdrop']} style={heroBgStyle}>
                <div className={styles['backdrop-gradient']} />
            </div>

            <div className={styles['content-container']}>
                {/* Hero Logo / Title Area */}
                <div className={styles['hero-branding']}>
                    {currentFeatured?.logo && !logoFailed ? (
                        <img
                            className={styles['hero-logo']}
                            src={currentFeatured.logo}
                            alt={currentFeatured.name || 'Featured'}
                            onError={() => setLogoFailed(true)}
                        />
                    ) : (
                        <div className={styles['hero-title']}>
                            {currentFeatured?.name || 'Moxi Cinema'}
                        </div>
                    )}
                    <div className={styles['hero-subtitle']}>
                        {currentFeatured?.releaseInfo ?
                            `${currentFeatured.releaseInfo} • ${currentFeatured.type ? currentFeatured.type.toUpperCase() : 'FEATURED'}` :
                            'Movies, Series & Animation'}
                    </div>
                </div>

                {/* Section Header */}
                <div className={styles['prompt-title']}>
                    {isEditMode ? 'Manage Profiles' : 'Choose Your Profile'}
                </div>

                {/* Squircle Profiles Grid */}
                <div className={styles['profiles-grid']}>
                    {profiles.map((p) => {
                        const avatarUrl = resolveAvatarUrl(p.avatar);
                        return (
                            <div
                                key={p.id}
                                className={classnames(styles['profile-item'], {
                                    [styles['editing']]: isEditMode
                                })}
                                onClick={() => handleProfileClick(p)}
                            >
                                <div
                                    className={styles['squircle-avatar']}
                                    style={{ backgroundImage: `url('${avatarUrl}')` }}
                                >
                                    {/* Edit Pencil Overlay */}
                                    {isEditMode && (
                                        <div className={styles['edit-overlay']}>
                                            <Icon className={styles['overlay-pencil']} name="edit" />
                                        </div>
                                    )}

                                    {/* Kids Badge */}
                                    {p.isKid && (
                                        <div className={styles['kids-badge']}>kids</div>
                                    )}
                                </div>
                                <div className={styles['profile-name']}>{p.name}</div>
                            </div>
                        );
                    })}

                    {/* Add Profile Squircle Card */}
                    <div
                        className={styles['profile-item']}
                        onClick={handleOpenCreateModal}
                    >
                        <div className={classnames(styles['squircle-avatar'], styles['action-squircle'], styles['add-squircle'])}>
                            <svg
                                className={styles['add-plus-svg']}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                        </div>
                        <div className={styles['profile-name']}>Add Profile</div>
                    </div>
                </div>

                {/* Manage Profiles / Done Pill Button */}
                <div className={styles['manage-container']}>
                    <button
                        className={classnames(styles['manage-btn'], { [styles['active']]: isEditMode })}
                        onClick={() => setIsEditMode(!isEditMode)}
                    >
                        <Icon
                            className={styles['manage-icon']}
                            name={isEditMode ? 'close' : 'edit'}
                        />
                        <span>{isEditMode ? 'Done' : 'Manage Profiles'}</span>
                    </button>
                </div>
            </div>

            {/* Profile Editor / Creator Modal */}
            {editingProfile && (
                <div className={styles['editor-backdrop']}>
                    <div className={styles['editor-card']}>
                        <div className={styles['editor-header']}>
                            <div className={styles['editor-title']}>
                                {isCreatingNew ? 'Create New Profile' : 'Edit Profile'}
                            </div>
                            <button
                                className={styles['editor-close']}
                                onClick={() => {
                                    setEditingProfile(null);
                                    setIsCreatingNew(false);
                                }}
                            >
                                ×
                            </button>
                        </div>

                        <div className={styles['editor-body']}>
                            <div
                                className={styles['editor-preview-avatar']}
                                style={{ backgroundImage: `url('${resolveAvatarUrl(editingProfile.avatar)}')` }}
                            />

                            <div className={styles['input-group']}>
                                <label className={styles['label']}>
                                    Profile Name {editingProfile.isLocked ? <span style={{ color: '#F2B51D', fontSize: '0.8rem' }}>(Prebuilt - Name Locked)</span> : null}
                                </label>
                                <input
                                    className={styles['text-field']}
                                    type="text"
                                    placeholder="Enter profile name..."
                                    value={editingProfile.name}
                                    disabled={editingProfile.isLocked}
                                    style={editingProfile.isLocked ? { opacity: 0.65, cursor: 'not-allowed' } : {}}
                                    onChange={(e) => {
                                        if (!editingProfile.isLocked) {
                                            setEditingProfile({ ...editingProfile, name: e.target.value });
                                        }
                                    }}
                                    autoFocus={!editingProfile.isLocked}
                                />
                            </div>

                            <div className={styles['checkbox-row']}>
                                <label className={styles['checkbox-label']}>
                                    <input
                                        type="checkbox"
                                        checked={!!editingProfile.isKid}
                                        disabled={editingProfile.isLocked && editingProfile.id === 'prof_kids'}
                                        onChange={(e) => {
                                            if (!editingProfile.isLocked || editingProfile.id !== 'prof_kids') {
                                                setEditingProfile({ ...editingProfile, isKid: e.target.checked });
                                            }
                                        }}
                                    />
                                    <span>Kids Profile (Kids badge & safe filters)</span>
                                </label>
                            </div>

                            <div className={styles['label']}>Choose Avatar</div>
                            <div className={styles['avatar-choices']}>
                                {PRESET_AVATARS.map((preset) => (
                                    <div
                                        key={preset.id}
                                        title={preset.name}
                                        className={classnames(styles['choice-thumb'], {
                                            [styles['chosen']]: editingProfile.avatar === preset.id
                                        })}
                                        style={{ backgroundImage: `url('${resolveAvatarUrl(preset.id)}')` }}
                                        onClick={() => setEditingProfile({ ...editingProfile, avatar: preset.id })}
                                    />
                                ))}
                            </div>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handleFileUpload}
                            />
                            <button
                                className={styles['upload-btn']}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                Upload Photo / Avatar
                            </button>
                        </div>

                        <div className={styles['editor-footer']}>
                            {!isCreatingNew && !editingProfile.isLocked && !editingProfile.isDefault && (
                                <button
                                    className={styles['delete-btn']}
                                    onClick={() => {
                                        deleteProfile(editingProfile.id);
                                        setEditingProfile(null);
                                    }}
                                >
                                    Delete
                                </button>
                            )}
                            <button
                                className={styles['save-btn']}
                                onClick={handleSaveEditingProfile}
                            >
                                {isCreatingNew ? 'Create Profile' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

MoxiProfileScreen.propTypes = {
    forceVisible: PropTypes.bool,
    onProfileSelected: PropTypes.func
};

module.exports = MoxiProfileScreen;
