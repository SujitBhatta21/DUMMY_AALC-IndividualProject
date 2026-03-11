// Shard-9 Puzzle
import "../../styles/Puzzle.css";
import "../../styles/InkDropReveal.css";
import RewardPopup from "./RewardPopup";
import { useEffect, useRef, useCallback, useState } from "react";


interface Props {
    onComplete: () => void;
    rewardsText: string;
}

const BRUSH_RADIUS     = 50;
const CHECK_EVERY      = 40;    // check completion every N erase calls
const REVEAL_THRESHOLD = 0.80;  // 80% of black cleared = solved


function inkdropReveal({ onComplete, rewardsText }: Props) {
    const canvasRef      = useRef<HTMLCanvasElement>(null);
    const scratchAreaRef = useRef<HTMLDivElement>(null);
    const isErasingRef   = useRef(false);
    const strokeCountRef = useRef(0);
    const [solved, setSolved] = useState(false);
    const [showReward, setShowReward] = useState(false);

    // Fill canvas solid black once mounted
    useEffect(() => {
        const canvas  = canvasRef.current;
        const wrapper = scratchAreaRef.current;
        if (!canvas || !wrapper) return;

        canvas.width  = wrapper.offsetWidth;
        canvas.height = wrapper.offsetHeight;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.fillStyle = "#111111";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }, []);

    const erase = useCallback((x: number, y: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.arc(x, y, BRUSH_RADIUS, 0, Math.PI * 2);
        ctx.fill();

        // Throttled completion check — avoids sampling every pixel every frame
        strokeCountRef.current += 1;
        if (strokeCountRef.current % CHECK_EVERY !== 0) return;

        const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let transparent = 0;
        for (let i = 3; i < data.length; i += 4) {
            if (data[i] < 10) transparent++;
        }
        if (transparent / (canvas.width * canvas.height) >= REVEAL_THRESHOLD) {
            setSolved(true);
        }
    }, []);

    const getPosFromMouse = (e: React.MouseEvent) => {
        const rect = canvasRef.current!.getBoundingClientRect();
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const getPosFromTouch = (e: React.TouchEvent) => {
        const rect = canvasRef.current!.getBoundingClientRect();
        return {
            x: e.touches[0].clientX - rect.left,
            y: e.touches[0].clientY - rect.top,
        };
    };

    const handleMouseDown  = (e: React.MouseEvent) => {
        isErasingRef.current = true;
        const { x, y } = getPosFromMouse(e);
        erase(x, y);
    };
    const handleMouseMove  = (e: React.MouseEvent) => {
        if (!isErasingRef.current) return;
        const { x, y } = getPosFromMouse(e);
        erase(x, y);
    };
    const handleMouseUp    = () => { isErasingRef.current = false; };

    const handleTouchStart = (e: React.TouchEvent) => {
        e.preventDefault();
        isErasingRef.current = true;
        const { x, y } = getPosFromTouch(e);
        erase(x, y);
    };
    const handleTouchMove  = (e: React.TouchEvent) => {
        e.preventDefault();
        if (!isErasingRef.current) return;
        const { x, y } = getPosFromTouch(e);
        erase(x, y);
    };
    const handleTouchEnd   = () => { isErasingRef.current = false; };

    return (
        <div className="inkdrop-wrapper">
            <h1 className="puzzle-title">Uncover the Hidden Record</h1>
            <p className="puzzle-instruction">
                Click and drag to rub away the black and reveal what was hidden.
            </p>

            <div className="inkdrop-scratch-area" ref={scratchAreaRef}>

                {/* Document — always rendered underneath the canvas */}
                <div className="inkdrop-document">
                    <div className="inkdrop-header">
                        <p className="inkdrop-stamp">CLASSIFIED</p>
                        <p className="inkdrop-title">SECURITY BRANCH — INTELLIGENCE REPORT</p>
                        <p className="inkdrop-date">Subject: The Freedom Charter &nbsp;|&nbsp; Ref: SB/1956/041</p>
                    </div>

                    <div className="inkdrop-body">
                        <p>
                            The document known as the Freedom Charter was adopted at a public gathering
                            in <strong>Kliptown</strong> on 26 June 1955. Approximately <strong>3,000</strong> delegates
                            representing the <strong>Congress Alliance</strong> endorsed the document, which openly
                            declares that South Africa belongs to <em>"all who live in it."</em>
                        </p>
                        <p>
                            The Charter was submitted as evidence in the 1956 <strong>Treason Trial</strong>, in which
                            156 leaders were charged with high treason. Despite suppression efforts,
                            its principles later shaped South Africa's post-apartheid <strong>Constitution</strong>.
                        </p>
                    </div>

                    <p className="inkdrop-disclaimer">
                        This is a fictional intelligence report created for educational purposes, based on real historical events.
                    </p>
                </div>

                {/* Black canvas overlay — sits on top, user rubs it away */}
                {!solved && (
                    <canvas
                        ref={canvasRef}
                        className="inkdrop-canvas"
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    />
                )}
            </div>

            { solved &&
                <button className="solved-continue-btn" onClick={() => { setShowReward(true) }}>
                    CONTINUE
                </button>
            }

            { showReward && <RewardPopup rewardsText={rewardsText} onComplete={onComplete} />}
        </div>
    );
}

export default inkdropReveal;