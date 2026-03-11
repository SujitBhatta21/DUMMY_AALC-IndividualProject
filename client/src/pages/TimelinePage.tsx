import '../styles/TimelinePage.css'
import { Header } from "../components/Header.tsx";
import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import type { Shard } from "../types.ts";


async function fetchShards() : Promise<Shard[]> {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/shard`);

    if (!response.ok) {
        throw new Error(response.statusText);
    }

    const data = (await response.json()) as Shard[];
    return data;
}


function TimelinePage() {
    const DEVELOPMENT_MODE = true; // I set this to true to test popup tour.

    const [shards, setShards] = useState<Shard[]>([]);

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

    const totalSolvedShards = shards.filter(s => s.completed).length

    const isShardAccessible = (index : number) : boolean => {
        if (DEVELOPMENT_MODE) return true;
        if (index === 0) return true;
        return (shards[index - 1]?.completed ?? false);
    }

    // BugFix: This way index of shard is not visible if the shard is locked.
    const getShardLabel = (index: number) => isShardAccessible(index) ? shards[index]?.id : "";

    // Helper function to get the appropriate CSS class for a shard button
    const getShardButtonClass = (index: number): string => {
        const isAccessible = isShardAccessible(index);
        const isCompleted = shards[index]?.completed ?? false;

        let className = 'shard-btn';
        if (!isAccessible) className += ' shard-locked';
        if (isCompleted) className += ' shard-completed';
        return className;
    };

    return (
        <div className="timeline-page">
            <Header/>
            <section className="timeline-section">
                <h1>Solve the Puzzles</h1>
                <p id="timeline-heading-quote">
                    "Read the story. Answer the clues. Solve the puzzle. Each shard unlocks a piece of history."
                </p>
                <button className="shards-collected-btn">SHARDS COLLECTED: { totalSolvedShards }/9</button>
                <div className="tracks">
                    <div className="timeline-track1">
                        <h3>Apartheid (South Africa)<br/></h3>
                        <div className="tt1-shards">
                            <Link to={`/storyline/shard/${ shards[0]?.id }`}>
                                <button className={getShardButtonClass(0)}>{ getShardLabel(0) }</button>
                            </Link>

                            <Link
                                to={`/storyline/shard/${ shards[1]?.id }`}
                                onClick={(e) => {
                                    if (!isShardAccessible(1)) {
                                        e.preventDefault();
                                    }
                                }}
                            >
                                <button className={getShardButtonClass(1)}>{ getShardLabel(1) }</button>
                            </Link>

                            <Link
                                to={`/storyline/shard/${ shards[2]?.id }`}
                                onClick={(e) => {
                                    if (!isShardAccessible(2)) {
                                        e.preventDefault();
                                    }
                                }}
                            >
                                <button className={getShardButtonClass(2)}>{ getShardLabel(2) }</button>
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
                                <button className={getShardButtonClass(3)}>{ getShardLabel(3) }</button>
                            </Link>

                            <Link
                                to={`/storyline/shard/${ shards[4]?.id }`}
                                onClick={(e) => {
                                    if (!isShardAccessible(4)) {
                                        e.preventDefault();
                                    }
                                }}
                            >
                                <button className={getShardButtonClass(4)}>{ getShardLabel(4) }</button>
                            </Link>

                            <Link
                                to={`/storyline/shard/${ shards[5]?.id }`}
                                onClick={(e) => {
                                    if (!isShardAccessible(5)) {
                                        e.preventDefault();
                                    }
                                }}
                            >
                                <button className={getShardButtonClass(5)}>{ getShardLabel(5) }</button>
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
                                <button className={getShardButtonClass(6)}>{ getShardLabel(6) }</button>
                            </Link>

                            <Link
                                to={`/storyline/shard/${ shards[7]?.id }`}
                                onClick={(e) => {
                                    if (!isShardAccessible(7)) {
                                        e.preventDefault();
                                    }
                                }}
                            >
                                <button className={ getShardButtonClass(7)}>{ getShardLabel(7) }</button>
                            </Link>

                            <Link
                                to={`/storyline/shard/${ shards[8]?.id }`}
                                onClick={(e) => {
                                    if (!isShardAccessible(8)) {
                                        e.preventDefault();
                                    }
                                }}
                            >
                                <button className={getShardButtonClass(8)}>{ getShardLabel(8) }</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default TimelinePage;
