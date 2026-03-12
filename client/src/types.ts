export interface Shard {
    id: number;
    title: string;
    fitb_question: string;
    fitb_answer: Record<number, string[]>;
    rewardsText: string;
    puzzleType: string;
    trackNumber: number;
}
