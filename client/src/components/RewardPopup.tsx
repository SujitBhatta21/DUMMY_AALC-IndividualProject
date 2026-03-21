import { useCallback, useEffect } from "react";
import ReactCanvasConfetti from "react-canvas-confetti";
import ConfettiPop from "../assets/audio/balloon-pop.mp3";


interface RewardPopupProps {
    rewardsText: string;
    onComplete: () => void;
}

function RewardPopup({ rewardsText, onComplete }: RewardPopupProps) {
    useEffect(() => {
        new Audio(ConfettiPop).play();
    }, []);

    const onInit = useCallback(({ confetti }: { confetti: (opts: object) => void }) => {
        confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 },
        });
    }, []);

    return (
        <>
            <ReactCanvasConfetti
                onInit={onInit}
                style={{
                    position: "fixed",
                    width: "100%",
                    height: "100%",
                    top: 0,
                    left: 0,
                    pointerEvents: "none",
                    zIndex: 1000,
                }}
            />
            <div className="reward-overlay">
                <div className="reward-popup">
                    <h3>Shard Unlocked!</h3>
                    <p>{rewardsText}</p>
                    <button className="next-button" onClick={onComplete}>CONTINUE</button>
                </div>
            </div>
        </>
    );
}

export default RewardPopup;