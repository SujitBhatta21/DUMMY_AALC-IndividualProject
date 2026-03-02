import { useState } from "react";
import "../../styles/Puzzle.css"
import "../../styles/DecisionTree.css"


interface DecisionTreeProps {
    onComplete?: () => void,
    rewardsTet?: string
}

interface Choice {
    label: string;
    feedback: string;
    nextNodeId: number | null;  // null for puzzle complete
}

interface DecisionNode {
    id: number;
    text: string;
    choices: Choice[];
}

interface UserChoiceHistory {
    question: string;
    chosenLabel: string;
    feedback: string;
}

const nodes: Record<number, DecisionNode> = {
    1: {
        id: 1,
        text: "It's 1976. You're a student in London and you've just heard about apartheid in South Africa for the first time. What do you do?",
        choices: [
            {
                label: "Ignore it? it's happening far away and doesn't affect you.",
                feedback: "You walk away. But the next day, you see a poster on your university wall about apartheid. You can't ignore it anymore.",
                nextNodeId: 1,
            },
            {
                label: "Tell your friends what you heard.",
                feedback: "Your friends are shocked. Together, you decide to find out more.",
                nextNodeId: 2,
            },
        ],
    },
    2: {
        id: 2,
        text: "Your friends are shocked. Now what?",
        choices: [
            {
                label: "Organise a meeting to learn more.",
                feedback: "Great choice - you gather a group and start researching what's really happening in South Africa.",
                nextNodeId: 3,
            },
            {
                label: "Post about it on the university noticeboard.",
                feedback: "Also a great choice - other students start asking questions and wanting to help.",
                nextNodeId: 3,
            },
        ],
    },
    3: {
        id: 3,
        text: "You find out Barclays Bank invests money in apartheid South Africa. What do you do?",
        choices: [
            {
                label: "Close your Barclays bank account and tell others to do the same.",
                feedback: "You took action! Thousands of students did exactly this. The boycott became one of the most effective anti-apartheid campaigns in Britain.",
                nextNodeId: null,
            },
            {
                label: "Write to your local MP demanding action.",
                feedback: "Great move — political pressure mattered too. MPs began raising apartheid in Parliament, increasing pressure on the government.",
                nextNodeId: null,
            },
            {
                label: "Do nothing - it's just a bank.",
                feedback: "Without pressure, companies keep profiting from apartheid. Every voice matters.",
                nextNodeId: 3,
            },
        ],
    },
};


function DecisionTree({ onComplete, rewardsText } : DecisionTreeProps) {
    const [currentNodeId, setCurrentNodeId] = useState<number>(1);
    const [feedback, setFeedback] = useState<string | null>(null);
    const [completed, setCompleted] = useState<boolean>(false);
    // isTransitioning is making sure button is disabled when user is seeing the feedback.
    const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
    const [userChoiceHistory, setUserChoiceHistory] = useState<UserChoiceHistory[]>([]);

    const currentNode = nodes[currentNodeId];


    const handleChoice = (choice: Choice) => {
        if (isTransitioning) return;

        setIsTransitioning(true);
        setFeedback(choice.feedback);

        setUserChoiceHistory(prev => [
            ...prev,
            {
                question: currentNode.text,
                chosenLabel: choice.label,
                feedback: choice.feedback,
            }
        ].slice(-3)); // Slice makes it so only last 3 elem in this arr is stored.

        if (choice.nextNodeId === null) {
            setCompleted(true);
            setIsTransitioning(false);
            return;
        }

        // Auto-advance to the next node after a delay
        setTimeout(() => {
            setCurrentNodeId(choice.nextNodeId as number);
            setFeedback(null);
            setIsTransitioning(false);
        }, 2500);
    };

    return (
        <div>
            <h1 className="puzzle-title">You're the Activist</h1>
            <p className="puzzle-instruction">
                Make choices as a 1970s London student discovering apartheid. Top section stores user last 3 choices with feedback.
            </p>
            <section className="decisionTree-section">
                {/* History timeline */}
                { userChoiceHistory.length > 0 && (
                    <div className="decisionTree-history">
                        { userChoiceHistory.map((history, index) => (
                            <div key={index} className="history-step">
                                <div className="history-connector"></div>
                                <div className="history-content">
                                    <p className="history-question"><b>Question: </b> {history.question}</p>
                                    <p className="history-choice"><b>Your choice:</b> {history.chosenLabel}</p>
                                    <p className="history-feedback"><b>Feedback:</b> {history.feedback}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Current active question */}
                { !completed && (
                    <div className="decisionTree-current">
                        <div className="history-connector" />
                        <p className="decisionTree-question">{currentNode.text}</p>

                        {/* Show choices only when no feedback is displayed */}
                        { !feedback && (
                            <div className="decisionTree-choices">
                                { currentNode.choices.map((choice, index) => (
                                    <button
                                        key={index}
                                        className="decisionTree-choice-btn"
                                        onClick={() => { handleChoice(choice); }}
                                    >
                                        {choice.label}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Show feedback briefly before auto-advancing */}
                        { feedback && (
                            <div className="decisionTree-feedback">
                                <p>{feedback}</p>
                            </div>
                        )}
                    </div>
                )}
            </section>

            { completed && (
                <div className="reward-overlay">
                    <div className="reward-popup">
                        <h3>Shard Unlocked!</h3>
                        <p>{ rewardsText }</p>
                        <button className="next-button" onClick={onComplete}>CONTINUE</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DecisionTree;