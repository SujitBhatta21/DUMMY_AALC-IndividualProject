import {useState} from "react";
import { shuffle } from "../../utils.ts"
import "../../styles/Puzzle.css"
import "../../styles/OrderEventsChronolical.css"
import RewardPopup from "../RewardPopup.tsx";


interface OrderEventsProps {
    onComplete?: () => void;
    rewardsText?: string;
}

interface Events {
    id : number;
    text: string;
    correctOrder : number;
}

const events: Events[] = [
    { id: 1, text: "Dutch settlers arrive in South Africa (17th century)", correctOrder: 1 },
    { id: 2, text: "British colonists arrive in South Africa (18th century)", correctOrder: 2 },
    { id: 3, text: "The National Party takes power and begins passing apartheid laws (1948)", correctOrder: 3 },
    { id: 4, text: "Police open fire on peaceful protesters in Sharpeville, killing more than 69 people (1960)", correctOrder: 4 },
    { id: 5, text: "Students in Soweto rise up against forced Afrikaans-language education (1976)", correctOrder: 5 },
];



function OrderEventsChronological ({ onComplete, rewardsText }: OrderEventsProps) {

    const [solved, setSolved] = useState<boolean>(false);
    const [lockedIDs, setLockedIds] = useState<Set<number>>(new Set()); // Stored solved event slot. (in correct position)

    const [userAnswerOrder, setUserAnswerOrder] = useState<Events[]>(
        () => shuffle([...events])
    );

    const handleSubmit: () => void = () => {
        // Checking if user answer are filled with correct order.
        const correct = new Set(
            userAnswerOrder
                .filter((event, index) => event.correctOrder === index + 1)
                .map(event => event.id)
        )
        setLockedIds(correct);

        if (correct.size === events.length) {
            setSolved(true);
        }
    }

    const dragStartHandler = (e: React.DragEvent, index: number) => {
        // Locking id if in correct order. (undraggable)
        if (lockedIDs.has(userAnswerOrder[index].id)) {
            e.preventDefault();
            return;
        }

        e.dataTransfer.setData("draggingIndex", String(index));
    }

    const dragOverHandler = (e: React.DragEvent) => {
        e.preventDefault();
    }

    const onDropHandler = (e: React.DragEvent, droppingIndex: number) => {
        e.preventDefault();

        if (lockedIDs.has(userAnswerOrder[droppingIndex].id)) return;

        const draggingIndex = Number(e.dataTransfer.getData("draggingIndex"));

        if (draggingIndex === droppingIndex) return;

        setUserAnswerOrder((prev: Events[]) => {
            const updated: Events[] = [...prev];

            [updated[draggingIndex], updated[droppingIndex]] = [updated[droppingIndex], updated[draggingIndex]];
            return updated;
        })
    }

    return (
        <div className="order-events-chronological">
            <h1 className="puzzle-title">Order Events Chronologically</h1>
            <p className="puzzle-instruction">Drag and drop the events into the correct chronological order.</p>
            <section className="order-events-section">
                <div className="events-list">
                    { userAnswerOrder.map((event : Events, index : number) =>  (
                        <div
                            key={ index }
                            draggable={ true }
                            onDragOver={ dragOverHandler }
                            onDragStart={ (e: React.DragEvent) => { dragStartHandler(e, index) } }
                            onDrop={ (e: React.DragEvent) => { onDropHandler(e, index) } }
                            className={`event-card ${lockedIDs.has(event.id) ? "event-locked" : ""}`}
                        >
                            <span className="event-number">{ index + 1 }</span>
                            <span className="event-text">{ event.text }</span>
                        </div>
                    )) }
                </div>
                <div className="order-events-buttons">
                    <button onClick={handleSubmit}>Submit</button>
                </div>
                { solved && (
                    <RewardPopup
                        rewardsText={rewardsText ?? ""}
                        onComplete={onComplete ?? (() => { void 0 })} // Void 0 for safe anonymous/empty function
                    />
                )}
            </section>
        </div>
    );
}

export default OrderEventsChronological;