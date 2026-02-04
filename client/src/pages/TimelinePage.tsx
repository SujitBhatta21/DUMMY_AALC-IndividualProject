import '../styles/TimelinePage.css'
import { Header } from "../components/Header.tsx";
import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import type { Shard } from "../types.ts";


async function fetchShards() : Promise<Shard[]> {
    const response = await fetch("http://localhost:8080/api/shard");

    if (!response.ok) {
        throw new Error(response.statusText);
    }

    const data = (await response.json()) as Shard[];
    return data;
}


function TimelinePage() {
    const DEVELOPMENT_MODE = true; // I set this up so that I can test popup tour.

    const [shards, setShards] = useState<Shard[]>([]);

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


    return (
        <div className="timeline-page">
            <Header/>
            <section className="timeline-section">
                <h1>StoryLine Tracks</h1>
                <p id="timeline-heading-quote">""PUT A QUOTE HERE...""</p>
                <button className="shards-collected-btn">SHARDS COLLECTED: 0/9</button>
                <div className="tracks">
                    <div className="timeline-track1">
                        <h3>Apartheid (South Africa)<br/></h3>
                        <div className="tt1-shards">
                            {/* eslint-disable-next-line @typescript-eslint/restrict-template-expressions */}
                            <Link to={`/storyline/shard/${ shards[0]?.id }`}>
                                <button className="shard-btn">{ shards[0]?.id }</button>
                            </Link>

                            <Link
                                to={`/storyline/shard/${ shards[1]?.id }`}
                                onClick={(e) => {
                                    const allowNavigate : boolean = shards[0]?.completed;
                                    if (!allowNavigate) {
                                        e.preventDefault();
                                    }
                                }}
                            >
                                <button>{ shards[1]?.id }</button>
                            </Link>

                            <button className="shard-btn">3</button>
                        </div>
                    </div>
                    <div className="timeline-track2">
                        <h3>UK Actions<br/></h3>
                        <div className="tt2-shards">
                            <button className="shard-btn">4</button>
                            <button className="shard-btn">5</button>
                            <button className="shard-btn">6</button>
                        </div>
                    </div>
                    <div className="timeline-track3">
                        <h3>Global Solidarity<br/></h3>
                        <div className="tt3-shards">
                            <button className="shard-btn">7</button>
                            <button className="shard-btn">8</button>
                            <button className="shard-btn">9</button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default TimelinePage;
