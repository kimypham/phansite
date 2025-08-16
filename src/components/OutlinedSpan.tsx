import React from 'react';
import type { OutlinedTextProps } from '../types';
import { OutlinedHiddenSpan } from './OutlinedHiddenSpan';

interface OutlinedSpanProps extends OutlinedTextProps {
    font?: string;
}

export const OutlinedSpan: React.FC<OutlinedSpanProps> = ({
    children,
    className,
    font = 'font-persona5main',
}) => (
    <span
        className={`${className} ${font} inline-block relative [-webkit-text-stroke:12px_black] [word-spacing:2rem] pointer-events-none`}
    >
        {children}
        <OutlinedHiddenSpan>{children}</OutlinedHiddenSpan>
    </span>
);
