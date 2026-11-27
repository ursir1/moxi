// Copyright (C) 2026 Moxi
const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const ModalDialog = require('stremio/components/ModalDialog');
const Button = require('stremio/components/Button');
const Icon = require('@stremio/stremio-icons/react').default;
const {
    PRESET_AVATARS,
    useMoxiProfile,
    resolveAvatarUrl
} = require('stremio/common/moxiProfiles');
const styles = require('./styles');

const MoxiProfileModal = ({ isOpen, initialMode = 'switch', onClose }) => {
    const {
        profiles,
        activeProfile,
        setActiveProfile,
        saveProfile,
        deleteProfile
    } = useMoxiProfile();

    const [mode, setMode] = React.useState(initialMode);
    const [selectedAvatar, setSelectedAvatar] = React.useState(activeProfile?.avatar || 'moxi_neon');
    const [customUrlInput, setCustomUrlInput] = React.useState('');
    const [newProfileName, setNewProfileName] = React.useState('');
    const fileInputRef = React.useRef(null);

    React.useEffect(() => {
        if (isOpen) {
            setMode(initialMode);
            setSelectedAvatar(activeProfile?.avatar || 'moxi_neon');
            setNewProfileName('');
            setCustomUrlInput('');
        }
    }, [isOpen, initialMode, activeProfile]);

    if (!isOpen) return null;

    const onSelectProfile = (id) => {
        setActiveProfile(id);
        onClose?.();
    };

    const onSaveAvatar = () => {
        if (activeProfile) {
            saveProfile({
                ...activeProfile,
                avatar: selectedAvatar
            });
        }
        onClose?.();
    };

    const onCreateProfile = () => {
        const name = newProfileName.trim() || `Profile ${profiles.length + 1}`;
        saveProfile({
            id: 'profile_' + Date.now(),
            name,
            avatar: selectedAvatar,
            isDefault: false
        });
        setMode('switch');
    };

    const onFileUpload = (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            const dataUrl = event.target?.result;
            if (typeof dataUrl === 'string') {
                setSelectedAvatar(dataUrl);
            }
        };
        reader.readAsDataURL(file);
    };

    const onApplyUrl = () => {
        const trimmed = customUrlInput.trim();
        if (trimmed) {
            setSelectedAvatar(trimmed);
            setCustomUrlInput('');
        }
    };

    let title = 'Who is Watching?';
    if (mode === 'avatar') title = 'Choose Profile Avatar';
    if (mode === 'add') title = 'Add New Profile';

    return (
        <ModalDialog
            className={styles['modal-dialog']}
            title={title}
            onCloseRequest={onClose}
        >
            <div className={styles['container']}>
                {mode === 'switch' && (
                    <div className={styles['switch-view']}>
                        <div className={styles['profiles-grid']}>
                            {profiles.map((p) => {
                                const isActive = p.id === activeProfile?.id;
                                const avatarSrc = resolveAvatarUrl(p.avatar);
                                return (
                                    <div
                                        key={p.id}
                                        className={classnames(styles['profile-card'], { [styles['active']]: isActive })}
                                        onClick={() => onSelectProfile(p.id)}
                                    >
                                        <div
                                            className={styles['profile-avatar']}
                                            style={{ backgroundImage: `url('${avatarSrc}')` }}
                                        >
                                            {isActive && <div className={styles['active-badge']}>Active</div>}
                                        </div>
                                        <div className={styles['profile-name']}>{p.name}</div>
                                        {profiles.length > 1 && !p.isDefault && (
                                            <button
                                                className={styles['delete-btn']}
                                                title="Delete profile"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteProfile(p.id);
                                                }}
                                            >
                                                ×
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <div className={styles['actions-row']}>
                            <Button
                                className={styles['secondary-btn']}
                                onClick={() => {
                                    setMode('add');
                                    setNewProfileName('');
                                    setSelectedAvatar('moxi_neon');
                                }}
                            >
                                <Icon className={styles['btn-icon']} name="plus" />
                                <span>Add Profile</span>
                            </Button>

                            <Button
                                className={styles['primary-btn']}
                                onClick={() => setMode('avatar')}
                            >
                                <Icon className={styles['btn-icon']} name="settings" />
                                <span>Change Avatar</span>
                            </Button>
                        </div>
                    </div>
                )}

                {mode === 'avatar' && (
                    <div className={styles['avatar-view']}>
                        <div className={styles['preview-section']}>
                            <div
                                className={styles['large-preview']}
                                style={{ backgroundImage: `url('${resolveAvatarUrl(selectedAvatar)}')` }}
                            />
                            <div className={styles['preview-label']}>Preview</div>
                        </div>

                        <div className={styles['section-title']}>Preset Avatars</div>
                        <div className={styles['presets-grid']}>
                            {PRESET_AVATARS.map((preset) => {
                                const isSelected = selectedAvatar === preset.id || selectedAvatar === preset.dataUrl;
                                return (
                                    <div
                                        key={preset.id}
                                        className={classnames(styles['preset-item'], { [styles['selected']]: isSelected })}
                                        style={{ borderColor: isSelected ? preset.accent : 'transparent' }}
                                        onClick={() => setSelectedAvatar(preset.id)}
                                    >
                                        <div
                                            className={styles['preset-thumb']}
                                            style={{ backgroundImage: `url('${preset.dataUrl}')` }}
                                        />
                                        <div className={styles['preset-name']}>{preset.name}</div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className={styles['custom-section']}>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={onFileUpload}
                            />
                            <Button
                                className={styles['upload-btn']}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Icon className={styles['btn-icon']} name="download" />
                                <span>Upload Custom Image</span>
                            </Button>

                            <div className={styles['url-row']}>
                                <input
                                    className={styles['url-input']}
                                    type="text"
                                    placeholder="Or paste image URL (https://...)"
                                    value={customUrlInput}
                                    onChange={(e) => setCustomUrlInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && onApplyUrl()}
                                />
                                <Button className={styles['apply-btn']} onClick={onApplyUrl}>
                                    Apply
                                </Button>
                            </div>
                        </div>

                        <div className={styles['footer-actions']}>
                            <Button className={styles['secondary-btn']} onClick={() => setMode('switch')}>
                                Back
                            </Button>
                            <Button className={styles['primary-btn']} onClick={onSaveAvatar}>
                                Save Avatar
                            </Button>
                        </div>
                    </div>
                )}

                {mode === 'add' && (
                    <div className={styles['add-view']}>
                        <div className={styles['form-group']}>
                            <label className={styles['input-label']}>Profile Name</label>
                            <input
                                className={styles['text-input']}
                                type="text"
                                placeholder="e.g. Living Room, Kids, Cinema"
                                value={newProfileName}
                                autoFocus
                                onChange={(e) => setNewProfileName(e.target.value)}
                            />
                        </div>

                        <div className={styles['section-title']}>Choose Avatar</div>
                        <div className={styles['presets-grid']}>
                            {PRESET_AVATARS.map((preset) => {
                                const isSelected = selectedAvatar === preset.id;
                                return (
                                    <div
                                        key={preset.id}
                                        className={classnames(styles['preset-item'], { [styles['selected']]: isSelected })}
                                        style={{ borderColor: isSelected ? preset.accent : 'transparent' }}
                                        onClick={() => setSelectedAvatar(preset.id)}
                                    >
                                        <div
                                            className={styles['preset-thumb']}
                                            style={{ backgroundImage: `url('${preset.dataUrl}')` }}
                                        />
                                        <div className={styles['preset-name']}>{preset.name}</div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className={styles['footer-actions']}>
                            <Button className={styles['secondary-btn']} onClick={() => setMode('switch')}>
                                Cancel
                            </Button>
                            <Button className={styles['primary-btn']} onClick={onCreateProfile}>
                                Create Profile
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </ModalDialog>
    );
};

MoxiProfileModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    initialMode: PropTypes.oneOf(['switch', 'avatar', 'add']),
    onClose: PropTypes.func.isRequired
};

module.exports = MoxiProfileModal;
