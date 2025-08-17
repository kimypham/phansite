import type { OutlinedSpanProps } from '../types';
import { OutlinedSpan } from './OutlinedSpan';

export const OutlinedGoldenGradientSpan: React.FC<OutlinedSpanProps> = ({
    children,
    className,
    font = 'font-persona5main',
}) => (
    <OutlinedSpan
        className={`${className} bg-clip-text text-transparent`}
        childClassName="bg-gradient-to-t from-gold-200 to-gold-100 bg-clip-text"
        font={font}
    >
        {children}
    </OutlinedSpan>
);
