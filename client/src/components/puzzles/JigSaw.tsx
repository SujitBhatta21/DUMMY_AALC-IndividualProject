import { useState } from "react";
import { JigsawPuzzle } from "react-jigsaw-puzzle"
import "react-jigsaw-puzzle/lib/jigsaw-puzzle.css";
import "../../styles/Puzzle.css";
import "../../styles/JigSaw.css";

interface JigSawProps {
    onComplete?: () => void
    rewardsText?: string
}



function JigSaw({ onComplete, rewardsText }: JigSawProps) {
    const imageSource = "https://upload.wikimedia.org/wikipedia/commons/7/72/Protestors_discarding_passbooks_in_South_Africa.jpg"

    const [solved, setSolved] = useState<boolean>(false)

    const handleSolved = () => {
        setSolved(true);
    }

    return (
        <div className="jigsaw-page">
            <h1 className="puzzle-title">Jigsaw Puzzle</h1>
            <p className="puzzle-instruction">
                Drag and Drop fragments of real passbook image in correct slot
            </p>
            <div className="jigsaw-container">
                <div className="jigsaw-puzzle">
                    <h3>Jigsaw Puzzle</h3>
                    <div className="jigsaw-puzzle__border">
                        <JigsawPuzzle
                            imageSrc={imageSource}
                            rows={2}
                            columns={2}
                            onSolved={ handleSolved }
                        />
                    </div>
                </div>
                <div className="jigsaw-solution">
                    <h3>Solution</h3>
                    <img src={imageSource} alt="Puzzle solution" />
                </div>
            </div>
            { solved && (
                <div className="reward-overlay">
                    <div className="reward-popup">
                        <h3>Shard Unlocked!</h3>
                        <p>{ rewardsText }</p>
                        <button className="next-button" onClick={onComplete}>CONTINUE</button>
                    </div>
                </div>
            )}
        </div>
        // { solved &&
        // <button className="next-button" onClick={ onComplete }>CONTINUE</button>
        // }
    );
}

export default JigSaw;