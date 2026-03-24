import { type ReactNode, type ReactElement, isValidElement, useState, useEffect } from "react";
import '../../styles/ContextView.css';
import { MdVolumeUp, MdVolumeOff, MdSettings } from "react-icons/md"


interface Props {
    content: ReactNode;
    onNext: () => void;
    onBack: () => void;
}

function extractText(node: ReactNode): string {
    if (typeof node === 'string' || typeof node === 'number') return String(node);
    if (!node || typeof node === 'boolean') return '';
    if (Array.isArray(node)) return node.map(extractText).join('');
    if (isValidElement(node)) {
        const elem = node as ReactElement<{ word?: string; children?: ReactNode }>;
        if (elem.props.word) return elem.props.word;
        return extractText(elem.props.children);
    }
    return '';
}

function ContextView({ content, onNext, onBack } : Props) {

    const [isReading, setIsReading] = useState(false);

    useEffect(() => {
        return () => { window.speechSynthesis.cancel(); };
    }, []);

    /* REGEX for bugfix. Regex adds space after full stop _ before a capital letter. */
    const textToRead: string = extractText(content).replace(/([.!?])([A-Z])/g, '$1 $2');
    console.log(textToRead);

    const handleReadText = () => {
        setIsReading(true);

        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(textToRead);
            utterance.volume = parseFloat(localStorage.getItem('aalc-tts-volume') ?? '0.5'); // Updates volume slider changes.
            const savedVoice = localStorage.getItem('aalc-tts-voice');
            if (savedVoice) {
                const match = window.speechSynthesis.getVoices().find(v => v.name === savedVoice);
                if (match) utterance.voice = match;
            }
            const savedRate = localStorage.getItem('aalc-tts-rate');
            if (savedRate) utterance.rate = parseFloat(savedRate);
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

            <div className="read-aloud-row">
                <button className="read-aloud-btn" onClick={ isReading ? handleStopReading : handleReadText }>
                    { isReading ? <MdVolumeOff /> : <MdVolumeUp /> }
                    { isReading ? "Stop Reading" : "Read Context Aloud!!!" }
                </button>
                <span className="voice-settings-hint">
                    <MdSettings />
                    <span className="voice-settings-tooltip">Go to Settings to change the reading voice</span>
                </span>
            </div>

            <div className="buttons-container">
                {/* Clicking Next also pauses the screen context reading. */}
                <button className="back-btn"
                        onClick={() => {
                            window.speechSynthesis.cancel();
                            onBack();
                        }}>Back</button>
                <button className="next-btn" onClick={() => { window.speechSynthesis.cancel(); onNext() } }>Next</button>
            </div>
        </div>
    )
}

export default ContextView;