// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const { useGoBack } = require('stremio-router');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const { default: Icon } = require('@stremio/stremio-icons/react');
const { Button, Image } = require('stremio/components');
const { useFullscreen } = require('stremio/common/Fullscreen');
const { useHorizontalNavGamepadNavigation } = require('stremio/services/GamepadNavigation');
const useProfile = require('stremio/common/useProfile');
const { useMoxiProfile, resolveAvatarUrl } = require('stremio/common/moxiProfiles');
const SearchBar = require('./SearchBar');
const NavMenu = require('./NavMenu');
const styles = require('./styles');
const { t } = require('i18next');

const HorizontalNavBar = React.memo(({ className, route, query, title, backButton, searchBar, fullscreenButton, navMenu, originPath, onBackButtonClick, hdrInfo, ...props }) => {
    const profile = useProfile();
    const { activeProfile } = useMoxiProfile();
    const goBack = useGoBack(originPath);
    const [fullscreen, requestFullscreen, exitFullscreen, , supported] = useFullscreen();
    const avatar = React.useMemo(() => {
        const fallback = (profile && profile.auth && profile.auth.user && profile.auth.user.avatar) ?
            profile.auth.user.avatar :
            require('/assets/images/default_avatar.png');
        return resolveAvatarUrl(activeProfile?.avatar, fallback);
    }, [profile, activeProfile]);
    const renderNavMenuLabel = React.useCallback(({ ref, className, onClick, children, }) => (
        <Button
            ref={ref}
            className={classnames(className, styles['button-container'], styles['menu-button-container'], { [styles['with-avatar']]: !!avatar })}
            tabIndex={-1}
            onClick={onClick}
        >
            {
                avatar ?
                    <div
                        className={styles['nav-avatar']}
                        style={{ backgroundImage: `url('${avatar}')` }}
                    />
                    :
                    <Icon className={styles['icon']} name={'person-outline'} />
            }
            {children}
        </Button>
    ), [avatar]);
    useHorizontalNavGamepadNavigation(route || className, backButton ? goBack : undefined);
    return (
        <nav {...props} className={classnames(className, styles['horizontal-nav-bar-container'])}>
            {
                backButton ?
                    <Button className={classnames(styles['button-container'], styles['back-button-container'])} tabIndex={-1} onClick={onBackButtonClick || goBack}>
                        <Icon className={styles['icon']} name={'chevron-back'} />
                    </Button>
                    :
                    <div className={styles['logo-container']}>
                        <Image
                            className={styles['logo']}
                            src={require('/assets/images/stremio_symbol.png')}
                            alt={' '}
                        />
                    </div>
            }
            {
                typeof title === 'string' && title.length > 0 ?
                    <h2 className={styles['title']}>{title}</h2>
                    :
                    null
            }
            {
                searchBar && route !== 'addons' ?
                    <SearchBar className={styles['search-bar']} query={query} active={route === 'search'} />
                    :
                    null
            }
            <div className={styles['buttons-container']}>
                {
                    hdrInfo && (hdrInfo.gamma === 'pq' || hdrInfo.gamma === 'hlg') ?
                        <div className={styles['hdr-indicator']} title={hdrInfo.gamma === 'pq' ? 'HDR10' : 'HLG'}>
                            <Icon className={styles['icon']} name={'hdr'} />
                        </div>
                        :
                        null
                }
                {
                    supported && fullscreenButton ?
                        <Button className={styles['button-container']} title={fullscreen ? t('EXIT_FULLSCREEN') : t('ENTER_FULLSCREEN')} tabIndex={-1} onClick={fullscreen ? exitFullscreen : requestFullscreen}>
                            <Icon className={styles['icon']} name={fullscreen ? 'minimize' : 'maximize'} />
                        </Button>
                        :
                        null
                }
                {
                    navMenu ?
                        <NavMenu renderLabel={renderNavMenuLabel} />
                        :
                        null
                }
            </div>
        </nav>
    );
});

HorizontalNavBar.displayName = 'HorizontalNavBar';

HorizontalNavBar.propTypes = {
    className: PropTypes.string,
    route: PropTypes.string,
    query: PropTypes.string,
    title: PropTypes.string,
    backButton: PropTypes.bool,
    searchBar: PropTypes.bool,
    fullscreenButton: PropTypes.bool,
    navMenu: PropTypes.bool,
    originPath: PropTypes.string,
    onBackButtonClick: PropTypes.func,
    hdrInfo: PropTypes.shape({
        gamma: PropTypes.string,
    }),
};

module.exports = HorizontalNavBar;
