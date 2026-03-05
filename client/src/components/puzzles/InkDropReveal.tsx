// Shard-9 Puzzle
import "../../styles/Puzzle.css";
import "./RewardPopup"


interface Props {
    onComplete : () => void;
    rewardsText: string;
}

function InkDropReveal({ onComplete, rewardsText } : Props) {
    return (
        <div className="ink-drop-reveal">

        </div>
    );
}

export default InkDropReveal;