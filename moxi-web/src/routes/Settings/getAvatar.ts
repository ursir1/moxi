// Copyright (C) 2017-2026 Smart code 203358507
const { getActiveProfile, resolveAvatarUrl } = require('stremio/common/moxiProfiles');

const getAvatar = (auth: Profile['auth']) => {
    const active = getActiveProfile();
    const fallback = (auth && auth.user && auth.user.avatar) ?
        auth.user.avatar :
        require('/assets/images/default_avatar.png');

    const avatarUrl = resolveAvatarUrl(active?.avatar, fallback);
    return `url('${avatarUrl}')`;
};

export default getAvatar;
