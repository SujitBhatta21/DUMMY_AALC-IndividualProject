import Header from "../components/Header.tsx";
import { useEffect, useState } from "react";
import "../styles/Settings.css";
import { SIZE_MAP } from "../types.ts";

const SPEED_OPTIONS = [
    { label: 'Slow', value: 0.75 },
    { label: 'Normal', value: 1 },
    { label: 'Fast', value: 1.5 },
];

const SIZE_OPTIONS = ['Small', 'Medium', 'Large'];

// Filtering these speech voices from the voice synthesis pool.
const UNPROFESSIONAL_VOICES = [
    'Jester', 'Grandma', 'Granddad', 'Bahh', 'Bells', 'Boing', 'Bubbles',
    'Cellos', 'Good News', 'Hysterical', 'Organ', 'Superstar', 'Trinoids',
    'Whisper', 'Zarvox', 'Bad News', 'Deranged', 'Junior', 'Pipe Organ',
    'Princess', 'Ralph', 'Wobble', 'Xenophone', 'Fred', 'Albert',
];

function Settings() {
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [selectedVoice, setSelectedVoice] = useState(localStorage.getItem('aalc-tts-voice') ?? '');
    const [voiceSaved, setVoiceSaved] = useState(false);
    const [speed, setSpeed] = useState(parseFloat(localStorage.getItem('aalc-tts-rate') ?? '1'));
    const [textSize, setTextSize] = useState(localStorage.getItem('aalc-text-size') ?? 'Medium');

    useEffect(() => {
        document.title = 'Settings | AALC Interactive';
    }, []);

    useEffect(() => {
        const load = () => {
            const available = window.speechSynthesis.getVoices()
                .filter(v => v.lang.startsWith('en'))
                .filter(v => !UNPROFESSIONAL_VOICES.some(n => v.name.includes(n)));
            setVoices(available);

            // Setting default voice to Google UK English Female for professional tone.
                // Also, other voices are fallback if the website doesn't offer preffered voices.
            if (!localStorage.getItem('aalc-tts-voice')) {
                const preferred = available.find(v => v.name === 'Google UK English Female')
                               ?? available.find(v => v.name === 'Google UK English Male')
                               ?? available.find(v => v.name === 'Daniel')
                               ?? available.find(v => v.lang === 'en-GB')
                               ?? available[0];
                if (preferred) {
                    setSelectedVoice(preferred.name);
                    localStorage.setItem('aalc-tts-voice', preferred.name);
                }
            }
        };
        load();
        window.speechSynthesis.addEventListener('voiceschanged', load);
        return () => { window.speechSynthesis.removeEventListener('voiceschanged', load) };
    }, []);

    const handleVoiceChange = (name: string) => {
        setSelectedVoice(name);
        localStorage.setItem('aalc-tts-voice', name);
        setVoiceSaved(true);
        setTimeout(() => { setVoiceSaved(false) }, 2000);
    };

    const handleSpeedChange = (value: number) => {
        setSpeed(value);
        localStorage.setItem('aalc-tts-rate', String(value));
    };

    const handleSizeChange = (size: string) => {
        setTextSize(size);
        localStorage.setItem('aalc-text-size', size);
        document.body.style.fontSize = SIZE_MAP[size];
    };

    return (
        <div>
            <Header />
            <div className="settings-page">
                <h1>Settings</h1>

                <div className="settings-section">
                    <h2>Reading Voice</h2>
                    <div className="settings-row">
                        <label htmlFor="voice-select">Voice</label>
                        <select
                            id="voice-select"
                            value={selectedVoice}
                            onChange={e => {  handleVoiceChange(e.target.value)} }
                        >
                            <option value="">Default</option>
                            {voices.map(v => (
                                <option key={v.name} value={v.name}>
                                    {v.name} ({v.lang})
                                </option>
                            ))}
                        </select>
                        {voiceSaved && <span className="settings-saved">✓ Saved</span>}
                    </div>
                </div>

                <div className="settings-section">
                    <h2>Reading Speed</h2>
                    <div className="settings-row">
                        <label>Speed</label>
                        <div className="btn-group">
                            {SPEED_OPTIONS.map(opt => (
                                <button
                                    key={opt.value}
                                    className={`btn-group-item ${speed === opt.value ? 'active' : ''}`}
                                    onClick={() => { handleSpeedChange(opt.value)} }
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="settings-section">
                    <h2>Text Size</h2>
                    <div className="settings-row">
                        <label>Size</label>
                        <div className="btn-group">
                            {SIZE_OPTIONS.map(size => (
                                <button
                                    key={size}
                                    className={`btn-group-item ${textSize === size ? 'active' : ''}`}
                                    onClick={() => { handleSizeChange(size)} }
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Settings;