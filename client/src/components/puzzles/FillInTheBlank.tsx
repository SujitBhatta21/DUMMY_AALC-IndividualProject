import "../../styles/FillInTheBlank.css"
import {useEffect, useMemo, useState} from "react";


interface FITBlankProps {
    question: string;
    answers: Record<number, string[]>;
    onCorrect: (question: string) => void;
    onBack: () => void;
}

// Shuffling the word bank words.
function shuffle<T>(array: T[]): T[] {
    for (let i = array.length; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array
}

function FillInTheBlank({ question, answers, onCorrect, onBack }: FITBlankProps) {

    const [correctAnswer, setCorrectAnswer] = useState<string[]>([])

    useEffect(() => {
        const results: string[] = [];

        for (const key of Object.keys(answers)) {
            const value : string[] = answers[Number(key)];
            if (value && value.length > 0) {
                results.push(value[0])
            }
        }
        setCorrectAnswer(results)
    }, [answers])

    console.log("ANSWER FIRST ITEMS EXTRACTED::", correctAnswer)

    const [userAnswer, setUserAnswer] = useState<string>("")

    const [activeBlank, setActiveBlank] = useState<number | null>(null);

    const shuffledWords = useMemo(() => {
        return shuffle([...Object.values(answers).flat()]);
    }, [answers]);

    const textParts = question.split("___");

    const handleSubmit: () => void = () => {
        if (answers.join("") === "expected answer") {
            onCorrect();
        }
    };

    const handleBack = () => {
        onBack();
    }


    // Rending the Question with clickable blanks.
    const renderQuestionWithBlank = () => {
        return (
            <div className="question-text">
                {textParts.map((part, index) => (
                    <span key={index}>
                        {part}
                        {index < textParts.length - 1 && (
                            <button
                                className={`blank-button ${activeBlank === index ? "active" : ""} ${answers[index] ? "filled" : ""}`}
                                onClick={() => setActiveBlank(index)}
                            >
                                {answers[index] || "___"}
                            </button>
                        )}
                    </span>
                ))}
            </div>
        );
    }


    function renderRandomWordBank() {
        return (
            <div className="random-word-collection">
                <div className="a-word">
                    {shuffledWords.map((word, index) => (
                        <button key={`${word}-${index}`}>
                            { word }
                        </button>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="FillInTheBlank-section">
            <div className="FillInTheBlank">
                { renderQuestionWithBlank() }
            </div>

            <div className="word-bank">
                { renderRandomWordBank() }
            </div>
            <button onClick={handleSubmit}>Submit</button>
            <button onClick={handleBack}>Back</button>
        </div>
    );
}

export default FillInTheBlank;