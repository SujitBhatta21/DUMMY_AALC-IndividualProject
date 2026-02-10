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
    for (let i = array.length - 1; i > 0; i--) {
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
        console.log("ANSWERS IN BANK: ", answers)
    }, [answers])

    console.log("ANSWER FIRST ITEMS EXTRACTED::", correctAnswer)

    // filledBlanks tracks which word is placed in each blank slot
    const [filledBlanks, setFilledBlanks] = useState<Record<number, string>>({});

    const shuffledWords = useMemo(() => {
        return shuffle([...Object.values(answers).flat()]);
    }, [answers]);

    const textParts = question.split("___");
    const blankCount = textParts.length - 1;

    const handleSubmit: () => void = () => {
        // Check if all blanks are filled and match the correct answers
        const userAnswers: string[] = [];
        for (let i = 0; i < blankCount; i++) {
            userAnswers.push(filledBlanks[i] || "");
        }

        const isCorrect = correctAnswer.every((ans, i) => ans === userAnswers[i]);
        if (isCorrect) {
            onCorrect(question);
        }
    };

    const handleBack = () => {
        onBack();
    }

    // --- Drag & Drop handlers ---
    const handleDragStart = (e: React.DragEvent, word: string) => {
        e.dataTransfer.setData("text/plain", word);
        e.dataTransfer.setData("source", "wordbank");
    };

    const handleBlankDragStart = (e: React.DragEvent, blankIndex: number) => {
        const word = filledBlanks[blankIndex];
        if (word) {
            e.dataTransfer.setData("text/plain", word);
            e.dataTransfer.setData("source", "blank");
            e.dataTransfer.setData("blankIndex", String(blankIndex));
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDropOnBlank = (e: React.DragEvent, blankIndex: number) => {
        e.preventDefault();
        const word = e.dataTransfer.getData("text/plain");
        const source = e.dataTransfer.getData("source");
        const fromBlankIndex = e.dataTransfer.getData("blankIndex");

        if (!word) return;

        setFilledBlanks(prev => {
            const updated = { ...prev };

            // If dragging from another blank, clear that blank
            if (source === "blank" && fromBlankIndex !== "") {
                delete updated[Number(fromBlankIndex)];
            }

            // If this blank already has a word, it goes back to the bank automatically
            updated[blankIndex] = word;
            return updated;
        });
    };

    // Click a filled blank to remove the word
    const handleBlankClick = (blankIndex: number) => {
        if (filledBlanks[blankIndex]) {
            setFilledBlanks(prev => {
                const updated = { ...prev };
                delete updated[blankIndex];
                return updated;
            });
        }
    };

    // Words currently placed in blanks (so we can dim them in the word bank)
    const usedWords = Object.values(filledBlanks);

    // Rending the Question with clickable blanks.
    const renderQuestionWithBlank = () => {
        return (
            <div className="question-text">
                {textParts.map((part, index) => (
                    <span key={index}>
                        {part}
                        {index < blankCount && (
                            <button
                                className={`blank-button ${filledBlanks[index] ? "filled" : ""}`}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDropOnBlank(e, index)}
                                draggable={!!filledBlanks[index]}
                                onDragStart={(e) => handleBlankDragStart(e, index)}
                                onClick={() => handleBlankClick(index)}
                                title={filledBlanks[index] ? "Click to remove" : "Drop a word here"}
                            >
                                {filledBlanks[index] || "___"}
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
                    {shuffledWords.map((word, index) => {
                        const isUsed = usedWords.includes(word);
                        return (
                            <button
                                key={`${word}-${index}`}
                                draggable={!isUsed}
                                onDragStart={(e) => handleDragStart(e, word)}
                                className={isUsed ? "used" : ""}
                                disabled={isUsed}
                            >
                                {word}
                            </button>
                        );
                    })}
                </div>
            </div>
        )
    }

    return (
        <div>
            <h1 style={{ textAlign: "center", padding: "2 rem"}}>Fill In The Blank (Drag & Drop)</h1>
            <div className="FillInTheBlank-section">
                <div className="FillInTheBlank">
                    { renderQuestionWithBlank() }
                </div>

                <div className="word-bank">
                    { renderRandomWordBank() }
                </div>
                <div className="fitb-buttons">
                    <button onClick={handleSubmit}>Submit</button>
                    <button onClick={handleBack}>Back</button>
                </div>
            </div>
        </div>
    );
}

export default FillInTheBlank;