import '../styles/TimelinePage.css'
import { Header } from "../components/Header.tsx";
import {Link} from "react-router-dom";
import { FaLock, FaBook } from "react-icons/fa";
import {useEffect, useState} from "react";
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import type { Shard } from "../types.ts";
import { apiFetch } from "../utils.ts";


async function fetchShards() : Promise<Shard[]> {
    const response = await apiFetch("/api/shard");

    if (!response.ok) {
        throw new Error(response.statusText);
    }

    const data = (await response.json()) as Shard[];
    return data;
}


function TimelinePage() {
    const DEVELOPMENT_MODE = false; // I set this to true to test popup tour.

    const [shards, setShards] = useState<Shard[]>([]);
    const [completedShardIds, setCompletedShardIds] = useState<Set<number>>(new Set());

    useEffect(() => {
        document.title = 'Puzzle Timeline | AALC Interactive';
    }, []);

    // Fetching shards data from server.
    useEffect(() => {
        const getShards = async() => {
            try {
                const response = await fetchShards();
                setShards(response);
            } catch (err) {
                console.error("Failed to load the shards", err)
            }
        }
        getShards();
    }, []);

    // Fetch user's completed shards.
    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        const getProgress = async () => {
            try {
                const res = await apiFetch(`/api/progress/${userId}`);
                const data = await res.json() as { shard: { id: number } }[];
                setCompletedShardIds(new Set(data.map(p => p.shard.id)));
            } catch (err) {
                console.error("Failed to load user progress", err);
            }
        };
        getProgress();
    }, []);


    // Tutorial Tour of Timeline Page.
    useEffect(() => {
        const hasSeenTutorial = localStorage.getItem('hasSeenTimelineTutorial');

        if (DEVELOPMENT_MODE || !hasSeenTutorial) {
            const driverObj = driver({
                showProgress: true,
                steps: [
                    {
                        popover: {
                            title: 'Welcome to Interactive Memory Shards!',
                            description: 'Solve all puzzles in order to collect shards and uncover history.',
                        }
                    },
                    {
                        element: '.timeline-track1',
                        popover: {
                            title: 'Track 1',
                            description: 'Learn how apartheid began in South Africa and some out of many key events',
                        }
                    },
                    {
                        element: '.timeline-track2',
                        popover: {
                            title: 'Track 2',
                            description: 'Discover UK activism & connection with 28 Penton Street',
                        }
                    },
                    {
                        element: '.timeline-track3',
                        popover: {
                            title: 'Track 3',
                            description: 'Explore how people worldwide supported the fight against apartheid through boycotts, music, and solidarity.',
                        }
                    },
                    {
                        element: '.shards-collected-btn',
                        popover: {
                            title: 'Collect Shards',
                            description: 'Collect all 9 shards to reveal the final message!',
                        }
                    },
                ],
                onDestroyed: () => {
                    if (!DEVELOPMENT_MODE) {
                        localStorage.setItem('hasSeenTimelineTutorial', 'true');
                    }
                }
            });

            setTimeout(() => {
                driverObj.drive();
            }, 500);
        }
    }, []);

    const totalSolvedShards = completedShardIds.size;

    const isShardAccessible = (index : number) : boolean => {
        if (DEVELOPMENT_MODE) return true;
        if (index === 0) return true;
        const prevShardId = shards[index - 1]?.id;
        return prevShardId !== undefined && completedShardIds.has(prevShardId);
    }

    // BugFix: This way index of shard is not visible if the shard is locked.
    const getShardLabel = (index: number) => isShardAccessible(index) ? index + 1 : "";

    const isLocked = (index: number) => !isShardAccessible(index);

    // Helper function to get the appropriate CSS class for a shard button
    const getShardButtonClass = (index: number): string => {
        const isAccessible = isShardAccessible(index);
        const isCompleted = (shards[index]?.id !== undefined) && completedShardIds.has(shards[index].id);

        let className = 'shard-btn';
        if (!isAccessible) className += ' shard-locked';
        if (isCompleted) className += ' shard-completed';
        return className;
    };

    return (
        <main className="timeline-page">
            <Header/>
            <section className="timeline-section">
                <h1>Solve the Puzzles</h1>
                <p id="timeline-heading-quote">
                    "Read the story. Answer the clues. Solve the puzzle. Each shard unlocks a piece of history."
                </p>
                <button className="shards-collected-btn"><FaBook className="book-icon"/>SHARDS COLLECTED: { totalSolvedShards }/9</button>
                <div className="tracks">
                    <div className="timeline-track1">
                        <h3>Apartheid (South Africa)<br/></h3>
                        <div className="tt1-shards">
                            <Link to={`/storyline/shard/${ shards[0]?.id }`}>
                                <button className={getShardButtonClass(0)}>
                                    <span className="shard-number">{ getShardLabel(0) }</span>
                                    <span className="shard-title">{ shards[0]?.title }</span>
                                </button>
                            </Link>

                            <Link
                                to={`/storyline/shard/${ shards[1]?.id }`}
                                onClick={(e) => {
                                    if (!isShardAccessible(1)) {
                                        e.preventDefault();
                                    }
                                }}
                            >
                                <button className={getShardButtonClass(1)} disabled={isLocked(1)}>
                                    <span className="shard-number">{ getShardLabel(1) }</span>
                                    <span className="shard-title">{ shards[1]?.title }</span>
                                    {isLocked(1) && <FaLock className="shard-lock-icon" />}
                                </button>
                            </Link>

                            <Link
                                to={`/storyline/shard/${ shards[2]?.id }`}
                                onClick={(e) => {
                                    if (!isShardAccessible(2)) {
                                        e.preventDefault();
                                    }
                                }}
                            >
                                <button className={getShardButtonClass(2)} disabled={isLocked(2)}>
                                    <span className="shard-number">{ getShardLabel(2) }</span>
                                    <span className="shard-title">{ shards[2]?.title }</span>
                                    {isLocked(2) && <FaLock className="shard-lock-icon" />}
                                </button>
                            </Link>
                        </div>
                    </div>
                    <div className="timeline-track2">
                        <h3>UK Actions<br/></h3>
                        <div className="tt2-shards">
                            <Link
                                to={`/storyline/shard/${ shards[3]?.id }`}
                                onClick={(e) => {
                                    if (!isShardAccessible(3)) {
                                        e.preventDefault();
                                    }
                                }}
                            >
                                <button className={getShardButtonClass(3)} disabled={isLocked(3)}>
                                    <span className="shard-number">{ getShardLabel(3) }</span>
                                    <span className="shard-title">{ shards[3]?.title }</span>
                                    {isLocked(3) && <FaLock className="shard-lock-icon" />}
                                </button>
                            </Link>

                            <Link
                                to={`/storyline/shard/${ shards[4]?.id }`}
                                onClick={(e) => {
                                    if (!isShardAccessible(4)) {
                                        e.preventDefault();
                                    }
                                }}
                            >
                                <button className={getShardButtonClass(4)} disabled={isLocked(4)}>
                                    <span className="shard-number">{ getShardLabel(4) }</span>
                                    <span className="shard-title">{ shards[4]?.title }</span>
                                    {isLocked(4) && <FaLock className="shard-lock-icon" />}
                                </button>
                            </Link>

                            <Link
                                to={`/storyline/shard/${ shards[5]?.id }`}
                                onClick={(e) => {
                                    if (!isShardAccessible(5)) {
                                        e.preventDefault();
                                    }
                                }}
                            >
                                <button className={getShardButtonClass(5)} disabled={isLocked(5)}>
                                    <span className="shard-number">{ getShardLabel(5) }</span>
                                    <span className="shard-title">{ shards[5]?.title }</span>
                                    {isLocked(5) && <FaLock className="shard-lock-icon" />}
                                </button>
                            </Link>
                        </div>
                    </div>
                    <div className="timeline-track3">
                        <h3>Global Solidarity<br/></h3>
                        <div className="tt3-shards">
                            <Link
                                to={`/storyline/shard/${ shards[6]?.id }`}
                                onClick={(e) => {
                                    if (!isShardAccessible(6)) {
                                        e.preventDefault();
                                    }
                                }}
                            >
                                <button className={getShardButtonClass(6)} disabled={isLocked(6)}>
                                    <span className="shard-number">{ getShardLabel(6) }</span>
                                    <span className="shard-title">{ shards[6]?.title }</span>
                                    {isLocked(6) && <FaLock className="shard-lock-icon" />}
                                </button>
                            </Link>

                            <Link
                                to={`/storyline/shard/${ shards[7]?.id }`}
                                onClick={(e) => {
                                    if (!isShardAccessible(7)) {
                                        e.preventDefault();
                                    }
                                }}
                            >
                                <button className={getShardButtonClass(7)} disabled={isLocked(7)}>
                                    <span className="shard-number">{ getShardLabel(7) }</span>
                                    <span className="shard-title">{ shards[7]?.title }</span>
                                    {isLocked(7) && <FaLock className="shard-lock-icon" />}
                                </button>
                            </Link>

                            <Link
                                to={`/storyline/shard/${ shards[8]?.id }`}
                                onClick={(e) => {
                                    if (!isShardAccessible(8)) {
                                        e.preventDefault();
                                    }
                                }}
                            >
                                <button className={getShardButtonClass(8)} disabled={isLocked(8)}>
                                    <span className="shard-number">{ getShardLabel(8) }</span>
                                    <span className="shard-title">{ shards[8]?.title }</span>
                                    {isLocked(8) && <FaLock className="shard-lock-icon" />}
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default TimelinePage;
