import "../../styles/FillInTheBlank.css"
import {useState} from "react";


function FillInTheBlank({ question, onCorrect, onBack }: { question: string, onCorrect: () => void, onBack: () => void }) {
    const [answer, setAnswer] = useState("");

    const handleSubmit = () => {
        if (answer === "expected answer") {
            onCorrect();
        }
    };

    const handleBack = () => {
        onBack();
    }

    return (
        <div className="FillInTheBlank-section">
            <p>The ___ was a system of racial segregation. (TESTING) </p>
            <input value={answer} onChange={e => setAnswer(e.target.value)}/>
            <button onClick={handleSubmit}>Submit</button>
            <button onClick={handleBack}>Back</button>
        </div>
    );
}

export default FillInTheBlank;