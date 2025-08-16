import React from 'react';
import type { OutlinedTextProps } from '../types';
import { OutlinedHiddenSpan } from './OutlinedHiddenSpan';

export const OutlinedP: React.FC<OutlinedTextProps> = ({
    children,
    className,
}) => (
    <p
        className={`${className} relative inline-flex line-height-[0.689em] [-webkit-text-stroke:10px_black] font-p5hatty pointer-events-none`}
    >
        {children}
        <OutlinedHiddenSpan>{children}</OutlinedHiddenSpan>
    </p>
);
