import { type ReactNode, useState } from "react";
import '../../styles/ContextView.css';
import reactToString from 'react-to-string';
import { MdVolumeUp, MdVolumeOff } from "react-icons/md"


function ContextView({ content, onNext } : { content: ReactNode, onNext: () => void }) {

    const [isReading, setIsReading] = useState(false);

    /* REGEX for bugfix. Regex adds space after full stop _ before a capital letter. */
    const textToRead: string = reactToString(content).replace(/([.!?])([A-Z])/g, '$1 $2');
    console.log(textToRead);

    const handleReadText = () => {
        setIsReading(true);

        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(textToRead);
            utterance.onend = () => { setIsReading(false) };
            window.speechSynthesis.speak(utterance);
        } else {
            alert("Browser does not support text-to-speech.");
        }
    };

    const handleStopReading = () => {
        window.speechSynthesis.cancel();
        setIsReading(false);
    }

    return (
        <div className="context-view">

            { content }

            <button className="read-aloud-btn" onClick={ isReading ? handleStopReading : handleReadText }>
                { isReading ? <MdVolumeOff /> : <MdVolumeUp /> }
                { isReading ? "Stop Reading" : "Read Context Aloud!!!" }
            </button>

            {/* Clicking Next also pauses the screen context reading. */}
            <button className="next-btn" onClick={() => { window.speechSynthesis.cancel(); onNext(); }}>Next</button>
        </div>
    )
}

export default ContextView;