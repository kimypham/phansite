import React from 'react';
import type { OutlinedSpanProps } from '../types';
import { OutlinedHiddenSpan } from './OutlinedHiddenSpan';

export const OutlinedSpan: React.FC<OutlinedSpanProps> = ({
    children,
    className,
    font = 'font-persona5main',
    childClassName,
}) => (
    <span
        className={`${className} ${font} inline-block relative [-webkit-text-stroke:12px_black] pointer-events-none box-border w-fit min-w-fit`}
    >
        {children}
        <OutlinedHiddenSpan className={childClassName}>
            {children}
        </OutlinedHiddenSpan>
    </span>
);
