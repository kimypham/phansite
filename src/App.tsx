import type { RealtimeChannel } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
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
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <OutlinedPUppercase className="text-[2.5em] tracking-[-0.35em] indent-[-0.3em]">
                    Yes
                </OutlinedPUppercase>
                <OutlinedPUppercase className="text-[2.5em] tracking-[-0.35em] mr-[0.3em]">
                    No
                </OutlinedPUppercase>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <OutlinedP className="text-[1.5em]">{yesCount} votes</OutlinedP>
                <OutlinedP className="text-[1.5em]">{noCount} votes</OutlinedP>
            </div>
            <div style={{ margin: '20px 0' }}>
                <button
                    onClick={() => castVote('yes')}
                    style={{
                        padding: '10px 20px',
                        margin: '0 10px',
                        backgroundColor:
                            userVote === 'yes' ? '#16a34a' : '#22c55e',
                        color: 'white',
                        border:
                            userVote === 'yes' ? '2px solid #065f46' : 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                >
                    <OutlinedP className="text-[2em]">Yes</OutlinedP>
                </button>

                <button
                    onClick={() => castVote('no')}
                    style={{
                        padding: '10px 20px',
                        margin: '0 10px',
                        backgroundColor:
                            userVote === 'no' ? '#dc2626' : '#ef4444',
                        color: 'white',
                        border:
                            userVote === 'no' ? '2px solid #7f1d1d' : 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                >
                    <OutlinedP className="text-[2em]">No</OutlinedP>
                </button>
            </div>
            <div className="flex flex-col">
                {userVote && (
                    <OutlinedP className="text-[1.5em]">
                        You voted {userVote}
                    </OutlinedP>
                )}
                <OutlinedP className="text-[1.5em]">
                    Thank you for your time. Please also leave a comment.
                </OutlinedP>
            </div>
            <footer>
                <OutlinedP className="text-[1.5em]">
                    Phantom Aficionado
                </OutlinedP>
            </footer>
        </div>
    );
}

export default App;
