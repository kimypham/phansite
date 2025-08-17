export interface OutlinedTextProps {
    children: React.ReactNode;
    className?: string;
}
export interface OutlinedSpanProps extends OutlinedTextProps {
    font?: string;
    childClassName?: string;
}
