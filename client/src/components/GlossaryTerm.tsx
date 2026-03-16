import { useState } from "react";
import glossary from "../data/glossary.ts"
import "../styles/GlossaryTerm.css";


function GlossaryTerm({word} : { word: string }) {
    const [visible, setVisible] = useState(false);
    const definition = glossary[word];
    if (!definition) return <span>{word}</span>

    return (
        <span
            className="glossary-term"
            tabIndex={0}
            role="button"
            aria-label={`${word}: ${definition}`}
            onMouseEnter={() => { setVisible(true)} }
            onMouseLeave={() => { setVisible(false)} }
            onFocus={() => { setVisible(true)} }
            onBlur={() => { setVisible(false)} }
        >
            {word}
            {visible && <span className="glossary-tooltip" aria-hidden="true">{ definition }</span>}
        </span>
    );
}

export default GlossaryTerm;