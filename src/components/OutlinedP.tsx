import React from 'react';
import type { OutlinedTextProps } from '../types';
import { OutlinedHiddenSpan } from './OutlinedHiddenSpan';

interface OutlinedPProps extends OutlinedTextProps {
    textStroke?: string;
}

export const OutlinedP: React.FC<OutlinedPProps> = ({
    children,
    className,
    textStroke = '10px black',
}) => (
    <p
        className={`${className} relative inline-flex line-height-[0.689em] font-p5hatty pointer-events-none`}
        style={{ WebkitTextStroke: textStroke }}
    >
        {children}
        <OutlinedHiddenSpan>{children}</OutlinedHiddenSpan>
    </p>
);
