import Header from "../components/Header.tsx";
import { useParams } from "react-router-dom";
import {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom"
import FillInTheBlank from "../components/puzzles/FillInTheBlank.tsx"
import type { Shard } from "../types.ts";
import ContextView from "../components/puzzles/ContextView.tsx";
import JigSaw from "../components/puzzles/JigSaw.tsx";
import shardContent from "../data/shardContent.tsx";
import RedactedReveal from "../components/puzzles/RedactedReveal.tsx";
import OrderEventsChronological from "../components/puzzles/OrderEventsChronological.tsx";


function ShardPage() {
    const { id } = useParams();

    const navigate = useNavigate();

    const [shardData, setShardData] = useState<Shard | null>(null);

    // To keep track of things e.g. For Shard 1: context(1) -> fill_the_blank(2) -> Jigsaw(3)
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        if  (!id) return;

        const fetchPuzzles = async() => {
            try {
                const res : Response = await fetch(`http://localhost:8080/api/shard/${id}`);
                const data: Shard = await res.json() as Shard; // await deconstructs return type Promise<Shard>.
                setShardData(data);
            }
            catch (err) {
                console.log("Failed to load puzzle data", err);
            }
        }
        fetchPuzzles()
    }, [id]);

    console.log(shardData);


    // NOTE: Calls the onComplete method from @PostMapping("/{id}/complete") in ShardController.java
    function handleShardComplete() {
        void fetch(`http://localhost:8080/api/shard/${id}/complete`, {
            method: "POST"
        })
            .then(res => res.json())
            .then(() => navigate("/storyline"));
    }


    return (
        <div className="shard-page">
            <Header />

            { currentStep === 0 && shardData && (
                <ContextView
                    content={shardContent[shardData.id]}
                    onNext={() => { setCurrentStep(currentStep + 1); }}
                />
            )}

            { currentStep === 1 && shardData && (
                <FillInTheBlank
                    question={shardData.fitb_question}   // NOTE::: HAVE QUESTION IN HERE
                    answers={ shardData.fitb_answer }    // Contains wrong options as well.
                    onCorrect={() => { setCurrentStep(currentStep + 1); }}
                    onBack={() => { setCurrentStep(currentStep - 1); }}
                />
            )}

            { currentStep === 2 && shardData &&
                <>
                    {/* For Shard-1 jigsaw. */}
                    { shardData.puzzleType === "JIGSAW" && (
                        <JigSaw
                            onComplete={() => { handleShardComplete(); }}
                            rewardsText={ shardData.rewardsText }
                        />
                    )}

                    {/* For Shard-2 Redacted Reveal */}
                    { shardData.puzzleType === "REDACTED_REVEAL" && (
                        <RedactedReveal
                            onComplete={() => { handleShardComplete(); }}
                            rewardsText={ shardData.rewardsText }
                        />
                    )}

                    {/* For Shard-3 Redacted Reveal */}
                    { shardData.puzzleType === "ORDER_EVENTS_CHRONOLOGICALLY" && (
                        <OrderEventsChronological
                            onComplete={() => { handleShardComplete(); }}
                            rewardsText={ shardData.rewardsText }
                        />
                    )}
                </>
            }

            {/*{shardData?.id === 1 ? <FillInTheBlank props={shardData.}} /> : null}*/}
            <div className="shard-container">

            </div>

        </div>
    );
}

export default ShardPage;
