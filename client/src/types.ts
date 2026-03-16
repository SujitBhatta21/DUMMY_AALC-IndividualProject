export interface Shard {
    id: number;
    title: string;
    fitb_question: string;
    fitb_answer: Record<number, string[]>;
    rewardsText: string;
    puzzleType: string;
    trackNumber: number;
}


// This interface for Report table.
export interface IReport {
    id: number;
    user: { userId: number; username: string };
    title: string;
    description: string;
    createdAt: string;
    status: "OPEN" | "IN_REVIEW" | "RESOLVED";
}