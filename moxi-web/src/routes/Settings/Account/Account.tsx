// Copyright (C) 2017-2026 Smart code 203358507

import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCore } from 'stremio/core';
import { Group, Row, RowButton } from '../components';
import getAvatar from '../getAvatar';
import styles from './Account.less';
const { useMoxiProfile } = require('stremio/common/moxiProfiles');
const MoxiProfileModal = require('stremio/components/MoxiProfileModal');

type Props = {
    profile: Profile,
    dataExport: {
        loading: boolean,
        start: () => void,
    },
};

const Account = ({ profile, dataExport }: Props) => {
    const { t } = useTranslation();
    const core = useCore();
    const { activeProfile } = useMoxiProfile();
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'switch' | 'avatar'>('switch');

    const avatar = useMemo(() => getAvatar(profile.auth), [profile.auth, activeProfile]);

    const onLogout = useCallback(() => {
        core.transport.dispatch({
            action: 'Ctx',
            args: {
                action: 'Logout'
            }
        });
    }, []);

    return (
        <React.Fragment>
            <Group>
                <div className={styles['identity']}>
                    <div className={styles['avatar']} style={{ backgroundImage: avatar, cursor: 'pointer' }} onClick={() => { setModalMode('avatar'); setModalOpen(true); }} title="Change Avatar" />
                    <div className={styles['text']}>
                        <div className={styles['name']} style={{ color: '#2FBF71', fontWeight: 700 }} title={activeProfile?.name || 'Primary Profile'}>
                            {activeProfile?.name || 'Primary Profile'}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
                            {profile.auth === null ? t('ANONYMOUS_USER') : profile.auth.user.email}
                        </div>
                        {
                            profile.auth === null &&
                                <div className={styles['hint']}>{t('SETTINGS_ACCOUNT_GUEST_HINT')}</div>
                        }
                    </div>
                    {
                        profile.auth !== null ?
                            <RowButton icon={'exit'} label={t('LOG_OUT')} onClick={onLogout} />
                            :
                            <RowButton variant={'primary'} label={`${t('LOG_IN')} / ${t('SIGN_UP')}`} href={'#/intro'} />
                    }
                </div>
            </Group>
            <Group title="Moxi Profiles & Avatars">
                <Row rowId={'moxi_profiles'} label="Multi-Profiles" description="Switch between different viewer profiles or create a new profile." stackOnPhone={true}>
                    <RowButton label="Switch Profile" onClick={() => window.dispatchEvent(new CustomEvent('moxi-open-profile-screen'))} />
                </Row>
                <Row rowId={'moxi_avatar'} label="Custom Avatar" description="Choose from neon avatar presets or upload your own profile photo." stackOnPhone={true}>
                    <RowButton label="Change Avatar" onClick={() => { setModalMode('avatar'); setModalOpen(true); }} />
                </Row>
            </Group>
            {
                profile?.auth?.user?.email &&
                    <Group title={t('SETTINGS_GROUP_SECURITY')}>
                        <Row rowId={'password'} label={t('PASSWORD')} description={t('SETTINGS_PASSWORD_DESC')} stackOnPhone={true}>
                            <RowButton
                                label={t('SETTINGS_CHANGE_PASSWORD')}
                                href={`https://www.strem.io/reset-password/${profile.auth.user.email}`}
                                external={true}
                            />
                        </Row>
                    </Group>
            }
            {
                profile?.auth?.user &&
                    <Group title={t('SETTINGS_GROUP_YOUR_DATA')}>
                        <Row rowId={'export'} label={t('SETTINGS_DATA_EXPORT')} description={t('WEBSITE_DATA_EXPORT_DESCRIPTION')} stackOnPhone={true}>
                            <RowButton label={t('SETTINGS_DATA_EXPORT_BUTTON')} disabled={dataExport.loading} onClick={dataExport.start} />
                        </Row>
                    </Group>
            }
            {
                profile?.auth?.user &&
                    <Group className={styles['danger']}>
                        <Row rowId={'deletion'} label={t('SETTINGS_ACCOUNT_DELETION')} description={t('SETTINGS_ACCOUNT_DELETION_DESC')} stackOnPhone={true}>
                            <RowButton
                                variant={'danger'}
                                label={t('SETTINGS_DELETE_ACCOUNT')}
                                href={'https://www.strem.io/acc-settings'}
                                external={true}
                            />
                        </Row>
                    </Group>
            }
            <MoxiProfileModal
                isOpen={modalOpen}
                initialMode={modalMode}
                onClose={() => setModalOpen(false)}
            />
        </React.Fragment>
    );
};

export default Account;

