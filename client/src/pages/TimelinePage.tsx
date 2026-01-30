import '../styles/TimelinePage.css'
import {Header} from "../components/Header.tsx";
import {Link} from "react-router-dom";


function TimelinePage() {
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
                            <Link to="/storyline/1">
                                <button className="shard-btn">1</button>
                            </Link>

                            <button className="shard-btn">2</button>
                            <button className="shard-btn">3</button>
                        </div>
                    </div>
                    <div className="timeline-track2">
                        <h3>UK Actions<br/></h3>
                        <div className="tt2-shards">
                            <button className="shard-btn">1</button>
                            <button className="shard-btn">2</button>
                            <button className="shard-btn">3</button>
                        </div>
                    </div>
                    <div className="timeline-track3">
                        <h3>Global Solidarity<br/></h3>
                        <div className="tt3-shards">
                            <button className="shard-btn">1</button>
                            <button className="shard-btn">2</button>
                            <button className="shard-btn">3</button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default TimelinePage;
