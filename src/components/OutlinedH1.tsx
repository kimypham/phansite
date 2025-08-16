import React from 'react';

interface OutlinedH1Props {
    children: React.ReactNode;
}

export const OutlinedH1: React.FC<OutlinedH1Props> = ({ children }) => (
    <div className="fixed font-persona5main tracking-[-0.32em] text-[2rem] [word-spacing:2rem] text-persona-red">
        <h1>{children}</h1>
        <span aria-hidden="true">{children}</span>
    </div>
);
