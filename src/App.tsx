import type { RealtimeChannel } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { OutlinedH1, OutlinedLetter } from './components';
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
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <OutlinedH1>Phantom Thief Questionare</OutlinedH1>

            <h2>
                <div className="flex items-center">
                    <OutlinedLetter>Q</OutlinedLetter>
                    Do you&nbsp;<span>believe</span>&nbsp;in the Phantom
                    Thieves?
                </div>
            </h2>
            <div className="flex items-center">
                <div className="-rotate-8">
                    <OutlinedLetter>A</OutlinedLetter>
                </div>
                <span>{percentageVotedYes ?? ''}</span>%
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p>Yes</p>
                <p>No</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p>{yesCount} votes</p>
                <p>{noCount} votes</p>
            </div>
            <p>Total votes: {votes.length}</p>
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
                    Yes
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
                    No
                </button>
            </div>
            {userVote && (
                <p>
                    You voted: <strong>{userVote}</strong>
                </p>
            )}
            <p>Thank you for your time. Please also leave a comment.</p>
            <footer>
                <p>Phantom Aficionado</p>
            </footer>
        </div>
    );
}

export default App;
