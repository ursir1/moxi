// Copyright (C) 2026 Moxi
const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const {
    PRESET_AVATARS,
    useMoxiProfile,
    resolveAvatarUrl
} = require('stremio/common/moxiProfiles');
const styles = require('./styles');

const MoxiProfileModal = ({ isOpen, onClose }) => {
    const {
        activeProfile,
        saveProfile
    } = useMoxiProfile();

    const [selectedAvatar, setSelectedAvatar] = React.useState(activeProfile?.avatar || 'luffy');
    const fileInputRef = React.useRef(null);

    React.useEffect(() => {
        if (isOpen) {
            setSelectedAvatar(activeProfile?.avatar || 'luffy');
        }
    }, [isOpen, activeProfile]);

    if (!isOpen) return null;

    const onSaveAvatar = () => {
        if (activeProfile) {
            saveProfile({
                ...activeProfile,
                avatar: selectedAvatar
            });
        }
        onClose?.();
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

    return (
        <div className={styles['modal-overlay']} onClick={onClose}>
            <div className={styles['modal-window']} onClick={(e) => e.stopPropagation()}>
                <div className={styles['modal-header']}>
                    <div className={styles['modal-title']}>
                        Change Avatar ({activeProfile?.name || 'Profile'})
                    </div>
                    <button className={styles['modal-close-btn']} onClick={onClose}>
                        ×
                    </button>
                </div>

                <div className={styles['container']}>
                    <div className={styles['avatar-view']}>
                        <div className={styles['preview-section']}>
                            <div
                                className={styles['large-preview']}
                                style={{ backgroundImage: `url('${resolveAvatarUrl(selectedAvatar)}')` }}
                            />
                            <div className={styles['preview-label']}>Selected Avatar</div>
                        </div>

                        <div className={styles['section-title']}>Preset Characters</div>
                        <div className={styles['presets-grid']}>
                            {PRESET_AVATARS.map((preset) => {
                                const isSelected = selectedAvatar === preset.id;
                                return (
                                    <div
                                        key={preset.id}
                                        className={classnames(styles['preset-item'], { [styles['selected']]: isSelected })}
                                        onClick={() => setSelectedAvatar(preset.id)}
                                    >
                                        <div
                                            className={styles['preset-thumb']}
                                            style={{ backgroundImage: `url('${resolveAvatarUrl(preset.id)}')` }}
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
                            <button
                                className={styles['upload-btn']}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <span>Upload Custom Photo</span>
                            </button>
                        </div>

                        <div className={styles['footer-actions']}>
                            <button className={styles['cancel-btn']} onClick={onClose}>
                                Cancel
                            </button>
                            <button className={styles['save-btn']} onClick={onSaveAvatar}>
                                Save Avatar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

MoxiProfileModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
};

module.exports = MoxiProfileModal;
