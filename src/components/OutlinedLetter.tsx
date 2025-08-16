import React from 'react';
import type { OutlinedTextProps } from '../types';
import { OutlinedHiddenSpan } from './OutlinedHiddenSpan';

export const OutlinedLetter: React.FC<OutlinedTextProps> = ({ children }) => (
    <span className="flex pr-4 relative [-webkit-text-stroke:12px_black] font-persona5main tracking-[-0.32em] text-[4rem] [word-spacing:2rem] text-persona-red pointer-events-none">
        {children}
        <OutlinedHiddenSpan>{children}</OutlinedHiddenSpan>
    </span>
);
