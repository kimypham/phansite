const adjustedPercentage = (percentage: number) =>
    3 + (percentage * (93 - 3)) / 100;

export const Bar = ({ percentageVotedYes }: { percentageVotedYes: number }) => (
    <>
        <img src="src/assets/bar/bar.svg" className="w-full" alt="Bar" />
        <img
            src="src/assets/bar/bar-fill.svg"
            className="absolute inset-0 w-full transition-all duration-900 ease-out"
            style={{
                clipPath: `inset(0 ${
                    100 - adjustedPercentage(percentageVotedYes)
                }% 0 0)`,
            }}
            alt="Filled bar"
        />
    </>
);
