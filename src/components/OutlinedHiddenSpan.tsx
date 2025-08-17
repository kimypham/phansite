import React from 'react';
import type { OutlinedTextProps } from '../types';

export const OutlinedHiddenSpan: React.FC<OutlinedTextProps> = ({
    children,
    className,
}) => (
    <span
        aria-hidden="true"
        className={`${className} absolute top-0 left-0 [-webkit-text-stroke:0]`}
    >
        {children}
    </span>
);
