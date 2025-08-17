import React from 'react';
import type { OutlinedSpanProps } from '../types';
import { OutlinedHiddenSpan } from './OutlinedHiddenSpan';

export const OutlinedPUppercase: React.FC<OutlinedSpanProps> = ({
    children,
    className,
    font = 'font-persona5main',
    childClassName,
}) => (
    <p
        className={`${className} ${font} inline-block relative [-webkit-text-stroke:12px_black] [word-spacing:2rem] pointer-events-none box-border w-fit min-w-fit`}
    >
        {children}
        <OutlinedHiddenSpan className={childClassName}>
            {children}
        </OutlinedHiddenSpan>
    </p>
);
