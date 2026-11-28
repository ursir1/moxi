// Copyright (C) 2017-2026 Smart code 203358507

import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import SegmentedControl from 'stremio/components/SegmentedControl';

type Props = {
    className?: string,
    options: { value: string, label: string }[],
    value: number | null,
    size?: 'medium' | 'large',
    onSelect: (season: number) => void,
};

const SeasonPicker = ({ className, options, value, size, onSelect }: Props) => {
    const { t } = useTranslation();
    const selected = value !== null ? String(value) : null;

    const handleSelect = useCallback((value: string) => {
        onSelect(Number(value));
    }, [onSelect]);

    return (
        <SegmentedControl
            className={className}
            options={options}
            value={selected}
            ariaLabel={t('SEASON')}
            size={size}
            onSelect={handleSelect}
        />
    );
};

export default SeasonPicker;
