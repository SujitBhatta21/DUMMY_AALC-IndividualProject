import { useMemo, useState } from "react";
import "../../styles/Puzzle.css";
import "../../styles/CommunicationNetwork.css";
import { shuffle } from "../../utils.ts";
import RewardPopup from "../RewardPopup.tsx";

interface Props {
    onComplete: () => void;
    rewardsText: string;
}

interface NetworkNode {
    id: string;
    label: string;
    sublabel: string;
    message: string;
}

const NODES: NetworkNode[] = [
    {
        id: "anc",
        label: "ANC Headquarters",
        sublabel: "Lusaka, Zambia",
        message: "Coded strategy letter from ANC leadership",
    },
    {
        id: "aam",
        label: "Anti-Apartheid Movement",
        sublabel: "UK Supporters",
        message: "Plans to march on South Africa House",
    },
    {
        id: "media",
        label: "International Media",
        sublabel: "Global Press",
        message: "Survivor testimony from Sharpeville",
    },
    {
        id: "exiles",
        label: "Exiled Communities",
        sublabel: "South Africans in London",
        message: "Emergency housing for a newly arrived exile",
    },
];

const ALL_MESSAGES = NODES.map(n => n.message);

function CommunicationNetwork({ onComplete, rewardsText }: Props) {
    const shuffledMessages = useMemo(() => shuffle([...ALL_MESSAGES]), []);

    const [placed, setPlaced] = useState<Record<string, string | null>>({
        anc: null, aam: null, media: null, exiles: null,
    });
    const [selected, setSelected] = useState<string | null>(null);
    const [wrongNode, setWrongNode] = useState<string | null>(null);
    const [solved, setSolved] = useState(false);

    const placedMessages = new Set(
        Object.values(placed).filter((v): v is string => v !== null)
    );
    const unplaced = shuffledMessages.filter(m => !placedMessages.has(m));

    function handleNodeClick(nodeId: string) {
        if (!selected || placed[nodeId] !== null) return;
        const node: NetworkNode = NODES.find(n => n.id === nodeId)!;
        if (node.message === selected) {
            const updated = { ...placed, [nodeId]: selected };
            setPlaced(updated);
            setSelected(null);
            if (Object.values(updated).every(v => v !== null)) setSolved(true);
        } else {
            setWrongNode(nodeId);
            setTimeout(() => { setWrongNode(null) }, 600);
        }
    }

    function nodeClass(nodeId: string) {
        return [
            "cn-node",
            wrongNode === nodeId                ? "cn-node--wrong"      : "",
            selected && placed[nodeId] === null ? "cn-node--targetable" : "",
            placed[nodeId] !== null             ? "cn-node--filled"     : "",
        ].join(" ");
    }

    return (
        <div className="comm-network">
            <h1 className="puzzle-title">The Penton Street Network</h1>
            <p className="puzzle-instruction">
                Select a message card, then click the correct destination node to route it.
            </p>

            {/* Message pool */}
            <div className="cn-pool">
                {unplaced.map(msg => (
                    <button
                        key={msg}
                        className={`cn-message ${selected === msg ? "cn-message--selected" : ""}`}
                        onClick={() => { setSelected(selected === msg ? null : msg)} }
                    >
                        {msg}
                    </button>
                ))}
                {unplaced.length === 0 && (
                    <span className="cn-pool-done">All messages routed!</span>
                )}
            </div>

            {/* Network diagram */}
            <div className="cn-diagram">
                <div className="cn-nodes-row">
                    {NODES.slice(0, 2).map(node => (
                        <button
                            key={node.id}
                            className={nodeClass(node.id)}
                            onClick={() => { handleNodeClick(node.id)} }
                        >
                            <span className="cn-node-label">{node.label}</span>
                            <span className="cn-node-sub">{node.sublabel}</span>
                            {placed[node.id] !== null && (
                                <span className="cn-node-message">{placed[node.id]}</span>
                            )}
                        </button>
                    ))}
                </div>

                <div className="cn-hub">
                    <span className="cn-hub-name">28 Penton Street</span>
                    <span className="cn-hub-sub">London HQ</span>
                </div>

                <div className="cn-nodes-row">
                    {NODES.slice(2, 4).map(node => (
                        <button
                            key={node.id}
                            className={nodeClass(node.id)}
                            onClick={() => { handleNodeClick(node.id)} }
                        >
                            <span className="cn-node-label">{node.label}</span>
                            <span className="cn-node-sub">{node.sublabel}</span>
                            {placed[node.id] !== null && (
                                <span className="cn-node-message">{placed[node.id]}</span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {solved && (
                <RewardPopup rewardsText={rewardsText} onComplete={onComplete} />
            )}
        </div>
    );
}

export default CommunicationNetwork;