import { useRef, useState, useCallback } from "react";
import "../../styles/Puzzle.css";
import "../../styles/ConnectMatching.css";
import RewardPopup from "./RewardPopup";


interface Props {
    onComplete: () => void;
    rewardsText: string;
}

interface Pair {
    leftId: string;
    rightId: string;
}

const PAIRS: Pair[] = [
    { leftId: "agents",  rightId: "apartheid_regime" },
    { leftId: "goal",    rightId: "destroy_docs"     },
    { leftId: "outcome", rightId: "solidarity"       },
];

const LEFT_CARDS  = [
    { id: "agents",  label: "Bomb planted by agents of…"  },
    { id: "goal",    label: "Goal of attack…"              },
    { id: "outcome", label: "Outcome of the attack…"       },
];

const RIGHT_CARDS = [
    { id: "apartheid_regime", label: "The apartheid regime"                      },
    { id: "destroy_docs",     label: "Destroy documents & intimidate activists"  },
    { id: "solidarity",       label: "Increased solidarity"                       },
];


function ConnectMatching({ onComplete, rewardsText }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const leftRefs     = useRef<Record<string, HTMLButtonElement | null>>({});
    const rightRefs    = useRef<Record<string, HTMLButtonElement | null>>({});

    const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
    const [connections,  setConnections]  = useState<Pair[]>([]);
    const [wrongRight,   setWrongRight]   = useState<string | null>(null);
    const [solved,       setSolved]       = useState(false);

    const connectedLeftIds  = new Set(connections.map(c => c.leftId));
    const connectedRightIds = new Set(connections.map(c => c.rightId));

    const handleLeftClick = (id: string) => {
        if (connectedLeftIds.has(id)) return;
        setSelectedLeft(prev => (prev === id ? null : id));
    };

    const handleRightClick = (id: string) => {
        if (connectedRightIds.has(id) || !selectedLeft) return;

        const isCorrect = PAIRS.some(p => p.leftId === selectedLeft && p.rightId === id);

        if (isCorrect) {
            const updated = [...connections, { leftId: selectedLeft, rightId: id }];
            setConnections(updated);
            setSelectedLeft(null);
            if (updated.length === PAIRS.length) setSolved(true);
        } else {
            setWrongRight(id);
            setSelectedLeft(null);
            setTimeout(() => { setWrongRight(null); }, 500);
        }
    };

    const getLineCoords = useCallback((leftId: string, rightId: string) => {
        const container = containerRef.current;
        const leftEl    = leftRefs.current[leftId];
        const rightEl   = rightRefs.current[rightId];
        if (!container || !leftEl || !rightEl) return null;

        const cRect = container.getBoundingClientRect();
        const lRect = leftEl.getBoundingClientRect();
        const rRect = rightEl.getBoundingClientRect();

        return {
            x1: lRect.right  - cRect.left,
            y1: lRect.top    + lRect.height / 2 - cRect.top,
            x2: rRect.left   - cRect.left,
            y2: rRect.top    + rRect.height / 2 - cRect.top,
        };
    }, []);

    return (
        <div className="connect-matching">
            <h1 className="puzzle-title">Connect the Evidence</h1>
            <p className="puzzle-instruction">
                Click a fragment on the left, then click its matching answer on the right.
            </p>

            <div className="cm-arena" ref={containerRef}>

                {/* SVG overlay — draws lines between matched cards */}
                <svg className="cm-svg" aria-hidden="true">
                    {connections.map(({ leftId, rightId }) => {
                        const coords = getLineCoords(leftId, rightId);
                        if (!coords) return null;
                        return (
                            <line
                                key={`${leftId}-${rightId}`}
                                x1={coords.x1} y1={coords.y1}
                                x2={coords.x2} y2={coords.y2}
                                className="cm-line"
                            />
                        );
                    })}
                </svg>

                {/* Left column — fragment prompts */}
                <div className="cm-col cm-col--left">
                    {LEFT_CARDS.map(card => (
                        <button
                            key={card.id}
                            ref={el => { leftRefs.current[card.id] = el; }}
                            className={[
                                "cm-card cm-card--left",
                                selectedLeft === card.id    ? "cm-card--selected"  : "",
                                connectedLeftIds.has(card.id) ? "cm-card--connected" : "",
                            ].join(" ")}
                            onClick={() => { handleLeftClick(card.id); }}
                            disabled={connectedLeftIds.has(card.id)}
                        >
                            {card.label}
                        </button>
                    ))}
                </div>

                {/* Right column — answer options */}
                <div className="cm-col cm-col--right">
                    {RIGHT_CARDS.map(card => (
                        <button
                            key={card.id}
                            ref={el => { rightRefs.current[card.id] = el; }}
                            className={[
                                "cm-card cm-card--right",
                                wrongRight === card.id                                    ? "cm-card--wrong"      : "",
                                connectedRightIds.has(card.id)                            ? "cm-card--connected"  : "",
                                selectedLeft && !connectedRightIds.has(card.id)           ? "cm-card--targetable" : "",
                            ].join(" ")}
                            onClick={() => { handleRightClick(card.id); }}
                            disabled={connectedRightIds.has(card.id)}
                        >
                            {card.label}
                        </button>
                    ))}
                </div>

            </div>

            {solved && <RewardPopup rewardsText={rewardsText} onComplete={onComplete} />}
        </div>
    );
}

export default ConnectMatching;