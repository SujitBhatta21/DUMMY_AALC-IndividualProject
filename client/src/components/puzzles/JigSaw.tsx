

interface JigSawProps {
    onComplete?: () => void
}

function JigSaw({ onComplete }: JigSawProps) {
    return (
        <div>
            <button onClick={onComplete}>GOTO NEXT (Shard)</button>
        </div>
    );
}

export default JigSaw;