import "../../styles/Puzzle.css"
import "../../styles/RedactedReveal.css"
import {useEffect, useRef, useState} from "react";
import RewardPopup from "../RewardPopup.tsx";


interface RedactedRevealProps {
    onComplete: () => void;
    rewardsText: string;
}


interface RedactedWord {
    id: number;
    answer: string;
    options: string[]
}

const redactedWords: RedactedWord[] = [
    { id: 0, answer: "Sharpeville", options: ["Sharpeville", "Johannesburg", "Cape Town"] },
    { id: 1, answer: "ANC", options: ["ANC", "PAC", "United Party"] },
    { id: 2, answer: "pamphlets", options: ["pamphlets", "weapons", "radios"] },
    { id: 3, answer: "gatherings", options: ["gatherings", "businesses", "schools"] },
    { id: 4, answer: "a passbook", options: ["a passbook", "a weapon", "a permit"] },
];


const documentDescription: string[] = [
    "Following the liberation movements at ",
    ", the government has declared the ",
    " to be a banned organisation. All members found in possession of ",
    " will face arrest. Public ",
    " of any kind are now illegal. Citizens are reminded that ",
    " is required at all times.",
];


function RedactedReveal({ onComplete, rewardsText }: RedactedRevealProps) {

    const [revealedText, setRevealedText] = useState<Record<string, boolean>>({});
    const [activePopup, setActivePopup] = useState<number | null>(null);
    const [shakeId, setShakeId] = useState<number | null>(null);
    const [solved, setSolved] = useState<boolean>(false);
    const popupRef = useRef<HTMLSpanElement>(null);


    useEffect(() => {
        if (activePopup === null) return;

        const handleClickOutside = (e: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
                setActivePopup(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => { document.removeEventListener("mousedown", handleClickOutside) };
    }, [activePopup]);


    // Function called to do something when redacted block is clicked.
    const handleRedactedClick = (wordId: number) => {
        if (revealedText[wordId]) return;
        setActivePopup(activePopup === wordId ? null : wordId);
    }

    const handleOptionFromRedactedClick = (wordId: number, selectedOption: string) => {
        const word = redactedWords.find(w => w.id === wordId);
        if (!word) return;

        if (selectedOption === word.answer) {
            const text = { ...revealedText, [wordId] : true };
            setRevealedText(text)
            setActivePopup(null);

            // Check if all words are now revealed
            if (Object.keys(text).length === redactedWords.length) {
                setSolved(true);
            }
        }

        else {
            // Wrong answer — shake and close
            setShakeId(wordId);
            setActivePopup(null);
            setTimeout(() => {
                setShakeId(null);
            }, 500) ;
        }
    }


    const renderRedactedWord = (word: RedactedWord) => {
        if (revealedText[word.id]) {
            return (
                <span key={word.id} className="revealed-word">
                    {word.answer}
                </span>
            );
        }

        return (
            <span key={word.id} className="redacted-wrapper">
                <span
                    className={`redacted ${shakeId === word.id ? "shake" : ""}`}
                    onClick={() => { handleRedactedClick(word.id)} }
                >
                    {word.answer}
                </span>
                {activePopup === word.id && (
                    <span className="options-popup" ref={popupRef}>
                        {word.options.map((option) => (
                            <button
                                key={option}
                                className="option-btn"
                                onClick={() => { handleOptionFromRedactedClick(word.id, option)} }
                            >
                                {option}
                            </button>
                        ))}
                    </span>
                )}
            </span>
        );
    };

    return (
        <div className="redactedReveal-section">
            <h1 className="puzzle-title">Declassify the Document</h1>
            <p className="puzzle-instruction">
                Click on each redacted (blacked-out) section and choose the correct word to reveal the hidden text.
            </p>
                <div className="redactedReveal-container">
                    <div className="document-header">
                        <p className="confidential-stamp">CONFIDENTIAL</p>
                        <p className="document-title">SOUTH AFRICAN GOVERNMENT</p>
                        <p className="document-date">Date: 1960</p>
                    </div>
                    <div>
                        <div className="document-description-redacted">
                            { documentDescription.map((description: string, index: number) => (
                                <span key={ index }>
                                    { description }
                                    { index < redactedWords.length && renderRedactedWord(redactedWords[index])}
                                </span>
                            )) }
                        </div>
                        <p className="document-disclaimer">
                            <br/> The content above is not an official document. It is a fictional example
                            created for the purpose of this educational project.
                        </p>
                    </div>
            </div>

            {/* Final text overlay if the puzzle is completed,,, */}
            { solved && (
                <RewardPopup rewardsText={rewardsText} onComplete={onComplete} />
            )}
        </div>
    );
}

export default RedactedReveal;
