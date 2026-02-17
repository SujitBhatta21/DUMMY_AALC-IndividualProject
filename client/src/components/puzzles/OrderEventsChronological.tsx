import {useState} from "react";
import { shuffle } from "../../utils.ts"

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
            <h1>Order Events Chronologically</h1>
            <section className="order-events-section">
                <p>ORDER THIS THINGSsdfdfdf...</p>

                <div className="events-list">
                    { userAnswerOrder.map((event : Events, index : number) =>  (
                        <div
                            key={ index }
                            draggable={ true }
                            onDragOver={ dragOverHandler }
                            onDragStart={ (e: React.DragEvent) => { dragStartHandler(e, index) } }
                            onDrop={ (e: React.DragEvent) => { onDropHandler(e, index) } }
                            className="{  }"
                        >
                            { index + 1 }. { event.text }
                        </div>
                    )) }
                </div>
            </section>

            <div className="buttons">
                <button onClick={handleSubmit}>Submit</button>
                {/*<button onClick={onBack}>Back</button>*/}
            </div>
        </div>
    );
}

export default OrderEventsChronological;