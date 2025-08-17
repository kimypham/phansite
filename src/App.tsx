import type { RealtimeChannel } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
    Bar,
    OutlinedGoldenGradientSpan,
    OutlinedH1,
    OutlinedP,
    OutlinedPUppercase,
} from './components';
import { supabase } from './supabase';

type VoteOption = 'yes' | 'no';

interface Vote {
    id: number;
    vote: VoteOption;
    user_id: string;
}

function App() {
    const [votes, setVotes] = useState<Vote[]>([]);
    const [userVote, setUserVote] = useState<VoteOption | null>(null);
    const [userId] = useState<string>(() => {
        let id: string | null = localStorage.getItem('user_id');
        if (!id) {
            id = uuidv4();
            localStorage.setItem('user_id', id);
        }
        return id;
    });

    const [isHovering, setIsHovering] = useState<VoteOption | null>(null);

    useEffect(() => {
        getVotes();

        const channel: RealtimeChannel = supabase
            .channel('votes')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'votes' },
                () => getVotes()
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    async function getVotes() {
        const { data } = await supabase.from('votes').select();

        const allVotes: Vote[] = data || [];
        setVotes(allVotes);

        const userVote: Vote | undefined = allVotes.find(
            (vote) => vote.user_id === userId
        );
        setUserVote(userVote?.vote || null);
    }

    async function castVote(voteType: VoteOption) {
        if (userVote) {
            const { error } = await supabase
                .from('votes')
                .update({ vote: voteType })
                .eq('user_id', userId);

            if (error) {
                console.error('Error updating vote:', error);
            }
        } else {
            const { error } = await supabase
                .from('votes')
                .insert({ vote: voteType, user_id: userId });

            if (error) {
                console.error('Error voting:', error);
            }
        }
    }

    const yesCount: number = votes.filter((vote) => vote.vote === 'yes').length;
    const noCount: number = votes.filter((vote) => vote.vote === 'no').length;
    const percentageVotedYes: number =
        votes.length > 0 ? Math.round((yesCount / votes.length) * 100) : 0;

    return (
        <div style={{ padding: '20px' }}>
            <OutlinedH1>Phantom Thief Questionare</OutlinedH1>

            <div className="inline-flex items-center">
                <OutlinedPUppercase className="text-persona-red text-[4rem] tracking-[-0.32em] pr-4">
                    Q
                </OutlinedPUppercase>
                <div className="leading-[0.689]">
                    <OutlinedP className="text-persona-red text-[2.25em]">
                        Do you
                    </OutlinedP>
                    <OutlinedP className="text-white text-[2.5em]">
                        &nbsp;believe&nbsp;
                    </OutlinedP>
                    <OutlinedP className="text-persona-red text-[2.25em]">
                        in the
                    </OutlinedP>
                    <OutlinedP className="text-white text-[2.5em]">
                        &nbsp;Phantom Thieves&nbsp;
                    </OutlinedP>
                    <OutlinedP className="text-persona-red text-[2.25em]">
                        ?
                    </OutlinedP>
                </div>
            </div>
            <div className="flex items-baseline leading-[1] w-fit">
                <div className="-rotate-8">
                    <OutlinedPUppercase className="text-persona-red text-[4rem] tracking-[-0.32em]">
                        A
                    </OutlinedPUppercase>
                </div>
                <p>
                    <OutlinedGoldenGradientSpan className="text-[2.5em] tracking-[-0.5em]">
                        YE<span style={{ letterSpacing: '0' }}>S</span>
                    </OutlinedGoldenGradientSpan>
                    <OutlinedGoldenGradientSpan
                        className="text-[9.25em]"
                        font="font-francoisOne"
                    >
                        {percentageVotedYes ?? ''}
                    </OutlinedGoldenGradientSpan>

                    <OutlinedGoldenGradientSpan
                        className="text-[4em]"
                        font="font-francoisOne"
                    >
                        %
                    </OutlinedGoldenGradientSpan>
                </p>
            </div>
            <div className="relative mb-10 md:mb-5">
                <Bar percentageVotedYes={percentageVotedYes} />
                <div className="absolute inset-0 flex justify-between items-center bottom-[-5em] md:bottom-[-6em]">
                    <button onClick={() => castVote('yes')}>
                        <div
                            className="flex flex-col leading-none cursor-pointer"
                            onMouseEnter={() => setIsHovering('yes')}
                            onMouseLeave={() => setIsHovering(null)}
                        >
                            {(isHovering === 'yes' || userVote === 'yes') &&
                            isHovering !== 'no' ? (
                                <OutlinedGoldenGradientSpan className="text-[2.5em] tracking-[-0.35em] indent-[-0.3em]">
                                    YE
                                    <span style={{ letterSpacing: '0' }}>
                                        S
                                    </span>
                                </OutlinedGoldenGradientSpan>
                            ) : (
                                <OutlinedPUppercase className="text-[2.5em] tracking-[-0.35em] indent-[-0.3em]">
                                    Yes
                                </OutlinedPUppercase>
                            )}

                            {(isHovering === 'yes' || userVote === 'yes') &&
                            isHovering !== 'no' ? (
                                <OutlinedGoldenGradientSpan
                                    className="text-[1.5em]"
                                    font="font-p5hatty"
                                >
                                    {yesCount} votes
                                </OutlinedGoldenGradientSpan>
                            ) : (
                                <OutlinedP className="text-[1.5em]">
                                    {yesCount} votes
                                </OutlinedP>
                            )}
                        </div>
                    </button>

                    <button onClick={() => castVote('no')}>
                        <div
                            className="flex flex-col leading-none cursor-pointer"
                            onMouseEnter={() => setIsHovering('no')}
                            onMouseLeave={() => setIsHovering(null)}
                        >
                            {(isHovering === 'no' || userVote === 'no') &&
                            isHovering !== 'yes' ? (
                                <OutlinedGoldenGradientSpan className="text-[2.5em] tracking-[-0.35em]">
                                    N
                                    <span style={{ letterSpacing: '0' }}>
                                        O
                                    </span>
                                </OutlinedGoldenGradientSpan>
                            ) : (
                                <OutlinedPUppercase className="text-[2.5em] tracking-[-0.35em]">
                                    N
                                    <span style={{ letterSpacing: '0' }}>
                                        O
                                    </span>
                                </OutlinedPUppercase>
                            )}

                            {(isHovering === 'no' || userVote === 'no') &&
                            isHovering !== 'yes' ? (
                                <OutlinedGoldenGradientSpan
                                    className="text-[1.5em]"
                                    font="font-p5hatty"
                                >
                                    {noCount} votes
                                </OutlinedGoldenGradientSpan>
                            ) : (
                                <OutlinedP className="text-[1.5em]">
                                    {noCount} votes
                                </OutlinedP>
                            )}
                        </div>
                    </button>
                </div>
            </div>

            <div className="flex flex-col items-center text-center">
                <OutlinedP className="text-[1.5em]">
                    {userVote
                        ? `You voted ${userVote}`
                        : 'Click on "YES" or "NO" above to vote.'}
                </OutlinedP>
                <OutlinedP className="text-[1.5em]">
                    Thank you for your time. Please also leave a comment.
                </OutlinedP>
            </div>
            <footer className="text-center">
                <OutlinedP className="text-[1.5em]">
                    Phantom Aficionado
                </OutlinedP>
            </footer>
        </div>
    );
}

export default App;
