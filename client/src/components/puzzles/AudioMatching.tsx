import "../../styles/AudioMatching.css";
import "../../styles/Puzzle.css";
import { useRef, useState } from "react";
import song1 from "../../assets/audio/A Luta Continua.mp3";
import song2 from "../../assets/audio/Afrika Mayibuye Response.mp3";
import song3 from "../../assets/audio/Chimurenga Dzakatanga  (The Struggle Continues in Zimbabwe).mp3";
import song4 from "../../assets/audio/Thina Sizwe - SABC Choir (Amandla!).mp3";
import song5 from "../../assets/audio/Thuma Mina.mp3";
import song6 from "../../assets/audio/Tsoha Vuka.mp3";
import RewardPopup from "./RewardPopup.tsx";

interface Props {
    onComplete: () => void;
    rewardsText: string;
}

interface SONG {
    id: number;
    title: string;
    origin: string;
    src: string;
    type: "HOPE" | "DEFIANCE";
}

interface BUCKET {
    id: "HOPE" | "DEFIANCE";
    label: string;
}

const SONGS: SONG[] = [
    { id: 1, title: "A Luta Continua",           origin: "Mozambican Freedom Song",     src: song1, type: "DEFIANCE" },
    { id: 2, title: "Afrika Mayibuye Response",  origin: "South African Freedom Song",  src: song2, type: "HOPE"     },
    { id: 3, title: "Chimurenga Dzakatanga",     origin: "Zimbabwean Liberation Song",  src: song3, type: "DEFIANCE" },
    { id: 4, title: "Thina Sizwe",               origin: "South African Hymn",          src: song4, type: "HOPE"     },
    { id: 5, title: "Thuma Mina",                origin: "South African Hymn",          src: song5, type: "HOPE"     },
    { id: 6, title: "Tsoha Vuka",                origin: "South African Freedom Song",  src: song6, type: "DEFIANCE" },
];

const BUCKETS: BUCKET[] = [
    { id: "HOPE",     label: "HOPE"     },
    { id: "DEFIANCE", label: "DEFIANCE" },
];

function AudioMatching({ onComplete, rewardsText }: Props) {
    const [playingId, setPlayingId]   = useState<number | null>(null);
    const [buckets, setBuckets]       = useState<Record<string, number[]>>({ HOPE: [], DEFIANCE: [] });
    const [wrongBucket, setWrongBucket] = useState<string | null>(null);
    const [solved, setSolved]         = useState(false);
    const audioRef = useRef<HTMLAudioElement>(new Audio());

    // Songs not yet placed in any bucket
    const placedIds = new Set([...buckets.HOPE, ...buckets.DEFIANCE]);
    const unplacedSongs = SONGS.filter(s => !placedIds.has(s.id));

    const handlePlay = (id: number, src: string) => {
        if (playingId === id) {
            audioRef.current.pause();
            setPlayingId(null);
        } else {
            audioRef.current.pause();
            audioRef.current.src = src;
            audioRef.current.play();
            setPlayingId(id);
        }
    };

    const handleDragStart = (e: React.DragEvent, songId: number) => {
        audioRef.current.pause();
        setPlayingId(null);
        e.dataTransfer.setData("songId", String(songId));
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent, bucketId: "HOPE" | "DEFIANCE") => {
        e.preventDefault();
        const songId = Number(e.dataTransfer.getData("songId"));
        const song = SONGS.find(s => s.id === songId);
        if (!song) return;

        if (song.type === bucketId) {
            const updated = { ...buckets, [bucketId]: [...buckets[bucketId], songId] };
            setBuckets(updated);

            const allSolved = SONGS.every(s => updated[s.type].includes(s.id));
            if (allSolved) setSolved(true);
        } else {
            setWrongBucket(bucketId);
            setTimeout(() => { setWrongBucket(null) }, 600) ;
        }
    };

    return (
        <div className="audio-matching">
            <audio ref={audioRef} onEnded={() => { setPlayingId(null)} } />

            <section className="header-title-container">
                <h1 className="puzzle-title">Audio Matching Puzzle</h1>
                <p className="puzzle-instruction">
                    Listen and feel the emotion of the song - HOPE or DEFIANCE.
                    Then, drag a music card into the correct bucket. <br />
                    Remember: the language barrier (no subtitles) is part of the puzzle —
                    read the emotion in the music, not the words.
                </p>
            </section>

            {/* Music cards — only unplaced songs shown */}
            <section className="music-cards-grid">
                {unplacedSongs.map((song) => (
                    <div
                        key={song.id}
                        className={`music-card ${playingId === song.id ? "playing" : ""}`}
                        draggable
                        onDragStart={(e) => { handleDragStart(e, song.id)} }
                    >
                        <span>♪</span>
                        <p className="music-card-title">{song.title}</p>
                        <p className="music-card-origin">{song.origin}</p>
                        <button
                            className="music-card-btn"
                            onClick={() => { handlePlay(song.id, song.src)} }
                        >
                            {playingId === song.id ? "⏸ Pause" : "▶ Play"}
                        </button>
                    </div>
                ))}
                {unplacedSongs.length === 0 && (
                    <p className="am-all-placed">All songs placed!</p>
                )}
            </section>

            {/* Buckets */}
            <section className="bucket-container">
                {BUCKETS.map((bucket) => (
                    <div
                        key={bucket.id}
                        className={`am-bucket ${wrongBucket === bucket.id ? "am-bucket--wrong" : ""}`}
                        onDragOver={handleDragOver}
                        onDrop={(e) => { handleDrop(e, bucket.id)} }
                    >
                        <p className="am-bucket-label">{bucket.label}</p>
                        <div className="am-bucket-stack">
                            {buckets[bucket.id].map((id) => {
                                const song = SONGS.find(s => s.id === id)!;
                                return (
                                    <div key={id} className="am-placed-card">
                                        <span>♪</span>
                                        <span className="am-placed-title">{song.title}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </section>

            {solved && (
                <RewardPopup rewardsText={rewardsText} onComplete={onComplete} />
            )}
        </div>
    );
}

export default AudioMatching;