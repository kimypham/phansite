import React from 'react';
import type { OutlinedTextProps } from '../types';
import { OutlinedHiddenSpan } from './OutlinedHiddenSpan';

export const OutlinedH1: React.FC<OutlinedTextProps> = ({ children }) => (
    <h1 className="flex relative text-center [-webkit-text-stroke:10px_black] font-persona5main tracking-[-0.32em] text-[2em] [word-spacing:2rem] text-persona-red pointer-events-none">
        {children}
        <OutlinedHiddenSpan>{children}</OutlinedHiddenSpan>
    </h1>
);
