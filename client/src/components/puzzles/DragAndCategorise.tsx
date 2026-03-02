import "../../styles/Puzzle.css"
import { shuffle } from "../../utils.ts";


interface Props {
    onComplete: () => void,
    resultText: string
}

function DragAndCategorise({ onComplete, resultText }: Props) {
    return (
        <div>
            <section className="d-and-c-section">

            </section>
        </div>
    )
}


export default DragAndCategorise;