import type { ReactNode } from "react";
import '../../styles/ContextView.css';

function ContextView({ content, onNext } : { content: ReactNode, onNext: () => void }) {
    return (
        <div className="context-view">
            { content }
            <button className="next-btn" onClick={ onNext }>Next</button>
        </div>
    )
}

export default ContextView;