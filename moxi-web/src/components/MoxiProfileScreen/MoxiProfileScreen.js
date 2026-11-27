// Copyright (C) 2026 Moxi
const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('@stremio/stremio-icons/react').default;
const {
    PRESET_AVATARS,
    useMoxiProfile,
    resolveAvatarUrl
} = require('stremio/common/moxiProfiles');
const styles = require('./styles');

// High-res cinematic backdrops matching the reference images
const HERO_BACKDROPS = [
    {
        bg: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1600&auto=format&fit=crop',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Marvel_Cinematic_Universe_logo.svg/440px-Marvel_Cinematic_Universe_logo.svg.png',
        tagline: 'Brand New Day',
        subtitle: 'Coming Tuesday'
    },
    {
        bg: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1600&auto=format&fit=crop',
        logo: '',
        tagline: 'Moxi Stellar Universe',
        subtitle: 'Featured Collection'
    }
];

const MoxiProfileScreen = ({ forceVisible = false, onProfileSelected }) => {
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
    const [transitioningProfile, setTransitioningProfile] = React.useState(null);
    const [backdropIndex, _setBackdropIndex] = React.useState(0);
    const fileInputRef = React.useRef(null);

    // Show on first load of session if not yet selected
    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            const hasPicked = sessionStorage.getItem('moxi_session_profile_picked');
            if (!hasPicked) {
                setVisible(true);
            }
        }
    }, []);

    // Listen for manual trigger to switch profile
    React.useEffect(() => {
        const onOpen = () => {
            setVisible(true);
            setIsEditMode(false);
            setTransitioningProfile(null);
        };
        window.addEventListener('moxi-open-profile-screen', onOpen);
        return () => window.removeEventListener('moxi-open-profile-screen', onOpen);
    }, []);

    if (!visible && !forceVisible) return null;

    const handleProfileClick = (profile) => {
        if (isEditMode) {
            setEditingProfile({ ...profile });
            return;
        }

        // Trigger transition screen (Image 4 from reference)
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

    const handleSaveEditingProfile = () => {
        if (editingProfile) {
            saveProfile(editingProfile);
            setEditingProfile(null);
        }
    };

    const handleAddNewProfile = () => {
        const newProf = {
            id: 'profile_' + Date.now(),
            name: `User ${profiles.length + 1}`,
            avatar: PRESET_AVATARS[profiles.length % PRESET_AVATARS.length].id,
            isKid: false
        };
        saveProfile(newProf);
        setEditingProfile(newProf);
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

    const currentHero = HERO_BACKDROPS[backdropIndex] || HERO_BACKDROPS[0];

    return (
        <div className={styles['profile-screen']}>
            {/* Cinematic Hero Backdrop */}
            <div
                className={styles['backdrop']}
                style={{ backgroundImage: `url('${currentHero.bg}')` }}
            >
                <div className={styles['backdrop-gradient']} />
            </div>

            <div className={styles['content-container']}>
                {/* Hero Logo / Title Area */}
                <div className={styles['hero-branding']}>
                    {currentHero.logo ? (
                        <img className={styles['hero-logo']} src={currentHero.logo} alt="Featured" />
                    ) : (
                        <div className={styles['hero-title']}>{currentHero.tagline}</div>
                    )}
                    <div className={styles['hero-subtitle']}>{currentHero.subtitle}</div>
                </div>

                {/* Section Header */}
                <div className={styles['prompt-title']}>
                    {isEditMode ? 'Edit Profiles' : 'Choose Your Profile'}
                </div>

                {/* Squircle Profiles Grid (Image 1 & 2) */}
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
                                    {/* Edit Pencil Overlay (Image 3) */}
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

                    {/* Edit / Done Action Card */}
                    <div
                        className={styles['profile-item']}
                        onClick={() => setIsEditMode(!isEditMode)}
                    >
                        <div className={classnames(styles['squircle-avatar'], styles['action-squircle'])}>
                            <Icon
                                className={styles['action-icon']}
                                name={isEditMode ? 'close' : 'edit'}
                            />
                        </div>
                        <div className={styles['profile-name']}>
                            {isEditMode ? 'Done' : 'Edit'}
                        </div>
                    </div>

                    {/* Add Profile Card (when in Edit Mode) */}
                    {isEditMode && (
                        <div
                            className={styles['profile-item']}
                            onClick={handleAddNewProfile}
                        >
                            <div className={classnames(styles['squircle-avatar'], styles['action-squircle'], styles['add-squircle'])}>
                                <Icon className={styles['action-icon']} name="plus" />
                            </div>
                            <div className={styles['profile-name']}>Add Profile</div>
                        </div>
                    )}
                </div>
            </div>

            {/* Profile Editor Modal (When tapping a profile in Edit mode) */}
            {editingProfile && (
                <div className={styles['editor-backdrop']}>
                    <div className={styles['editor-card']}>
                        <div className={styles['editor-header']}>
                            <div className={styles['editor-title']}>Edit Profile</div>
                            <button
                                className={styles['editor-close']}
                                onClick={() => setEditingProfile(null)}
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
                                <label className={styles['label']}>Name</label>
                                <input
                                    className={styles['text-field']}
                                    type="text"
                                    value={editingProfile.name}
                                    onChange={(e) => setEditingProfile({ ...editingProfile, name: e.target.value })}
                                />
                            </div>

                            <div className={styles['checkbox-row']}>
                                <label className={styles['checkbox-label']}>
                                    <input
                                        type="checkbox"
                                        checked={!!editingProfile.isKid}
                                        onChange={(e) => setEditingProfile({ ...editingProfile, isKid: e.target.checked })}
                                    />
                                    <span>Kids Profile (Friendly badge)</span>
                                </label>
                            </div>

                            <div className={styles['label']}>Choose Avatar</div>
                            <div className={styles['avatar-choices']}>
                                {PRESET_AVATARS.map((preset) => (
                                    <div
                                        key={preset.id}
                                        className={classnames(styles['choice-thumb'], {
                                            [styles['chosen']]: editingProfile.avatar === preset.id
                                        })}
                                        style={{ backgroundImage: `url('${preset.dataUrl}')` }}
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
                            {profiles.length > 1 && (
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
                                Save Changes
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
