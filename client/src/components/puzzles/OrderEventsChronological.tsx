import {useState} from "react";
import { shuffle } from "../../utils.ts"
import "../../styles/Puzzle.css"
import "../../styles/OrderEventsChronolical.css"


interface OrderEventsProps {
    onComplete?: () => void;
    rewardsText?: string;
}

interface Events {
    id : number;
    text: string;
    correctOrder : number;
}

const events : Events[] = [
    { id: 1, text: "First", correctOrder: 1 },
    { id: 2, text: "Second", correctOrder: 2 },
    { id: 3, text: "Third", correctOrder: 3 },
];



// const randomEvent : string[] = shuffle([...events]);


function OrderEventsChronological ({ onComplete, rewardsText }: OrderEventsProps) {

    // const shuffledEvents = shuffle([...events])

    const [userAnswerOrder, setUserAnswerOrder] = useState<Events[]>(
        () => shuffle([...events])
    );

    const handleSubmit: () => void = () => {
        // Checking if user answer are filled with correct order.
        const isCorrect : boolean = userAnswerOrder.every(
            (event: Events, index: number) =>
                event.correctOrder === index + 1
        );
        if (isCorrect) {
            onComplete?.();
        }  else {
            // Code something that highlights wrong positions...
        }
    }

    const dragStartHandler = (e: React.DragEvent, index: number) => {
        e.dataTransfer.setData("draggingIndex", String(index));
    }

    const dragOverHandler = (e: React.DragEvent) => {
        e.preventDefault();
    }

    const onDropHandler = (e: React.DragEvent, droppingIndex: number) => {
        e.preventDefault();
        const draggingIndex = Number(e.dataTransfer.getData("draggingIndex"));

        setUserAnswerOrder(prev => {
            const updated = [...prev];

            const [draggingEvent] = updated.splice(draggingIndex, 1);
            updated.splice(droppingIndex, 0, draggingEvent);
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
                            className="event-card"
                        >
                            <span className="event-number">{ index + 1 }</span>
                            <span className="event-text">{ event.text }</span>
                        </div>
                    )) }
                </div>
                <div className="order-events-buttons">
                    <button onClick={handleSubmit}>Submit</button>
                </div>
            </section>
        </div>
    );
}

export default OrderEventsChronological;