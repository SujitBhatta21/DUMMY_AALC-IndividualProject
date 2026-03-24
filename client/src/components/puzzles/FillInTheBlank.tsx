import "../../styles/Puzzle.css"
import "../../styles/FillInTheBlank.css"
import {useEffect, useMemo, useState} from "react";
import { shuffle } from "../../utils"


interface FITBlankProps {
    question: string;
    answers: Record<number, string[]>;
    onCorrect: (question: string) => void;
    onBack: () => void;
    isShard9: boolean;
}


function FillInTheBlank({ question, answers, onCorrect, onBack, isShard9 }: FITBlankProps) {

    const [correctAnswer, setCorrectAnswer] = useState<string[]>([])
    const [showSuccess, setShowSuccess] = useState(false)
    // filledBlanks tracks which word is placed in each blank slot
    const [filledBlanks, setFilledBlanks] = useState<Record<number, string>>({});

    useEffect(() => {
        const results: string[] = [];

        for (const key of Object.keys(answers)) {
            const value : string[] = answers[Number(key)];
            if (value.length > 0) {
                results.push(value[0])
            }
        }
        setCorrectAnswer(results)
        console.log("ANSWERS IN BANK: ", answers)
    }, [answers])

    console.log("ANSWER FIRST ITEMS EXTRACTED::", correctAnswer)

    const shuffledWords = useMemo(() => {
        return shuffle([...Object.values(answers).flat()]);
    }, [answers]);

    const textParts = question.split("___");
    const blankCount = textParts.length - 1;


    const handlePuzzleCorrect = () => {
        setShowSuccess(true);
    }

    const handleContinueToNextPuzzle = () => {
        setShowSuccess(false);
        onCorrect(question);
    }

    const handleSubmit: () => void = () => {
        // Check if all blanks are filled and match the correct answers
        const userAnswers: string[] = [];
        for (let i = 0; i < blankCount; i++) {
            userAnswers.push(filledBlanks[i] || "");
        }

        const isCorrect = correctAnswer.every((ans, i) => ans === userAnswers[i]);
        if (isCorrect) {
            if (isShard9) {
                onCorrect(question)
            } else {
                handlePuzzleCorrect();
            }
        } else {
            // Send wrong answers back to word bank, keep correct ones in place.
            setFilledBlanks(prev => {
                const updated = {...prev};
                for (let i = 0; i < blankCount; i++) {
                    if (updated[i] !== correctAnswer[i]) {
                        delete updated[i];
                    }
                }
                return updated;
            })
        }
    };


    const handleBack = () => {
        onBack();
    }

    // Drag & Drop handlers
    const handleDragStart = (e : React.DragEvent, word : string) => {
        e.dataTransfer.setData("text/plain", word);
        e.dataTransfer.setData("source", "wordbank");
        e.dataTransfer.effectAllowed = "move"  // For dragging style when dragging a word from word bank.
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
        e.dataTransfer.dropEffect = "move";
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
                                onDrop={(e) => { handleDropOnBlank(e, index)} }
                                draggable={!!filledBlanks[index]}
                                onDragStart={(e) => { handleBlankDragStart(e, index)} }
                                onClick={() => { handleBlankClick(index)} }
                                title={filledBlanks[index] ? "Click to remove" : "Drag & Drop a word here"}
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
                    {shuffledWords.map((word: string, index: number) => {
                        const isUsed = usedWords.includes(word);
                        return (
                            <button
                                key={`${ word }-${ String(index) }`}
                                draggable={!isUsed}
                                onDragStart={(e) => { handleDragStart(e, word)} }
                                onDragEnd={() => { document.body.classList.remove("dragging")} }
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
            <h1 className="puzzle-title">Fill In The Blank</h1>
            <p className="puzzle-instruction">
                Hold the word from word bank then Drag and Drop correct answer in blanks
            </p>
            <div className="FillInTheBlank-section">
                <div className="FillInTheBlank">
                    { renderQuestionWithBlank() }
                </div>

                <div className="word-bank">
                    { renderRandomWordBank() }
                </div>
                <div className="fitb-buttons">
                    <button onClick={handleBack}>Back</button>
                    <button onClick={handleSubmit}>Submit</button>
                </div>
            </div>
            { showSuccess && !isShard9 && (
                <div className="reward-overlay">
                    <div className="reward-popup">
                        <h3>Congratulations! You're ready for the next puzzle. </h3>
                        <button className="next-button" onClick={ handleContinueToNextPuzzle }>CONTINUE</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default FillInTheBlank;