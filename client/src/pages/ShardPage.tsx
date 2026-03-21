import Header from "../components/Header.tsx";
import { apiFetch } from "../utils.ts";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import type { Shard } from "../types.ts";
import FillInTheBlank from "../components/puzzles/FillInTheBlank.tsx"
import ContextView from "../components/puzzles/ContextView.tsx";
import JigSaw from "../components/puzzles/JigSaw.tsx";
import shardContent from "../data/shardContent.tsx";
import RedactedReveal from "../components/puzzles/RedactedReveal.tsx";
import OrderEventsChronological from "../components/puzzles/OrderEventsChronological.tsx";
import DecisionTree from "../components/puzzles/DecisionTree.tsx";
import DragAndCategorise from "../components/puzzles/DragAndCategorise.tsx";
import CommunicationNetwork from "../components/puzzles/CommunicationNetwork.tsx";
import ConnectMatching from "../components/puzzles/ConnectMatching.tsx";
import InkDropReveal from "../components/puzzles/InkDropReveal.tsx";
import AudioMatching from "../components/puzzles/AudioMatching.tsx";
import RewardPopup from "../components/RewardPopup.tsx";
import FinalMessage from "../components/FinalMessage.tsx";


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
                const res : Response = await apiFetch(`/api/shard/${id}`);
                const data: Shard = await res.json() as Shard; // await deconstructs return type Promise<Shard>.
                setShardData(data);
            }
            catch (err) {
                console.log("Failed to load puzzle data", err);
            }
        }
        fetchPuzzles()
    }, [id]);

    useEffect(() => {
        if (shardData) {
            document.title = `Shard ${shardData.id} | AALC Interactive`;
        } else {
            document.title = 'Loading Shard | AALC Interactive';
        }
    }, [shardData]);


    console.log(shardData);


    function handleShardComplete() {
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        void apiFetch("/api/progress/complete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: Number(userId), shardId: Number(id) }) // Foreign key for UserShardProgress db table
        })
            .then(() => navigate("/storyline"));
    }


    // Shard-9 has specialised rewards Complete for final Message rendering.
    const isShard9 = shardData?.id === 9;
    const [showShard9Reward, setShowShard9Reward] = useState(false);
    const [showFinalMessage, setShowFinalMessage] = useState(false);
    const [puzzleExiting, setPuzzleExiting] = useState(false);

    const handleShard9RewardComplete = () => {
        const userId = localStorage.getItem("userId");
        if (!userId) return;
        setShowShard9Reward(false); 
        setPuzzleExiting(true);    // Removing puzzle render for FinalMessage render.
        void apiFetch("/api/progress/complete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: Number(userId), shardId: Number(id) })
        }).then(() => setTimeout(() => setShowFinalMessage(true), 1000));
    };

    return (
        <main className="shard-page">
            <Header />

            {/* Shard-9 custom sequence: InkDropReveal -> ContextView -> FillInTheBlank -> FinalMessage */}
            { isShard9 && shardData && (
                <>
                    { !showFinalMessage && (
                        <div className={`shard9-content ${puzzleExiting ? "shard9-content--exit" : ""}`}>
                            { currentStep === 0 && (
                                <InkDropReveal
                                    onComplete={() => { setCurrentStep(1); }}
                                    rewardsText={ shardData.rewardsText }
                                    showReward={false}
                                />
                            )}
                            { currentStep === 1 && (
                                <ContextView
                                    content={ shardContent[shardData.id] }
                                    onNext={() => { setCurrentStep(2); }}
                                    onBack={() => { setCurrentStep(0); }}
                                />
                            )}
                            { currentStep === 2 && (
                                <FillInTheBlank
                                    question={shardData.fitb_question}
                                    answers={ shardData.fitb_answer }
                                    onCorrect={() => { setShowShard9Reward(true); }}
                                    onBack={() => { setCurrentStep(1); }}
                                    isShard9={isShard9}
                                />
                            )}
                            { showShard9Reward && (
                                <RewardPopup
                                    rewardsText={ shardData.rewardsText }
                                    onComplete={ handleShard9RewardComplete }
                                />
                            )}
                        </div>
                    )}
                    { showFinalMessage && (
                        <FinalMessage onBack={() => navigate("/")} />
                    )}
                </>
            )}

            {/* Default sequence for all other shards: ContextView → FillInTheBlank → Puzzle */}
            { !isShard9 && (
                <>
                    { currentStep === 0 && shardData && (
                        <ContextView
                            content={ shardContent[shardData.id] }
                            onNext={() => { setCurrentStep(currentStep + 1); }}
                            onBack={() => navigate("/storyline") }
                        />
                    )}

                    { currentStep === 1 && shardData && (
                        <FillInTheBlank
                            question={shardData.fitb_question}   // NOTE::: HAVE QUESTION IN HERE
                            answers={ shardData.fitb_answer }    // Contains wrong options as well. 1st is the is right answer.
                            onCorrect={() => { setCurrentStep(currentStep + 1); }}
                            onBack={() => { setCurrentStep(currentStep - 1); }}
                            isShard9={ isShard9 }
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

                            {/* For Shard-4 Decision Tree */}
                            { shardData.puzzleType === "DECISION_TREE" && (
                                <DecisionTree
                                    onComplete={ () => { handleShardComplete(); }}
                                    rewardsText={ shardData.rewardsText }
                                />
                            ) }

                            {/* For Shard-5 */}
                            { shardData.puzzleType === "COMMUNICATION_NETWORK" && (
                                <CommunicationNetwork
                                    onComplete={() => { handleShardComplete(); }}
                                    rewardsText={ shardData.rewardsText }
                                />
                            )}

                            {/* For Shard-6 (This still needs work!!!) */}
                            { shardData.puzzleType === "CONNECT_MATCHING" && (
                                <ConnectMatching
                                    onComplete={ () => { handleShardComplete(); }}
                                    rewardsText={ shardData.rewardsText }
                                />
                            ) }

                            {/* For Shard-7 */}
                            { shardData.puzzleType === "DRAG_AND_CATEGORISE" && (
                                <DragAndCategorise
                                    onComplete={() => { handleShardComplete(); }}
                                    rewardsText={ shardData.rewardsText }
                                />
                            )}

                            {/* For Shard-8 */}
                            { shardData.puzzleType === "AUDIO_MATCHING_PUZZLE" && (
                                <AudioMatching
                                    onComplete={() => { handleShardComplete(); }}
                                    rewardsText={shardData.rewardsText}
                                />
                            ) }
                        </>
                    }
                </>
            )}
        </main>
    );
}

export default ShardPage;
