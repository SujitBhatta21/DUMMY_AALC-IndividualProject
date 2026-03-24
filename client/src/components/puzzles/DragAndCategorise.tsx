import { useMemo, useState } from "react";
import "../../styles/Puzzle.css";
import "../../styles/DragAndCategorise.css";
import { shuffle } from "../../utils.ts";
import RewardPopup from "../RewardPopup.tsx";


interface Props {
    onComplete: () => void;
    rewardsText: string;
}

interface Bucket {
    id: string;
    label: string;
    acceptedWords: string[];
}

const BUCKETS: Bucket[] = [
    {
        id: "actions",
        label: "Actions Taken",
        acceptedWords: [
            "Boycotted SA goods",
            "Bank boycott",
            "Refused to perform in SA",
            "Boycotted SA sports teams",
        ],
    },
    {
        id: "groups",
        label: "Who Acted",
        acceptedWords: [
            "Trade unions",
            "Artists",
            "Student groups",
            "Community groups",
        ],
    },
    {
        id: "effects",
        label: "Effects",
        acceptedWords: [
            "Economic pressure",
            "International isolation",
            "Companies withdrew",
            "Global awareness raised",
        ],
    },
];

// Converted to FlatMap cause only array is accepted by shuffle.
const ALL_WORDS = BUCKETS.flatMap(b => b.acceptedWords);


function DragAndCategorise({ onComplete, rewardsText }: Props) {
    const shuffledWords = useMemo(() => shuffle([...ALL_WORDS]), []);

    const [buckets, setBuckets] = useState<Record<string, string[]>>({
        actions: [],
        groups: [],
        effects: [],
    });

    const [dragging, setDragging] = useState<string | null>(null); // Don't need this but a failsafe state.
    const [wrongBucket, setWrongBucket] = useState<string | null>(null);
    const [solved, setSolved] = useState(false);

    // Word bank only shows words not yet correctly placed
    const placedWords = new Set(Object.values(buckets).flat());
    const wordBank = shuffledWords.filter(w => !placedWords.has(w));

    const handleDragStart = (e: React.DragEvent, word: string) => {
        setDragging(word);
        e.dataTransfer.setData("word", word);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent, bucketId: string) => {
        e.preventDefault();
        const word = e.dataTransfer.getData("word") || dragging;
        if (!word) return;

        const bucket = BUCKETS.find(b => b.id === bucketId);

        if (bucket?.acceptedWords.includes(word)) {
            const updated = {
                ...buckets,
                [bucketId]: [...buckets[bucketId], word],
            };
            setBuckets(updated);

            const allSolved = BUCKETS.every(b =>
                b.acceptedWords.every(w => updated[b.id].includes(w))
            );
            if (allSolved) setSolved(true);
        } else {
            setWrongBucket(bucketId);
            setTimeout(() => { setWrongBucket(null) }, 600);
        }
        setDragging(null);
    };

    return (
        <div className="drag-and-categorise">
            <h1 className="puzzle-title">Sort the Sanctions</h1>
            <p className="puzzle-instruction">
                Hold and Drag each word into the correct category bucket.
            </p>

            {/* Word bank */}
            <div className="dac-word-bank">
                {wordBank.map((word) => (
                    <button
                        key={word}
                        className="dac-word-chip"
                        draggable
                        onDragStart={(e) => { handleDragStart(e, word) }}
                    >
                        {word}
                    </button>
                ))}
                {wordBank.length === 0 && (
                    <span className="dac-word-bank-empty">All words placed!</span>
                )}
            </div>

            {/* Buckets */}
            <div className="dac-buckets-row">
                {BUCKETS.map((bucket) => (
                    <div
                        key={bucket.id}
                        className={`dac-bucket ${wrongBucket === bucket.id ? "dac-bucket--wrong" : ""}`}
                        onDragOver={handleDragOver}
                        onDrop={(e) => { handleDrop(e, bucket.id) }}
                    >
                        <p className="dac-bucket-label">{bucket.label}</p>
                        <div className="dac-bucket-stack">
                            {buckets[bucket.id].map((word) => (
                                <span key={word} className="dac-placed-word">
                                    {word}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {solved && (
                <RewardPopup rewardsText={rewardsText} onComplete={onComplete} />
            )}
        </div>
    );
}

export default DragAndCategorise;