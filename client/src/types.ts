/*
NOTE:
 Remember field names in interface must match Jackson serialises from Java <object e.g. Shard>.
 It's determined by getter method names, not field declaration order or db column order.
*/

// This is interface for Shard table.
export interface Shard {
    id: number;
    title: string;
    fitb_question: string;
    fitb_answer: Record<number, string[]>;
    rewardsText: string;
    puzzleType: string;
    trackNumber: number;
}


// This interface for User table
export interface IUser {
    userId: number;
    username: string;
    role: string;
    lastActiveAt: string;
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

