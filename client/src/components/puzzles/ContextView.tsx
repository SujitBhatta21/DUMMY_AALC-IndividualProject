import type { ReactNode } from "react";
import '../../styles/ContextView.css';
import reactToString from 'react-to-string';

function ContextView({ content, onNext } : { content: ReactNode, onNext: () => void }) {

    const textToRead: string = reactToString(content);
    console.log(textToRead);

    const handleReadText = () => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(textToRead);
            window.speechSynthesis.speak(utterance);
        } else {
            alert("Browser does not support text-to-speech.");
        }
    };

    return (
        <div className="context-view">
            <button onClick={ handleReadText }>Read Context Aloud!!!</button>

            { content }
            <button className="next-btn" onClick={ onNext }>Next</button>
        </div>
    )
}

export default ContextView;