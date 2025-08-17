const adjustedPercentage = (percentage: number) => {
    if (percentage === 0) {
        return 0;
    }
    if (percentage === 100) {
        return 100;
    }
    const isMobile: boolean = window.innerWidth < 768;
    const minPercent: number = isMobile ? 9.5 : 6.5;
    const maxPercent: number = isMobile ? 88.5 : 91.5;

    return minPercent + (percentage * (maxPercent - minPercent)) / 100;
};

export const Bar = ({ percentageVotedYes }: { percentageVotedYes: number }) => (
    <>
        <img
            src="src/assets/bar/bar.svg"
            className="w-full px-[1.25em]"
            alt="Bar"
        />
        <img
            src="src/assets/bar/bar-fill.svg"
            className="absolute inset-0 w-full px-[1.25em] transition-all duration-900 ease-out"
            style={{
                clipPath: `inset(0 ${
                    100 - adjustedPercentage(percentageVotedYes)
                }% 0 0)`,
            }}
            alt="Filled bar"
        />
    </>
);
